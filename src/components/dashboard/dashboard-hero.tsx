import { useEffect, useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { motion } from 'framer-motion'
import {
  Crown,
  Zap,
  Calendar,
  RefreshCw,
  Flame,
  BookOpen,
  TrendingUp,
  Sprout,
  Stethoscope,
  Award,
  Star,
  ChevronRight,
  Clock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Subscription } from '@/lib/subscription'
import type { Rank } from '@/lib/gamification'
import { useNavigate } from 'react-router-dom'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`

const HeroWrapper = styled.div`
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  padding: 2rem;
  background: var(--card);
  border: 1px solid rgba(59, 130, 246, 0.18);
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.06),
    0 4px 24px rgba(59, 130, 246, 0.05),
    inset 0 1px 0 rgba(59, 130, 246, 0.08);
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      ellipse 60% 40% at 90% 0%,
      rgba(59, 130, 246, 0.04) 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 1rem;
  }
`

const GridLines = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.025;
  background-image:
    linear-gradient(to right, currentColor 1px, transparent 1px),
    linear-gradient(to bottom, currentColor 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
`

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr auto;
    align-items: start;
  }
`

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const GreetingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

const GreetingLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--muted-foreground);
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

const GreetingName = styled.h1`
  font-size: clamp(1.625rem, 3vw, 2.25rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: var(--foreground);
  margin: 0;
`

const ShimmerText = styled.span<{ $color: string }>`
  background: linear-gradient(
    90deg,
    ${({ $color }) => $color} 0%,
    #ffffff 40%,
    ${({ $color }) => $color} 60%,
    ${({ $color }) => $color} 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 2.2s linear 1 forwards;
`

const SubGreeting = styled.p`
  font-size: 0.9375rem;
  color: var(--muted-foreground);
  margin: 0;
`

const RankBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const RankIconBox = styled(motion.div)<{ $bgColor: string; $borderColor: string }>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bgColor }) => $bgColor};
  border: 2px solid ${({ $borderColor }) => $borderColor};
  flex-shrink: 0;
  animation: ${float} 3s ease-in-out infinite;
  position: relative;
`

const RankLvlPip = styled.div<{ $bgColor: string; $borderColor: string }>`
  position: absolute;
  top: -0.375rem;
  right: -0.375rem;
  font-size: 0.5rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 0.15rem 0.35rem;
  border-radius: 9999px;
  background: ${({ $bgColor }) => $bgColor};
  border: 1.5px solid ${({ $borderColor }) => $borderColor};
  color: currentColor;
  line-height: 1;
`

const RankInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
  min-width: 0;
`

const RankNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const RankName = styled.span<{ $color: string }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
`

const XpPill = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.625rem;
  border-radius: 9999px;
  background: var(--secondary);
  border: 1px solid var(--border);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--secondary-foreground);
`

const RankNextText = styled.p`
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  margin: 0;
`

const ProgressTrack = styled.div`
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--muted);
  overflow: hidden;
  position: relative;
`

const ProgressFill = styled(motion.div)<{ $color: string }>`
  position: absolute;
  inset-block: 0;
  left: 0;
  border-radius: 9999px;
  background: ${({ $color }) => $color};
`

const ProgressGlow = styled(motion.div)<{ $color: string }>`
  position: absolute;
  inset-block: 0;
  left: 0;
  border-radius: 9999px;
  background: ${({ $color }) => $color};
  filter: blur(4px);
  opacity: 0.3;
`

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const StatChip = styled(motion.div)<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.625rem;
  border-radius: 0.5rem;
  background: ${({ $color }) => $color}18;
  border: 1px solid ${({ $color }) => $color}30;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--foreground);

  svg {
    color: ${({ $color }) => $color};
  }

  strong {
    font-weight: 700;
  }
`

const SubscriptionPanel = styled(motion.div)<{ $accent: string }>`
  min-width: 260px;
  max-width: 300px;
  border-radius: 1rem;
  border: 1px solid ${({ $accent }) => $accent}40;
  background: ${({ $accent }) => $accent}08;
  padding: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 1023px) {
    max-width: 100%;
  }
`

const SubHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SubPlanRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`

const SubIconCircle = styled.div<{ $color: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => $color}18;
  border: 1px solid ${({ $color }) => $color}30;
  flex-shrink: 0;
`

const SubLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--muted-foreground);
  margin: 0 0 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const SubPlanName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const SubPlanText = styled.span`
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--foreground);
`

const SubBadge = styled.span<{ $color: string }>`
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  background: ${({ $color }) => $color}20;
  border: 1px solid ${({ $color }) => $color}40;
  color: ${({ $color }) => $color};
  letter-spacing: 0.04em;
`

