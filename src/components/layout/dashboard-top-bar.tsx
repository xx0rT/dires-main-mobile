import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, BookOpen, BarChart3, CreditCard, Award, Settings,
  FileText, ShoppingBag, Target, Layers, Search, X,
  GraduationCap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface SectionItem {
  label: string
  path: string
  icon: LucideIcon
  keywords: string[]
}

interface CourseResult {
  id: string
  title: string
}

interface TrainerResult {
  id: string
  full_name: string | null
  email: string
  trainer_role: string | null
}

const sections: SectionItem[] = [
  { label: 'Prehled', path: '/prehled', icon: Home, keywords: ['prehled', 'domu', 'home', 'dashboard'] },
  { label: 'Moje Kurzy', path: '/prehled/moje-kurzy', icon: BookOpen, keywords: ['kurzy', 'courses', 'moje'] },
  { label: 'Pokrok', path: '/prehled/pokrok', icon: BarChart3, keywords: ['pokrok', 'progress', 'statistiky'] },
  { label: 'Predplatne', path: '/prehled/predplatne', icon: CreditCard, keywords: ['predplatne', 'subscription', 'plan'] },
  { label: 'Certifikaty', path: '/prehled/certifikaty', icon: Award, keywords: ['certifikaty', 'certificates'] },
  { label: 'Nastaveni', path: '/prehled/nastaveni', icon: Settings, keywords: ['nastaveni', 'settings', 'profil'] },
  { label: 'Faktury', path: '/prehled/faktury', icon: FileText, keywords: ['faktury', 'invoices'] },
  { label: 'Objednavky', path: '/prehled/fakturace', icon: ShoppingBag, keywords: ['objednavky', 'orders', 'fakturace'] },
  { label: 'Vysledky Testu', path: '/prehled/vysledky-testu', icon: Target, keywords: ['vysledky', 'test', 'results'] },
  { label: 'Analytika', path: '/prehled/analytika', icon: Layers, keywords: ['analytika', 'analytics', 'studijni'] },
]

const pageTitles: Record<string, string> = {
  '/prehled': 'Prehled',
  '/prehled/moje-kurzy': 'Moje Kurzy',
  '/prehled/pokrok': 'Pokrok',
  '/prehled/predplatne': 'Predplatne',
  '/prehled/certifikaty': 'Certifikaty',
  '/prehled/nastaveni': 'Nastaveni',
  '/prehled/faktury': 'Faktury',
  '/prehled/fakturace': 'Objednavky',
  '/prehled/vysledky-testu': 'Vysledky Testu',
  '/prehled/analytika': 'Analytika',
  '/prehled/treneri': 'Treneri',
  '/prehled/zpravy': 'Zpravy',
}

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname]
  for (const [path, title] of Object.entries(pageTitles)) {
    if (path !== '/prehled' && pathname.startsWith(path + '/')) return title
  }
  return 'Prehled'
}

