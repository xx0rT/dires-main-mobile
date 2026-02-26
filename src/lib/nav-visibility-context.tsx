import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface NavVisibilityContextValue {
  mobileNavVisible: boolean
  showMobileNav: () => void
  hideMobileNav: () => void
}

const NavVisibilityContext = createContext<NavVisibilityContextValue>({
  mobileNavVisible: true,
  showMobileNav: () => {},
  hideMobileNav: () => {},
})

export function NavVisibilityProvider({ children }: { children: ReactNode }) {
  const [mobileNavVisible, setMobileNavVisible] = useState(false)

  const showMobileNav = useCallback(() => setMobileNavVisible(true), [])
  const hideMobileNav = useCallback(() => setMobileNavVisible(false), [])

  return (
    <NavVisibilityContext.Provider value={{ mobileNavVisible, showMobileNav, hideMobileNav }}>
      {children}
    </NavVisibilityContext.Provider>
  )
}

export function useNavVisibility() {
  return useContext(NavVisibilityContext)
}
