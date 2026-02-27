import { useState, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, BookOpen, BarChart3, CreditCard, Award, Settings,
  FileText, ShoppingBag, Target, Layers, Search, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionItem {
  label: string
  path: string
  icon: LucideIcon
  keywords: string[]
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
  const [searchFocused, setSearchFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const pageTitle = getPageTitle(location.pathname)

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return sections.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.includes(q))
    )
  }, [searchQuery])

  const showResults = searchFocused && searchQuery.trim().length > 0

  const handleSelect = (path: string) => {
    navigate(path)
    setSearchQuery('')
    setSearchFocused(false)
    inputRef.current?.blur()
  }

  return (
    <div
      className={cn(
        'sticky top-0 z-30 border-b border-border/40 md:hidden',
        'bg-background'
      )}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="px-4 pt-1.5 pb-2">
        <h1 className="text-center text-lg font-semibold tracking-tight text-foreground">{pageTitle}</h1>
      </div>

      <div className="relative px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder="Hledat v aplikaci..."
            className="w-full h-9 rounded-lg bg-muted/50 border border-border/40 pl-9 pr-8 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setSearchQuery('')
                inputRef.current?.focus()
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-3 right-3 top-full mt-1 rounded-lg border bg-background shadow-lg overflow-hidden z-50"
            >
              {filteredSections.length > 0 ? (
                filteredSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.path}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(section.path)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-sm hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/80">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{section.label}</span>
                    </button>
                  )
                })
              ) : (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  Zadne vysledky pro "{searchQuery}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
