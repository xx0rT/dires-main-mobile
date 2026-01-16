export const mockCourses = [
  {
    id: 'course_1',
    title: 'Základy Webového Vývoje',
    description: 'Naučte se základy HTML, CSS a JavaScriptu pro vytváření moderních webových stránek',
    image_url: '/demo-img.png',
    price: 999,
    order_index: 0,
    is_published: true
  },
  {
    id: 'course_2',
    title: 'React pro Začátečníky',
    description: 'Ovládněte React a začněte budovat interaktivní uživatelská rozhraní',
    image_url: '/demo-img.png',
    price: 1499,
    order_index: 1,
    is_published: true
  },
  {
    id: 'course_3',
    title: 'Pokročilý TypeScript',
    description: 'Prohloubte své znalosti TypeScriptu a psaní typově bezpečného kódu',
    image_url: '/demo-img.png',
    price: 1999,
    order_index: 2,
    is_published: true
  },
  {
    id: 'course_4',
    title: 'Full-Stack Development',
    description: 'Vytvářejte kompletní webové aplikace od frontendu po backend',
    image_url: '/demo-img.png',
    price: 2499,
    order_index: 3,
    is_published: true
  }
]

export const mockModules = [
  {
    id: 'module_1_1',
    course_id: 'course_1',
    title: 'Úvod do HTML',
    description: 'Základní struktura HTML dokumentu a nejdůležitější tagy',
    content: '<p>V tomto modulu se naučíte základy HTML včetně struktury dokumentu, semantic tags a best practices.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 0,
    duration_minutes: 45
  },
  {
    id: 'module_1_2',
    course_id: 'course_1',
    title: 'CSS Styly a Layout',
    description: 'Naučte se stylovat webové stránky pomocí CSS',
    content: '<p>Naučíme se používat CSS pro stylování elementů, flexbox a grid layout.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 1,
    duration_minutes: 60
  },
  {
    id: 'module_1_3',
    course_id: 'course_1',
    title: 'JavaScript Základy',
    description: 'Základy programování v JavaScriptu',
    content: '<p>Probereme proměnné, funkce, podmínky a cykly v JavaScriptu.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 2,
    duration_minutes: 75
  },
  {
    id: 'module_2_1',
    course_id: 'course_2',
    title: 'Úvod do React',
    description: 'Co je React a proč ho používat',
    content: '<p>Začneme s React a vysvětlíme si základní koncepty.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 0,
    duration_minutes: 40
  },
  {
    id: 'module_2_2',
    course_id: 'course_2',
    title: 'React Komponenty',
    description: 'Vytváření a používání React komponent',
    content: '<p>Naučíme se vytvářet komponenty, props a state.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 1,
    duration_minutes: 55
  },
  {
    id: 'module_2_3',
    course_id: 'course_2',
    title: 'React Hooks',
    description: 'useState, useEffect a další hooks',
    content: '<p>Prozkoumáme React hooks a jejich praktické použití.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 2,
    duration_minutes: 65
  },
  {
    id: 'module_3_1',
    course_id: 'course_3',
    title: 'TypeScript Typy',
    description: 'Pokročilé typování v TypeScriptu',
    content: '<p>Naučíme se advanced types, generics a utility types.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 0,
    duration_minutes: 50
  },
  {
    id: 'module_3_2',
    course_id: 'course_3',
    title: 'TypeScript s React',
    description: 'Kombinace TypeScriptu s Reactem',
    content: '<p>Jak efektivně používat TypeScript v React projektech.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 1,
    duration_minutes: 60
  },
  {
    id: 'module_4_1',
    course_id: 'course_4',
    title: 'Backend s Node.js',
    description: 'Vytvoření API pomocí Node.js a Express',
    content: '<p>Naučíme se vytvářet REST API pomocí Node.js.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 0,
    duration_minutes: 70
  },
  {
    id: 'module_4_2',
    course_id: 'course_4',
    title: 'Databáze a ORM',
    description: 'Práce s databázemi a ORM nástroji',
    content: '<p>Prozkoumáme databáze a ORM pro efektivní práci s daty.</p>',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    order_index: 1,
    duration_minutes: 65
  }
]