const SpinIcon = styled.span<{ $spinning?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ $spinning }) => $spinning && css`animation: ${spin} 1s linear infinite;`}
`

const RefreshBtn = styled.button`
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted-foreground);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;

  &:hover {
    background: var(--accent);
    color: var(--foreground);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Divider = styled.div`
  height: 1px;
  background: var(--border);
  opacity: 0.6;
`

const TimerLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  font-weight: 500;
`

const TimerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.375rem;
`

const TimerCell = styled(motion.div)<{ $accent: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.25rem;
  border-radius: 0.625rem;
  background: var(--background);
  border: 1px solid ${({ $accent }) => $accent}25;
`

const TimerNumber = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
  color: var(--foreground);
`

const TimerUnit = styled.span`
  font-size: 0.625rem;
  font-weight: 500;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const EndDateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
`

const UpgradeBtn = styled(motion.button)<{ $color: string }>`
  width: 100%;
  padding: 0.5625rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${({ $color }) => $color};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.88;
  }
`

const RANK_ICONS: Record<string, LucideIcon> = {
  seedling: Sprout,
  book: BookOpen,
  stethoscope: Stethoscope,
  award: Award,
  star: Star,
  crown: Crown,
  flame: Flame,
}

interface DashboardHeroProps {
  user: { email?: string } | null
  subscription: Subscription | null
  hasActiveSubscription: boolean
  currentRank: Rank | null
  nextRank: Rank | null
  totalXp: number
  rankProgress: number
  loginStreak: number
  lessonsCompleted: number
  coursesCompleted: number
  onRefresh?: () => void
  refreshing?: boolean
}

export function DashboardHero({
  user,
  subscription,
  hasActiveSubscription,
  currentRank,
  nextRank,
  totalXp,
  rankProgress,
  loginStreak,
  lessonsCompleted,
  coursesCompleted,
  onRefresh,
  refreshing,
}: DashboardHeroProps) {
  const navigate = useNavigate()
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!subscription?.current_period_end) return
    const calc = () => {
      const diff = Math.max(0, new Date(subscription.current_period_end!).getTime() - Date.now())
      setTimeRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [subscription?.current_period_end])

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Dobre rano'
    if (h < 18) return 'Dobre odpoledne'
    return 'Dobry vecer'
  }

  const username = user?.email?.split('@')[0] || 'Studente'
  const RankIcon = currentRank ? (RANK_ICONS[currentRank.icon] || Star) : Star

  const accentHex = '#3b82f6'

  const subAccentHex = '#3b82f6'

  const getPlanLabel = () => {
    switch (subscription?.plan_type) {
      case 'free_trial': return 'Zkusebni verze'
      case 'monthly': return 'Mesicni plan'
      case 'lifetime': return 'Dozivotni pristup'
      default: return 'Zadne predplatne'
    }
  }

  const getBadgeLabel = () => {
    switch (subscription?.plan_type) {
      case 'free_trial': return 'Zkusebni'
      case 'monthly': return 'Premium'
      case 'lifetime': return 'Dozivotni'
      default: return null
    }
  }

  const SubIcon = subscription?.plan_type === 'lifetime' ? Crown :
                  subscription?.plan_type === 'free_trial' ? Zap : Calendar

  if (!mounted) return null

  return (
    <HeroWrapper as={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
    >
      <GridLines />

      <Content>
        <LeftCol>
          <GreetingSection>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GreetingLabel>{getGreeting()},</GreetingLabel>
              <GreetingName>
                <ShimmerText $color={accentHex}>{username}</ShimmerText>
              </GreetingName>
              <SubGreeting>Vitejte zpet. Pokracujte ve svem uceni.</SubGreeting>
            </motion.div>
          </GreetingSection>

          {currentRank && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
            >
              <RankBlock>
                <RankIconBox
                  $bgColor={`${accentHex}18`}
                  $borderColor={`${accentHex}40`}
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <RankIcon style={{ width: '1.5rem', height: '1.5rem', color: accentHex }} />
                  <RankLvlPip $bgColor={`${accentHex}18`} $borderColor={`${accentHex}40`} style={{ color: accentHex }}>
                    LVL
                  </RankLvlPip>
                </RankIconBox>

                <RankInfo>
                  <RankNameRow>
                    <RankName $color={accentHex}>{currentRank.name}</RankName>
                    <XpPill
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, delay: 0.35 }}
                    >
                      <Zap style={{ width: '0.75rem', height: '0.75rem' }} />
                      {totalXp} XP
                    </XpPill>
                  </RankNameRow>

                  {nextRank && (
                    <RankNextText>
                      {nextRank.minXp - totalXp} XP do ranku{' '}
                      <strong style={{ color: 'var(--foreground)', fontWeight: 600 }}>{nextRank.name}</strong>
                    </RankNextText>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>Pokrok</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{rankProgress}%</span>
                    </div>
                    <ProgressTrack>
                      <ProgressFill
                        $color={accentHex}
                        initial={{ width: 0 }}
                        animate={{ width: `${rankProgress}%` }}
                        transition={{ duration: 1.4, ease: [0.33, 1, 0.68, 1], delay: 0.4 }}
                      />
                      <ProgressGlow
                        $color={accentHex}
                        initial={{ width: 0 }}
                        animate={{ width: `${rankProgress}%` }}
                        transition={{ duration: 1.4, ease: [0.33, 1, 0.68, 1], delay: 0.4 }}
                      />
                    </ProgressTrack>
                  </div>

                  <StatsRow>
                    {[
                      { icon: Flame, color: '#f97316', label: `${loginStreak} dnu v rade` },
                      { icon: BookOpen, color: '#22c55e', label: `${lessonsCompleted} lekci` },
                      { icon: TrendingUp, color: '#3b82f6', label: `${coursesCompleted} kurzu` },
                    ].map(({ icon: Icon, color, label }, i) => (
                      <StatChip
                        key={label}
                        $color={color}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 350 }}
                        whileHover={{ scale: 1.06 }}
                      >
                        <Icon style={{ width: '0.75rem', height: '0.75rem' }} />
                        <strong>{label}</strong>
                      </StatChip>
                    ))}
                  </StatsRow>
                </RankInfo>
              </RankBlock>
            </motion.div>
          )}
        </LeftCol>

        <SubscriptionPanel
          $accent={subAccentHex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: [0.33, 1, 0.68, 1] }}
        >
          <SubHeader>
            <SubPlanRow>
              <SubIconCircle $color={subAccentHex}>
                <SubIcon style={{ width: '1.125rem', height: '1.125rem', color: subAccentHex }} />
              </SubIconCircle>
              <div>
                <SubLabel>Predplatne</SubLabel>
                <SubPlanName>
                  <SubPlanText>{getPlanLabel()}</SubPlanText>
                  {getBadgeLabel() && hasActiveSubscription && (
                    <SubBadge $color={subAccentHex}>{getBadgeLabel()}</SubBadge>
                  )}
                </SubPlanName>
              </div>
            </SubPlanRow>
            {onRefresh && (
              <RefreshBtn onClick={onRefresh} disabled={refreshing} title="Aktualizovat">
                <SpinIcon $spinning={refreshing}>
                  <RefreshCw style={{ width: '0.875rem', height: '0.875rem' }} />
                </SpinIcon>
              </RefreshBtn>
            )}
          </SubHeader>

          {subscription?.current_period_end &&
           subscription.plan_type !== 'lifetime' && (
            <>
              <Divider />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <TimerLabel>
                  <Clock style={{ width: '0.75rem', height: '0.75rem' }} />
                  {subscription.plan_type === 'free_trial' ? 'Konci za' : 'Obnovuje se za'}
                </TimerLabel>
                <TimerGrid>
                  {[
                    { val: timeRemaining.days, unit: 'Dnu' },
                    { val: timeRemaining.hours, unit: 'Hodin' },
                    { val: timeRemaining.minutes, unit: 'Minut' },
                    { val: timeRemaining.seconds, unit: 'Sekund' },
                  ].map(({ val, unit }, i) => (
                    <TimerCell
                      key={unit}
                      $accent={subAccentHex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.07, type: 'spring', stiffness: 300 }}
                    >
                      <TimerNumber>{String(val).padStart(2, '0')}</TimerNumber>
                      <TimerUnit>{unit}</TimerUnit>
                    </TimerCell>
                  ))}
                </TimerGrid>
                <EndDateRow>
                  <Calendar style={{ width: '0.75rem', height: '0.75rem', flexShrink: 0 }} />
                  <span>
                    {new Date(subscription.current_period_end).toLocaleDateString('cs-CZ', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </EndDateRow>
              </div>
            </>
          )}

          {subscription?.plan_type === 'lifetime' && (
            <>
              <Divider />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.625rem',
                background: `${subAccentHex}10`,
                border: `1px solid ${subAccentHex}25`,
              }}>
                <Crown style={{ width: '0.875rem', height: '0.875rem', color: subAccentHex, flexShrink: 0 }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--foreground)' }}>
                  Aktivni navzdy
                </span>
              </div>
            </>
          )}

          {!subscription && (
            <UpgradeBtn
              $color="#3b82f6"
              onClick={() => navigate('/#pricing')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Zobrazit plany
              <ChevronRight style={{ width: '0.875rem', height: '0.875rem' }} />
            </UpgradeBtn>
          )}

          {subscription?.plan_type === 'free_trial' && (
            <UpgradeBtn
              $color={subAccentHex}
              onClick={() => navigate('/#pricing')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Upgradovat plan
              <ChevronRight style={{ width: '0.875rem', height: '0.875rem' }} />
            </UpgradeBtn>
          )}
        </SubscriptionPanel>
      </Content>
    </HeroWrapper>
  )
}
