import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled, { keyframes } from 'styled-components'
import {
  X,
  Check,
  Lock,
  BookOpen,
  Trophy,
  Zap,
  Star,
  Flame,
  Target,
  Brain,
  Medal,
  Crown,
  Shield,
  TrendingUp,
  Map,
} from 'lucide-react'
import { BADGES } from '@/lib/gamification'
import type { BadgeDefinition } from '@/lib/gamification'

const pulse = keyframes`
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { transform: scale(1.04); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
`

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  z-index: 50;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
`

const Panel = styled(motion.div)`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  width: 100%;
  max-width: 480px;
  min-height: 80vh;
  position: relative;
  overflow: hidden;
  margin: auto;
`

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`

const HeaderTitleText = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: var(--foreground);
`

const CloseBtn = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary);
  border: 1px solid var(--border);
  color: var(--muted-foreground);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: var(--accent);
    color: var(--foreground);
  }
`

const RoadmapContainer = styled.div`
  padding: 1.5rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
`

const NodeRow = styled.div<{ $offset: 'left' | 'center' | 'right' }>`
  width: 100%;
  display: flex;
  justify-content: ${({ $offset }) =>
    $offset === 'left' ? 'flex-start' :
    $offset === 'right' ? 'flex-end' : 'center'};
  padding: 0 1.5rem;
  position: relative;
`

const ConnectorLine = styled.div<{ $completed: boolean; $short?: boolean }>`
  width: 3px;
  height: ${({ $short }) => ($short ? '2rem' : '2.5rem')};
  margin: 0 auto;
  border-radius: 9999px;
  background: ${({ $completed }) => $completed
    ? 'linear-gradient(to bottom, #22c55e, #16a34a)'
    : 'var(--border)'};
  transition: background 0.4s;
`

const CourseNode = styled(motion.button)<{ $state: 'completed' | 'current' | 'locked' }>`
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  border: 3px solid ${({ $state }) =>
    $state === 'completed' ? '#16a34a' :
    $state === 'current' ? '#22c55e' :
    'var(--border)'};
  background: ${({ $state }) =>
    $state === 'completed' ? 'linear-gradient(135deg, #22c55e, #16a34a)' :
    $state === 'current' ? 'linear-gradient(135deg, #4ade80, #22c55e)' :
    'var(--secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $state }) => $state === 'locked' ? 'default' : 'pointer'};
  position: relative;
  transition: transform 0.2s;
  box-shadow: ${({ $state }) =>
    $state === 'completed' ? '0 4px 16px rgba(34, 197, 94, 0.3)' :
    $state === 'current' ? '0 4px 24px rgba(34, 197, 94, 0.5)' :
    'none'};
  animation: ${({ $state }) => $state === 'current' ? pulse : 'none'} 2.5s ease-in-out infinite;

  &:hover:not([disabled]) {
    transform: scale(1.08);
  }
`

const StartBubble = styled(motion.div)`
  position: absolute;
  top: -2.75rem;
  left: 50%;
  transform: translateX(-50%);
  background: #22c55e;
  color: white;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: -0.3rem;
    left: 50%;
    transform: translateX(-50%);
    width: 0.5rem;
    height: 0.5rem;
    background: #22c55e;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
  }
`

const BadgeNode = styled(motion.button)<{ $earned: boolean }>`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  border: 2.5px solid ${({ $earned }) => $earned ? '#f59e0b' : 'var(--border)'};
  background: ${({ $earned }) => $earned
    ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
    : 'var(--secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: ${({ $earned }) => $earned ? '0 4px 12px rgba(245, 158, 11, 0.35)' : 'none'};

  &:hover {
    transform: scale(1.1);
  }
`