const ENROLLMENTS_KEY = 'mock_enrollments'
const PROGRESS_KEY = 'mock_progress'

export interface MockEnrollment {
  id: string
  user_id: string
  course_id: string
  progress_percentage: number
  enrolled_at: string
  completed_at: string | null
}

export interface MockModuleProgress {
  id: string
  user_id: string
  module_id: string
  course_id: string
  watch_time_seconds: number
  last_watched_position: number
  is_completed: boolean
  completed_at: string | null
}

export const mockDatabase = {
  getEnrollments: (userId: string): MockEnrollment[] => {
    const stored = localStorage.getItem(ENROLLMENTS_KEY)
    if (!stored) return []

    try {
      const all = JSON.parse(stored)
      return all.filter((e: MockEnrollment) => e.user_id === userId)
    } catch {
      return []
    }
  },

  addEnrollment: (enrollment: Omit<MockEnrollment, 'id' | 'enrolled_at'>): void => {
    const stored = localStorage.getItem(ENROLLMENTS_KEY)
    const all = stored ? JSON.parse(stored) : []

    const newEnrollment: MockEnrollment = {
      ...enrollment,
      id: 'enroll_' + Math.random().toString(36).substr(2, 9),
      enrolled_at: new Date().toISOString()
    }

    all.push(newEnrollment)
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(all))
  },

  updateEnrollment: (userId: string, courseId: string, updates: Partial<MockEnrollment>): void => {
    const stored = localStorage.getItem(ENROLLMENTS_KEY)
    if (!stored) return

    try {
      const all = JSON.parse(stored)
      const index = all.findIndex((e: MockEnrollment) => e.user_id === userId && e.course_id === courseId)

      if (index !== -1) {
        all[index] = { ...all[index], ...updates }
        localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(all))
      }
    } catch {}
  },

  getModuleProgress: (userId: string, courseId?: string): MockModuleProgress[] => {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return []

    try {
      const all = JSON.parse(stored)
      return all.filter((p: MockModuleProgress) => {
        if (courseId) {
          return p.user_id === userId && p.course_id === courseId
        }
        return p.user_id === userId
      })
    } catch {
      return []
    }
  },

  upsertModuleProgress: (progress: Omit<MockModuleProgress, 'id'>): void => {
    const stored = localStorage.getItem(PROGRESS_KEY)
    const all = stored ? JSON.parse(stored) : []

    const existingIndex = all.findIndex(
      (p: MockModuleProgress) => p.user_id === progress.user_id && p.module_id === progress.module_id
    )

    if (existingIndex !== -1) {
      all[existingIndex] = {
        ...all[existingIndex],
        ...progress
      }
    } else {
      all.push({
        ...progress,
        id: 'progress_' + Math.random().toString(36).substr(2, 9)
      })
    }

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all))
  },

  getModuleProgressSingle: (userId: string, moduleId: string): MockModuleProgress | null => {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return null

    try {
      const all = JSON.parse(stored)
      return all.find((p: MockModuleProgress) => p.user_id === userId && p.module_id === moduleId) || null
    } catch {
      return null
    }
  }
}

export const mockAiTips = [
  "📚 Tip na učení: Vezměte si krátké přestávky každých 25-30 minut pro lepší koncentraci",
  "💡 Praktický tip: Zkuste si vytvořit vlastní projekt aplikující to, co jste se naučili",
  "🎯 Motivace: Konzistence je klíčem k úspěchu - věnujte učení alespoň 30 minut denně",
  "🔄 Opakování: Zrevidujte předchozí moduly pro lepší zapamatování konceptů",
  "👥 Komunita: Sdílejte své projekty a získejte zpětnou vazbu od ostatních studentů"
]