export function DashboardTopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [courseResults, setCourseResults] = useState<CourseResult[]>([])
  const [trainerResults, setTrainerResults] = useState<TrainerResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const pageTitle = getPageTitle(location.pathname)
  const isMessagesPage = location.pathname.startsWith('/prehled/zpravy')

  useEffect(() => {
    const scrollParent = barRef.current?.closest('.overflow-y-auto')
    if (!scrollParent) return

    const handleScroll = () => {
      setScrolled(scrollParent.scrollTop > 10)
    }

    scrollParent.addEventListener('scroll', handleScroll, { passive: true })
    return () => scrollParent.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return sections.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.includes(q))
    )
  }, [searchQuery])

  useEffect(() => {
    const q = searchQuery.trim()
    if (q.length < 2) {
      setCourseResults([])
      setTrainerResults([])
      return
    }

    const timer = setTimeout(async () => {
      const escaped = q.replace(/%/g, '\\%').replace(/_/g, '\\_')

      const [coursesRes, trainersRes] = await Promise.all([
        supabase
          .from('courses')
          .select('id, title')
          .eq('published', true)
          .ilike('title', `%${escaped}%`)
          .limit(5),
        supabase
          .from('profiles')
          .select('id, full_name, email, trainer_role')
          .eq('is_trainer', true)
          .or(`full_name.ilike.%${escaped}%,email.ilike.%${escaped}%`)
          .limit(5),
      ])

      setCourseResults(coursesRes.data ?? [])
      setTrainerResults(trainersRes.data ?? [])
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const hasAnyResults = filteredSections.length > 0 || courseResults.length > 0 || trainerResults.length > 0
  const showResults = searchQuery.trim().length > 0

  const handleSelect = useCallback((path: string) => {
    navigate(path)
    setSearchQuery('')
    setCourseResults([])
    setTrainerResults([])
    inputRef.current?.blur()
  }, [navigate])

  return (
    <div
      ref={barRef}
      className={cn(
        'sticky top-0 z-30 border-b border-border/40 md:hidden',
        'bg-background'
      )}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      {isMessagesPage ? (
        <div />
      ) : (
        <>
          <div
            className="grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]"
            style={{
              gridTemplateRows: scrolled ? '0fr' : '1fr',
              opacity: scrolled ? 0 : 1,
            }}
          >
            <div className="overflow-hidden">
              <div className="px-4 pt-1.5 pb-2">
                <h1 className="text-center text-lg font-semibold tracking-tight text-foreground">{pageTitle}</h1>
              </div>
            </div>
          </div>

          <div className="relative px-3 pb-3">
            <div className="flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hledat v aplikaci..."
                  className="w-full h-9 rounded-lg bg-muted/50 border border-border/40 pl-9 pr-8 text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSearchQuery('')
                      setCourseResults([])
                      setTrainerResults([])
                      inputRef.current?.focus()
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {showResults && (
                <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setSearchQuery('')
                    setCourseResults([])
                    setTrainerResults([])
                    inputRef.current?.blur()
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-3 right-3 top-full mt-1 rounded-lg border bg-background shadow-lg overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
                  style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  {hasAnyResults ? (
                    <>
                      <SearchGroup
                        label="Stranky"
                        items={filteredSections.map(s => ({
                          key: s.path,
                          icon: s.icon,
                          name: s.label,
                        }))}
                        onSelect={handleSelect}
                      />

                      <SearchGroup
                        label="Kurzy"
                        items={courseResults.map(c => ({
                          key: c.id,
                          path: `/kurz/${c.id}`,
                          icon: BookOpen,
                          name: c.title,
                        }))}
                        onSelect={handleSelect}
                      />

                      <SearchGroup
                        label="Treneri"
                        items={trainerResults.map(t => ({
                          key: t.id,
                          path: `/prehled/treneri/${t.id}`,
                          icon: GraduationCap,
                          name: t.full_name || t.email.split('@')[0],
                          sublabel: t.trainer_role ?? undefined,
                        }))}
                        onSelect={handleSelect}
                      />
                    </>
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                      Zadne vysledky pro "{searchQuery}"
                    </div>
                  )}
                </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  )
}

interface SearchGroupItem {
  key: string
  path?: string
  icon: LucideIcon
  name: string
  sublabel?: string
}

function SearchGroup({
  label,
  items,
  onSelect,
}: {
  label: string
  items: SearchGroupItem[]
  onSelect: (path: string) => void
}) {
  if (items.length === 0) return null

  return (
    <div>
      <div className="px-3 pt-2 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {label}
        </span>
      </div>
      {items.map((item) => {
        const Icon = item.icon
        const path = item.path ?? item.key
        return (
          <button
            key={item.key}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(path)}
            className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm hover:bg-muted/60 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/80 flex-shrink-0">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground/60">{label}</span>
                <span className="text-[11px] text-muted-foreground/40">&rsaquo;</span>
                <span className="font-medium truncate">{item.name}</span>
              </div>
              {item.sublabel && (
                <p className="text-[11px] text-muted-foreground truncate">{item.sublabel}</p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