const RankMilestone = styled(motion.div)<{ $achieved: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  border: 2px solid ${({ $achieved }) => $achieved ? 'var(--border)' : 'var(--border)'};
  background: ${({ $achieved }) => $achieved ? 'var(--accent)' : 'var(--secondary)'};
  opacity: ${({ $achieved }) => $achieved ? 1 : 0.5};
  min-width: 200px;
`

const NodeLabel = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const NodeWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const TooltipPopup = styled(motion.div)`
  position: absolute;
  z-index: 20;
  background: var(--popover);
  border: 1px solid var(--border);
  border-radius: 0.875rem;
  padding: 0.875rem;
  min-width: 180px;
  max-width: 220px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  pointer-events: none;
`

const SectionLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-foreground);
  text-align: center;
  padding: 0.5rem 1rem;
`

const BADGE_ICONS: Record<string, React.ElementType> = {
  footprints: Zap,
  'book-open': BookOpen,
  brain: Brain,
  target: Target,
  medal: Medal,
  sparkles: Star,
  'graduation-cap': Trophy,
  library: BookOpen,
  trophy: Trophy,
  star: Star,
  zap: Zap,
  flame: Flame,
  shield: Shield,
  mountain: Crown,
  'trending-up': TrendingUp,
  crown: Crown,
  gem: Star,
}

interface Course {
  id: string
  title: string
  description?: string
  order_index: number
}

interface Enrollment {
  course_id: string
  completed_at: string | null
  progress_percentage: number
}

interface Props {
  open: boolean
  onClose: () => void
  courses: Course[]
  enrollments: Enrollment[]
  earnedBadgeIds: Set<string>
  totalXp: number
  lessonsCompleted?: number
  coursesCompleted?: number
  loginStreak?: number
}

type NodeDef =
  | { type: 'course'; course: Course; state: 'completed' | 'current' | 'locked' }
  | { type: 'badge'; badge: BadgeDefinition; earned: boolean }
  | { type: 'rank_milestone'; rankId: string; rankName: string; rankColor: string; xpRequired: number; achieved: boolean }

const OFFSETS: Array<'left' | 'center' | 'right'> = ['center', 'right', 'center', 'left', 'center', 'right', 'center', 'left']

export function CourseRoadmapModal({
  open,
  onClose,
  courses,
  enrollments,
  earnedBadgeIds,
  totalXp,
}: Props) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const sortedCourses = [...courses].sort((a, b) => a.order_index - b.order_index)

  const isEnrolled = (courseId: string) => enrollments.some((e) => e.course_id === courseId)
  const isCompleted = (courseId: string) =>
    enrollments.some((e) => e.course_id === courseId && e.completed_at !== null)

  const getCourseState = (course: Course, idx: number): 'completed' | 'current' | 'locked' => {
    if (isCompleted(course.id)) return 'completed'
    if (isEnrolled(course.id)) return 'current'
    if (idx === 0) return 'current'
    const prev = sortedCourses[idx - 1]
    if (prev && isCompleted(prev.id)) return 'current'
    return 'locked'
  }

  const lessonBadges = BADGES.filter((b) => b.category === 'lessons').slice(0, 3)
  const courseBadges = BADGES.filter((b) => b.category === 'courses').slice(0, 2)
  const streakBadges = BADGES.filter((b) => b.category === 'streaks').slice(0, 2)

  const nodes: NodeDef[] = []

  nodes.push({
    type: 'rank_milestone',
    rankId: 'student',
    rankName: 'Student (200 XP)',
    rankColor: '#22c55e',
    xpRequired: 200,
    achieved: totalXp >= 200,
  })

  sortedCourses.forEach((course, idx) => {
    nodes.push({ type: 'course', course, state: getCourseState(course, idx) })

    if (lessonBadges[idx]) {
      nodes.push({
        type: 'badge',
        badge: lessonBadges[idx],
        earned: earnedBadgeIds.has(lessonBadges[idx].id),
      })
    }

    if (idx === 1) {
      nodes.push({
        type: 'rank_milestone',
        rankId: 'practitioner',
        rankName: 'Praktikant (500 XP)',
        rankColor: '#3b82f6',
        xpRequired: 500,
        achieved: totalXp >= 500,
      })
    }

    if (courseBadges[idx]) {
      nodes.push({
        type: 'badge',
        badge: courseBadges[idx],
        earned: earnedBadgeIds.has(courseBadges[idx].id),
      })
    }
  })

  streakBadges.forEach((badge) => {
    nodes.push({ type: 'badge', badge, earned: earnedBadgeIds.has(badge.id) })
  })

  nodes.push({
    type: 'rank_milestone',
    rankId: 'specialist',
    rankName: 'Specialista (1000 XP)',
    rankColor: '#06b6d4',
    xpRequired: 1000,
    achieved: totalXp >= 1000,
  })

  nodes.push({
    type: 'rank_milestone',
    rankId: 'expert',
    rankName: 'Expert (2500 XP)',
    rankColor: '#f59e0b',
    xpRequired: 2500,
    achieved: totalXp >= 2500,
  })

  nodes.push({
    type: 'rank_milestone',
    rankId: 'master',
    rankName: 'Mistr (5000 XP)',
    rankColor: '#f97316',
    xpRequired: 5000,
    achieved: totalXp >= 5000,
  })

  nodes.push({
    type: 'rank_milestone',
    rankId: 'grandmaster',
    rankName: 'Velmistr (10000 XP)',
    rankColor: '#ef4444',
    xpRequired: 10000,
    achieved: totalXp >= 10000,
  })

  return (
    <AnimatePresence>
      {open && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <Panel
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <Header>
              <HeaderTitle>
                <div style={{
                  width: '2rem', height: '2rem', borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #22c55e20, #22c55e40)',
                  border: '1.5px solid #22c55e50',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Map style={{ width: '1rem', height: '1rem', color: '#22c55e' }} />
                </div>
                <HeaderTitleText>Cesta Vzdelavani</HeaderTitleText>
              </HeaderTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.2rem 0.625rem',
                  borderRadius: '9999px',
                  background: 'var(--secondary)',
                  border: '1px solid var(--border)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  <Zap style={{ width: '0.75rem', height: '0.75rem', color: '#f59e0b' }} />
                  {totalXp} XP
                </div>
                <CloseBtn onClick={onClose}>
                  <X style={{ width: '0.875rem', height: '0.875rem' }} />
                </CloseBtn>
              </div>
            </Header>

            <RoadmapContainer>
              {nodes.map((node, idx) => {
                const offsetIdx = idx % OFFSETS.length
                const offset = node.type === 'rank_milestone' ? 'center' : OFFSETS[offsetIdx]
                const isLast = idx === nodes.length - 1

                if (node.type === 'course') {
                  const { course, state } = node
                  const iconColor = state === 'locked' ? 'var(--muted-foreground)' : 'white'

                  return (
                    <div key={course.id} style={{ width: '100%' }}>
                      <NodeRow $offset={offset}>
                        <NodeWrapper>
                          {state === 'current' && (
                            <StartBubble
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              POKRACOVAT
                            </StartBubble>
                          )}
                          <CourseNode
                            $state={state}
                            onMouseEnter={() => setHoveredNode(course.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.04, type: 'spring', stiffness: 400 }}
                          >
                            {state === 'completed' ? (
                              <Check style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} strokeWidth={3} />
                            ) : state === 'locked' ? (
                              <Lock style={{ width: '1.25rem', height: '1.25rem', color: iconColor }} />
                            ) : (
                              <BookOpen style={{ width: '1.25rem', height: '1.25rem', color: iconColor }} />
                            )}

                            {hoveredNode === course.id && (
                              <TooltipPopup
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                  top: '100%',
                                  left: offset === 'right' ? 'auto' : '50%',
                                  right: offset === 'right' ? '0' : 'auto',
                                  transform: offset === 'right' ? 'none' : 'translateX(-50%)',
                                  marginTop: '0.5rem',
                                  pointerEvents: 'none',
                                }}
                              >
                                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                                  {course.title}
                                </div>
                                {course.description && (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', lineHeight: 1.4 }}>
                                    {course.description.slice(0, 80)}{course.description.length > 80 ? '...' : ''}
                                  </div>
                                )}
                                <div style={{
                                  marginTop: '0.5rem',
                                  fontSize: '0.6875rem',
                                  fontWeight: 600,
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '9999px',
                                  display: 'inline-block',
                                  background: state === 'completed' ? '#22c55e20' : state === 'current' ? '#22c55e15' : 'var(--secondary)',
                                  color: state === 'completed' ? '#16a34a' : state === 'current' ? '#22c55e' : 'var(--muted-foreground)',
                                }}>
                                  {state === 'completed' ? 'Dokonceno' : state === 'current' ? 'Dostupne' : 'Uzamceno'}
                                </div>
                              </TooltipPopup>
                            )}
                          </CourseNode>

                          <NodeLabel style={{
                            position: 'static',
                            transform: 'none',
                            color: state === 'locked' ? 'var(--muted-foreground)' : 'var(--foreground)',
                          }}>
                            {course.title.length > 18 ? course.title.slice(0, 18) + '…' : course.title}
                          </NodeLabel>
                        </NodeWrapper>
                      </NodeRow>
                      {!isLast && (
                        <ConnectorLine $completed={state === 'completed'} />
                      )}
                    </div>
                  )
                }

                if (node.type === 'badge') {
                  const { badge, earned } = node
                  const BadgeIcon = BADGE_ICONS[badge.icon] || Star

                  return (
                    <div key={badge.id} style={{ width: '100%' }}>
                      <NodeRow $offset={offset}>
                        <NodeWrapper>
                          <BadgeNode
                            $earned={earned}
                            onMouseEnter={() => setHoveredNode(badge.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.04, type: 'spring', stiffness: 400 }}
                          >
                            {earned ? (
                              <BadgeIcon style={{ width: '1.125rem', height: '1.125rem', color: 'white' }} />
                            ) : (
                              <Lock style={{ width: '0.875rem', height: '0.875rem', color: 'var(--muted-foreground)' }} />
                            )}

                            {hoveredNode === badge.id && (
                              <TooltipPopup
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                  top: '100%',
                                  left: offset === 'right' ? 'auto' : '50%',
                                  right: offset === 'right' ? '0' : 'auto',
                                  transform: offset === 'right' ? 'none' : 'translateX(-50%)',
                                  marginTop: '0.5rem',
                                }}
                              >
                                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: earned ? '#f59e0b' : 'var(--foreground)', marginBottom: '0.25rem' }}>
                                  {badge.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{badge.description}</div>
                                {badge.reward && (
                                  <div style={{ marginTop: '0.375rem', fontSize: '0.6875rem', color: '#22c55e', fontWeight: 600 }}>
                                    Odmena: {badge.reward.label}
                                  </div>
                                )}
                              </TooltipPopup>
                            )}
                          </BadgeNode>

                          <NodeLabel style={{
                            position: 'static',
                            transform: 'none',
                            color: earned ? 'var(--foreground)' : 'var(--muted-foreground)',
                            fontSize: '0.6875rem',
                          }}>
                            {badge.name}
                          </NodeLabel>
                        </NodeWrapper>
                      </NodeRow>
                      {!isLast && (
                        <ConnectorLine $completed={earned} $short />
                      )}
                    </div>
                  )
                }

                if (node.type === 'rank_milestone') {
                  return (
                    <div key={node.rankId} style={{ width: '100%' }}>
                      <SectionLabel>Rank Milestone</SectionLabel>
                      <NodeRow $offset="center">
                        <RankMilestone
                          $achieved={node.achieved}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: node.achieved ? 1 : 0.45, scale: 1 }}
                          transition={{ delay: idx * 0.04 }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '2rem', height: '2rem',
                              borderRadius: '9999px',
                              background: node.achieved ? `${node.rankColor}25` : 'var(--secondary)',
                              border: `2px solid ${node.achieved ? node.rankColor : 'var(--border)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {node.achieved ? (
                                <Check style={{ width: '0.875rem', height: '0.875rem', color: node.rankColor }} strokeWidth={3} />
                              ) : (
                                <Lock style={{ width: '0.75rem', height: '0.75rem', color: 'var(--muted-foreground)' }} />
                              )}
                            </div>
                            <span style={{
                              fontSize: '0.8125rem',
                              fontWeight: 700,
                              color: node.achieved ? node.rankColor : 'var(--muted-foreground)',
                            }}>
                              {node.rankName}
                            </span>
                          </div>
                        </RankMilestone>
                      </NodeRow>
                      {!isLast && (
                        <ConnectorLine $completed={node.achieved} $short />
                      )}
                    </div>
                  )
                }

                return null
              })}

              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #f59e0b15, #ef444415)',
                border: '1.5px dashed #f59e0b40',
                textAlign: 'center',
                width: '100%',
              }}>
                <Crown style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b', margin: '0 auto 0.375rem' }} />
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--foreground)' }}>
                  Velmistr (10 000 XP)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                  Konecny cil cesty
                </div>
              </div>
            </RoadmapContainer>
          </Panel>
        </Overlay>
      )}
    </AnimatePresence>
  )
}
