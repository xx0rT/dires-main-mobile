export interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  order_index: number;
  is_published: boolean;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  video_url: string | null;
  order_index: number;
  duration_minutes: number;
}

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Základy Manuální Terapie',
    description: 'Naučte se základní techniky manuální terapie pro efektivní léčbu bolesti a zlepšení pohyblivosti pacientů.',
    image_url: 'https://images.pexels.com/photos/5794059/pexels-photo-5794059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    price: 2999,
    order_index: 0,
    is_published: true,
  },
  {
    id: 'course-2',
    title: 'Pokročilé Rehabilitační Metody',
    description: 'Rozšiřte své znalosti o pokročilé rehabilitační techniky a specializované přístupy k léčbě složitých případů.',
    image_url: 'https://images.pexels.com/photos/7187991/pexels-photo-7187991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    price: 3999,
    order_index: 1,
    is_published: true,
  },
  {
    id: 'course-3',
    title: 'Sportovní Fyzioterapie',
    description: 'Specializovaný kurz zaměřený na prevenci a léčbu sportovních zranění s důrazem na funkční rehabilitaci.',
    image_url: 'https://images.pexels.com/photos/7187827/pexels-photo-7187827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    price: 4999,
    order_index: 2,
    is_published: true,
  },
];

export const mockModules: CourseModule[] = [
  {
    id: 'module-1-1',
    course_id: 'course-1',
    title: 'Úvod do Manuální Terapie',
    description: 'Základní principy a historie manuální terapie',
    content: `
      <h2>Vítejte v kurzu Manuální Terapie</h2>
      <p>V tomto modulu se seznámíte se základními principy manuální terapie a její historií.</p>

      <h3>Co se naučíte:</h3>
      <ul>
        <li>Historie manuální terapie</li>
        <li>Základní principy a filozofie</li>
        <li>Indikace a kontraindikace</li>
        <li>Etika v manuální terapii</li>
      </ul>

      <h3>Klíčové koncepty:</h3>
      <p>Manuální terapie je komplexní přístup k diagnostice a léčbě pohybového aparátu pomocí manuálních technik.</p>
    `,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    order_index: 0,
    duration_minutes: 25,
  },
  {
    id: 'module-1-2',
    course_id: 'course-1',
    title: 'Anatomie a Fyziologie',
    description: 'Přehled anatomie a fyziologie pohybového aparátu',
    content: `
      <h2>Anatomie a Fyziologie</h2>
      <p>Detailní přehled anatomie a fyziologie relevantní pro manuální terapii.</p>

      <h3>Témata:</h3>
      <ul>
        <li>Stavba pohybového aparátu</li>
        <li>Kloubní mechanika</li>
        <li>Nervový systém</li>
        <li>Fasciální systém</li>
      </ul>
    `,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    order_index: 1,
    duration_minutes: 30,
  },
  {
    id: 'module-1-3',
    course_id: 'course-1',
    title: 'Základní Diagnostické Metody',
    description: 'Naučte se základní diagnostické přístupy',
    content: `
      <h2>Diagnostické Metody</h2>
      <p>Systematický přístup k diagnostice poruch pohybového aparátu.</p>

      <h3>Diagnostické nástroje:</h3>
      <ul>
        <li>Anamnéza</li>
        <li>Vyšetření pohledem</li>
        <li>Palpační vyšetření</li>
        <li>Funkční testy</li>
      </ul>
    `,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    order_index: 2,
    duration_minutes: 35,
  },
  {
    id: 'module-2-1',
    course_id: 'course-2',
    title: 'Pokročilé Mobilizační Techniky',
    description: 'Naučte se pokročilé mobilizační techniky',
    content: `
      <h2>Pokročilé Mobilizační Techniky</h2>
      <p>Detailní průvodce pokročilými mobilizačními technikami pro různé segmenty těla.</p>

      <h3>Obsah modulu:</h3>
      <ul>
        <li>Mobilizace páteře</li>
        <li>Mobilizace periferních kloubů</li>
        <li>Specifické mobilizační techniky</li>
        <li>Kontraindikace a bezpečnost</li>
      </ul>
    `,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    order_index: 0,
    duration_minutes: 40,
  },
  {
    id: 'module-2-2',
    course_id: 'course-2',
    title: 'Myofasciální Techniky',
    description: 'Techniky pro práci s fascií a měkkými tkáněmi',
    content: `
      <h2>Myofasciální Techniky</h2>
      <p>Praktické využití myofasciálních technik v klinické praxi.</p>

      <h3>Co se naučíte:</h3>
      <ul>
        <li>Anatomie fasciálního systému</li>
        <li>Trigger points</li>
        <li>Myofasciální relaxace</li>
        <li>Praktická aplikace</li>
      </ul>
    `,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    order_index: 1,
    duration_minutes: 45,
  },
  {
    id: 'module-3-1',
    course_id: 'course-3',
    title: 'Sportovní Zranění',
    description: 'Přehled nejčastějších sportovních zranění',
    content: `
      <h2>Sportovní Zranění</h2>
      <p>Komplexní přehled diagnostiky a léčby sportovních zranění.</p>

      <h3>Typy zranění:</h3>
      <ul>
        <li>Akutní zranění</li>
        <li>Přetížení</li>
        <li>Chronická zranění</li>
        <li>Prevence</li>
      </ul>
    `,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    order_index: 0,
    duration_minutes: 30,
  },
  {
    id: 'module-3-2',
    course_id: 'course-3',
    title: 'Funkční Rehabilitace',
    description: 'Návrat sportovce do plné výkonnosti',
    content: `
      <h2>Funkční Rehabilitace</h2>
      <p>Systematický přístup k návratu sportovce do plné sportovní aktivity.</p>

      <h3>Fáze rehabilitace:</h3>
      <ul>
        <li>Akutní fáze</li>
        <li>Subakutní fáze</li>
        <li>Funkční trénink</li>
        <li>Návrat do sportu</li>
      </ul>
    `,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    order_index: 1,
    duration_minutes: 50,
  },
];

export const getMockCourses = (): Course[] => {
  return mockCourses;
};

export const getMockCourseById = (id: string): Course | null => {
  return mockCourses.find(c => c.id === id) || null;
};

export const getMockModulesByCourseId = (courseId: string): CourseModule[] => {
  return mockModules.filter(m => m.course_id === courseId);
};

export const getMockModuleById = (id: string): CourseModule | null => {
  return mockModules.find(m => m.id === id) || null;
};
