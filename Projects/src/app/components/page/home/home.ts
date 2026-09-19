import { AfterViewInit, Component, HostListener, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Fact {
  value: string;
  label: string;
}

interface Project {
  id: number;
  name: string;
  year: number;
  role: string;
  scope: string;
  description: string;
  image: string;
  /** Optional film shown instead of the still; the still becomes its poster. */
  video?: string;
  videoLabel?: string;
  tagline?: string;
  githubLink: string;
  siteLink?: string;
  technologies: string[];
  featured?: boolean;
  facts?: Fact[];
}

interface Experience {
  org: string;
  role: string;
  period: string;
  bullets: string[];
  tools?: string;
}

interface SkillGroup {
  label: string;
  items: string;
}

@Component({
  selector: 'home-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  readonly email = 'itay.cohen2907@gmail.com';
  readonly github = 'https://github.com/itayco2';
  readonly linkedin = 'https://www.linkedin.com/in/itay-cohen-941552349/';
  readonly visibleTagLimit = 5;

  // CV download — set to true after dropping the PDF at public/assets/Itay-Cohen-CV.pdf
  readonly hasCv = false;
  readonly cvPath = 'assets/Itay-Cohen-CV.pdf';

  readonly lastShipped = 'Driving RL, 2026';

  /** The résumé's numbers, verbatim. */
  readonly facts: Fact[] = [
    { value: '2+ yrs', label: 'production LLM systems' },
    { value: '1,121', label: 'backend tests kept green' },
    { value: '235', label: 'Playwright E2E cases' },
    { value: '58.6 s', label: 'record lap, Driving RL' },
    { value: '100', label: 'GPA, John Bryce diploma' }
  ];

  readonly experience: Experience[] = [
    {
      org: 'Prism AI',
      role: 'Full-Stack / AI Engineer',
      period: '2026 – present',
      bullets: [
        'Co-owned the architecture of an agentic LLM pipeline: debate, ranking and invocation layers.',
        'Built the semantic grounding layer that anchors LLM output to source-of-truth data, cutting hallucinations.',
        'Maintain 1,121 backend tests and 235 Playwright E2E cases in containerized CI; rebuilt a cache that was silently dropping verified AI results.'
      ],
      tools: 'xUnit · Vitest · Playwright · GitHub Actions · Google Cloud Run'
    },
    {
      org: 'Absolutions',
      role: 'Full-Stack / AI Engineer',
      period: '2025 – 2026',
      bullets: [
        'Owned the full-stack architecture of an employee management platform across web and mobile: REST APIs, schema, authentication and security.',
        'Integrated AI image-based data extraction into the platform\'s internal data workflows.'
      ],
      tools: 'Angular · .NET · REST APIs · SQL Server'
    },
    {
      org: 'IDF',
      role: 'Combat medic',
      period: '2021 – 2024',
      bullets: ['Led 12 soldiers under live pressure.']
    },
    {
      org: 'John Bryce',
      role: 'Full-Stack Developer Diploma, GPA 100',
      period: '2024 – 2025',
      bullets: ['JavaScript, TypeScript, Angular, React, C#, .NET Core, SQL Server.']
    }
  ];

  readonly skills: SkillGroup[] = [
    { label: 'AI & LLM', items: 'Claude API, OpenAI GPT, multi-agent orchestration, RAG, vision models, structured outputs (Zod)' },
    { label: 'Languages & frontend', items: 'TypeScript, C#, Python, Angular, React, Next.js, React Native, Tailwind' },
    { label: 'Backend & data', items: 'NestJS, .NET 9, ASP.NET Core, REST APIs, WebSockets, PostgreSQL (pgvector), Prisma, SQL Server' },
    { label: 'DevOps, cloud & testing', items: 'Git, GitHub Actions CI/CD, Docker, Google Cloud Run, AWS S3, xUnit, Vitest, Playwright' }
  ];

  isScrolled = false;
  showCookieBanner = false;
  private readonly cookieKey = 'cookie-consent';

  private observer?: IntersectionObserver;
  private videoObserver?: IntersectionObserver;

  constructor(private zone: NgZone) {}

  projects: Project[] = [
    {
      id: 8,
      name: 'Driving RL',
      year: 2026,
      role: 'Solo',
      scope: 'Reinforcement learning',
      description: 'A car that taught itself a 2.3 km stunt circuit with three water chasms and two big jumps. MuJoCo physics and PPO, trained from scratch on a laptop. Every generation replayed and filmed in Three.js.',
      image: 'assets/images/DrivingRL.webp',
      video: 'assets/video/driving-rl.mp4',
      videoLabel: 'Watch the lap · 1:03',
      tagline: 'MuJoCo + PPO · 58.6 s record',
      githubLink: 'https://github.com/itayco2/driving-rl',
      technologies: ['Python', 'MuJoCo', 'PPO', 'Stable-Baselines3', 'PyTorch', 'Three.js', 'Gymnasium'],
      featured: true,
      facts: [
        { value: '58.6 s', label: 'Record lap' },
        { value: '107 min', label: 'Zero to record' },
        { value: '1,060', label: 'Runs in the film' }
      ]
    },
    {
      id: 7,
      name: 'DinoStudy',
      year: 2026,
      role: 'Solo',
      scope: 'AI study coach',
      description: 'Claude-powered study coach: an intake interview builds a weekly plan, focus sessions earn XP, progress hatches collectible dinosaurs. Hand-illustrated field-journal design.',
      image: 'assets/images/DinoStudy.webp',
      githubLink: 'https://github.com/itayco2/Elza',
      siteLink: 'https://elzalearning.vercel.app/',
      technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Claude API', 'Prisma', 'Supabase', 'Tailwind', 'Framer Motion']
    },
    {
      id: 6,
      name: 'Elevator Management System',
      year: 2026,
      role: 'Solo',
      scope: 'Realtime systems',
      description: 'Real-time elevator simulator on SignalR: live tracking, smart call allocation, EF Core and SQL Server.',
      image: 'assets/images/Elevator.webp',
      githubLink: 'https://github.com/itayco2/AdviceElectronics',
      siteLink: 'https://adviceassignment.netlify.app/',
      technologies: ['React', 'ASP.NET Core', 'SignalR', 'SQL Server', 'EF Core', 'JWT']
    },
    {
      id: 3,
      name: 'Lian Gardens',
      year: 2026,
      role: 'Solo',
      scope: 'Marketing site',
      description: 'Marketing site for a landscaping business on Next.js 15 and React 19. Bilingual-ready, image-led, WhatsApp lead capture.',
      image: 'assets/images/LianGardens.webp',
      githubLink: 'https://github.com/itayco2/lian',
      siteLink: 'https://liangardens.vercel.app/',
      technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
    },
    {
      id: 1,
      name: 'Workshop E-commerce & Recipes',
      year: 2025,
      role: 'Solo',
      scope: 'Full-stack',
      description: 'Angular front, ASP.NET API, Postgres, JWT auth, transactional email, admin dashboard. Live store, real orders.',
      image: 'assets/images/AdiSite.webp',
      githubLink: 'https://github.com/itayco2/AdiCohenFit',
      siteLink: 'https://adicohenfit.netlify.app/home',
      technologies: ['Angular', 'C#', 'PostgreSQL', 'TypeScript', 'JWT', 'SendGrid', 'Bootstrap']
    },
    {
      id: 4,
      name: 'CaTetris',
      year: 2025,
      role: 'Solo',
      scope: 'Realtime game',
      description: 'Multiplayer Tetris over Socket.io: clear lines, claim territory on a shared map. Realtime room state, Express backend.',
      image: 'assets/images/CaTetris.webp',
      githubLink: 'https://github.com/itayco2/CataTetris',
      siteLink: 'https://catetris.netlify.app/',
      technologies: ['React', 'Vite', 'TypeScript', 'Socket.io', 'Express']
    },
    {
      id: 5,
      name: 'Take-Safe',
      year: 2025,
      role: 'Solo',
      scope: 'Client site',
      description: 'Production client site for a locksmith specialist. Cinematic intro, JSON-LD structured data, Tailwind and Framer Motion.',
      image: 'assets/images/TakeSafe.webp',
      githubLink: 'https://github.com/itayco2/safelock',
      siteLink: 'https://safe-locks.netlify.app/',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'JSON-LD']
    },
    {
      id: 2,
      name: 'University',
      year: 2024,
      role: 'Solo',
      scope: 'Full-stack',
      description: 'Course management for students, lecturers and admin. Role-based access end to end, on a REST API with SQL persistence.',
      image: 'assets/images/University.webp',
      githubLink: 'https://github.com/itayco2/FullStuckFinalProject',
      siteLink: 'https://universityprojectitay.netlify.app/home',
      technologies: ['Angular', 'TypeScript', 'C#', 'SQL', 'JWT', 'REST API']
    }
  ];

  /** The film project, first in the list. */
  get featured(): Project | undefined {
    return this.projects.find((p) => p.featured);
  }

  /** This year's work, shown as cards. */
  get recent(): Project[] {
    return this.projects.filter((p) => !p.featured && p.year >= 2026);
  }

  /** Earlier work, shown as an index. */
  get archive(): Project[] {
    return this.projects.filter((p) => !p.featured && p.year < 2026);
  }

  numberOf(project: Project): string {
    return (this.projects.indexOf(project) + 1).toString().padStart(2, '0');
  }

  techLine(project: Project): string {
    return project.technologies.slice(0, this.visibleTagLimit).join(' · ');
  }

  ngAfterViewInit(): void {
    // Cookie consent check (no previous choice → show banner)
    try {
      if (localStorage.getItem(this.cookieKey) === null) {
        setTimeout(() => (this.showCookieBanner = true), 800);
      }
    } catch {
      // Privacy mode / storage disabled — assume decline, no banner
    }

    this.zone.runOutsideAngular(() => {
      // Scroll-triggered reveals
      const items = document.querySelectorAll<HTMLElement>('.reveal');
      this.observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            this.observer?.unobserve(entry.target);
          }
        }
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      items.forEach((el) => this.observer!.observe(el));

      // Project films: preload nothing, play muted while on screen, pause off it,
      // and only resume what the viewer had not paused themselves
      const films = document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]');
      if (films.length) {
        this.videoObserver = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const v = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
              if (v.dataset['seen'] !== '1' || v.dataset['wasPlaying'] === '1') {
                v.dataset['seen'] = '1';
                v.muted = true;
                v.play().catch(() => { /* autoplay blocked: the poster and the controls stay */ });
              }
            } else {
              v.dataset['wasPlaying'] = v.paused ? '0' : '1';
              v.pause();
            }
          }
        }, { threshold: 0.25 });
        films.forEach((v) => this.videoObserver!.observe(v));
      }
    });
  }

  setCookieConsent(accepted: boolean): void {
    try {
      localStorage.setItem(this.cookieKey, accepted ? 'accepted' : 'declined');
    } catch {
      // Storage unavailable — banner just dismisses for this session
    }
    this.showCookieBanner = false;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.videoObserver?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const next = window.scrollY > 24;
    if (next !== this.isScrolled) this.isScrolled = next;
  }

  scrollTo(id: string, event?: Event): void {
    event?.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
