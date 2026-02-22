import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import {
  BADGES,
  XP_REWARDS,
  getRankForXp,
  getNextRank,
  getXpProgressInRank,
  type BadgeDefinition,
  type Rank,
  type UserStats,
} from '@/lib/gamification'

interface UserXp {
  total_xp: number
  current_rank: string
  lessons_completed: number
  courses_completed: number
  login_streak: number
  longest_streak: number
  last_activity_date: string | null
}

interface EarnedBadge {
  badge_id: string
  earned_at: string
  xp_awarded: number
}

export interface ClaimedReward {
  badge_id: string
  reward_type: string
  reward_value: string
  reward_label: string
  claimed: boolean
  claimed_at: string | null
}

interface XpEvent {
  amount: number
  source: string
  newBadges: BadgeDefinition[]
  newRank: Rank | null
}

export function useGamification() {
  const { user } = useAuth()
  const [userXp, setUserXp] = useState<UserXp | null>(null)
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([])
  const [claimedRewards, setClaimedRewards] = useState<ClaimedReward[]>([])
  const [loading, setLoading] = useState(true)
  const [lastXpEvent, setLastXpEvent] = useState<XpEvent | null>(null)

  const loadData = useCallback(async () => {
    if (!user) return

    try {
      const [{ data: xpData }, { data: badgesData }, { data: rewardsData }] = await Promise.all([
        supabase
          .from('user_xp')
          .select('total_xp, current_rank, lessons_completed, courses_completed, login_streak, longest_streak, last_activity_date')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('user_badges')
          .select('badge_id, earned_at, xp_awarded')
          .eq('user_id', user.id),
        supabase
          .from('badge_rewards')
          .select('badge_id, reward_type, reward_value, reward_label, claimed, claimed_at')
          .eq('user_id', user.id),
      ])

      if (xpData) {
        setUserXp(xpData)
      } else {
        await supabase.from('user_xp').insert({
          user_id: user.id,
          total_xp: 0,
          current_rank: 'novice',
          lessons_completed: 0,
          courses_completed: 0,
          login_streak: 0,
          longest_streak: 0,
        })
        setUserXp({
          total_xp: 0,
          current_rank: 'novice',
          lessons_completed: 0,
          courses_completed: 0,
          login_streak: 0,
          longest_streak: 0,
          last_activity_date: null,
        })
      }

      setEarnedBadges(badgesData || [])
      setClaimedRewards(rewardsData || [])
    } catch (error) {
      console.error('Error loading gamification data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updateStreak = useCallback(async () => {
    if (!user || !userXp) return

    const today = new Date().toISOString().split('T')[0]
    if (userXp.last_activity_date === today) return

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let newStreak = 1
    if (userXp.last_activity_date === yesterdayStr) {
      newStreak = userXp.login_streak + 1
    }

    const newLongest = Math.max(newStreak, userXp.longest_streak)

    await supabase
      .from('user_xp')
      .update({
        login_streak: newStreak,
        longest_streak: newLongest,
        last_activity_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    setUserXp((prev) =>
      prev
        ? { ...prev, login_streak: newStreak, longest_streak: newLongest, last_activity_date: today }
        : prev,
    )
  }, [user, userXp])

  useEffect(() => {
    if (userXp && user) updateStreak()
  }, [user, userXp?.last_activity_date])

  const awardXp = useCallback(
    async (amount: number, source: string, sourceId?: string) => {
      if (!user || !userXp) return null

      const newTotalXp = userXp.total_xp + amount
      const newRankObj = getRankForXp(newTotalXp)
      const oldRankObj = getRankForXp(userXp.total_xp)
      const rankChanged = newRankObj.id !== oldRankObj.id

      await Promise.all([
        supabase
          .from('user_xp')
          .update({
            total_xp: newTotalXp,
            current_rank: newRankObj.id,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id),
        supabase.from('user_xp_history').insert({
          user_id: user.id,
          xp_amount: amount,
          source,
          source_id: sourceId || null,
        }),
      ])

      setUserXp((prev) =>
        prev ? { ...prev, total_xp: newTotalXp, current_rank: newRankObj.id } : prev,
      )

      const stats: UserStats = {
        lessonsCompleted: userXp.lessons_completed,
        coursesCompleted: userXp.courses_completed,
        loginStreak: userXp.login_streak,
        longestStreak: userXp.longest_streak,
        totalXp: newTotalXp,
      }

      const earnedBadgeIds = new Set(earnedBadges.map((b) => b.badge_id))
      const newBadges: BadgeDefinition[] = []

      for (const badge of BADGES) {
        if (!earnedBadgeIds.has(badge.id) && badge.condition(stats)) {
          newBadges.push(badge)
          await supabase.from('user_badges').insert({
            user_id: user.id,
            badge_id: badge.id,
            xp_awarded: badge.xpReward,
          })
          if (badge.xpReward > 0) {
            await supabase.from('user_xp_history').insert({
              user_id: user.id,
              xp_amount: badge.xpReward,
              source: 'badge_earned',
              source_id: badge.id,
            })
          }
          if (badge.reward) {
            await supabase.from('badge_rewards').insert({
              user_id: user.id,
              badge_id: badge.id,
              reward_type: badge.reward.type,
              reward_value: badge.reward.value,
              reward_label: badge.reward.label,
              claimed: false,
            })
            setClaimedRewards((prev) => [
              ...prev,
              {
                badge_id: badge.id,
                reward_type: badge.reward!.type,
                reward_value: badge.reward!.value,
                reward_label: badge.reward!.label,
                claimed: false,
                claimed_at: null,
              },
            ])
          }
        }
      }

      const badgeXp = newBadges.reduce((sum, b) => sum + b.xpReward, 0)
      if (badgeXp > 0) {
        const finalXp = newTotalXp + badgeXp
        const finalRank = getRankForXp(finalXp)
        await supabase
          .from('user_xp')
          .update({ total_xp: finalXp, current_rank: finalRank.id, updated_at: new Date().toISOString() })
          .eq('user_id', user.id)
        setUserXp((prev) => (prev ? { ...prev, total_xp: finalXp, current_rank: finalRank.id } : prev))
      }

      if (newBadges.length > 0) {
        setEarnedBadges((prev) => [
          ...prev,
          ...newBadges.map((b) => ({
            badge_id: b.id,
            earned_at: new Date().toISOString(),
            xp_awarded: b.xpReward,
          })),
        ])
      }

      const event: XpEvent = {
        amount: amount + badgeXp,
        source,
        newBadges,
        newRank: rankChanged ? newRankObj : null,
      }
      setLastXpEvent(event)
      return event
    },
    [user, userXp, earnedBadges],
  )

  const onLessonComplete = useCallback(
    async (lessonId: string) => {
      if (!user || !userXp) return null

      const newLessons = userXp.lessons_completed + 1
      await supabase
        .from('user_xp')
        .update({ lessons_completed: newLessons, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)

      setUserXp((prev) => (prev ? { ...prev, lessons_completed: newLessons } : prev))
      return awardXp(XP_REWARDS.lesson_complete, 'lesson_complete', lessonId)
    },
    [user, userXp, awardXp],
  )

  const onCourseComplete = useCallback(
    async (courseId: string) => {
      if (!user || !userXp) return null

      const newCourses = userXp.courses_completed + 1
      await supabase
        .from('user_xp')
        .update({ courses_completed: newCourses, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)

      setUserXp((prev) => (prev ? { ...prev, courses_completed: newCourses } : prev))
      return awardXp(XP_REWARDS.course_complete, 'course_complete', courseId)
    },
    [user, userXp, awardXp],
  )

  const claimReward = useCallback(
    async (badgeId: string) => {
      if (!user) return false
      const now = new Date().toISOString()
      const { error } = await supabase
        .from('badge_rewards')
        .update({ claimed: true, claimed_at: now })
        .eq('user_id', user.id)
        .eq('badge_id', badgeId)

      if (error) return false

      setClaimedRewards((prev) =>
        prev.map((r) =>
          r.badge_id === badgeId ? { ...r, claimed: true, claimed_at: now } : r,
        ),
      )
      return true
    },
    [user],
  )

  const clearLastEvent = useCallback(() => setLastXpEvent(null), [])

  const currentRank = userXp ? getRankForXp(userXp.total_xp) : null
  const nextRank = currentRank ? getNextRank(currentRank) : null
  const rankProgress = currentRank && userXp ? getXpProgressInRank(userXp.total_xp, currentRank) : 0

  return {
    userXp,
    earnedBadges,
    claimedRewards,
    loading,
    currentRank,
    nextRank,
    rankProgress,
    lastXpEvent,
    onLessonComplete,
    onCourseComplete,
    claimReward,
    clearLastEvent,
    reload: loadData,
  }
}
