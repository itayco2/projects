import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  id: number;
  name: string;
  year: number;
  role: string;
  scope: string;
  description: string;
  image: string;
  githubLink: string;
  siteLink?: string;
  technologies: string[];
  featured?: boolean;
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
  readonly visibleTagLimit = 5;

  // CV download — set to true after dropping the PDF at public/assets/Itay-Cohen-CV.pdf
  readonly hasCv = false;
  readonly cvPath = 'assets/Itay-Cohen-CV.pdf';

  readonly location = 'Tel Aviv, Israel';
  readonly lastShipped = 'Lian Gardens, March 2026';

  readonly coreStack = [
    'Angular', 'React', 'TypeScript', '.NET', 'Node', 'PostgreSQL', 'SignalR', 'Tailwind'
  ];

  isScrolled = false;
  pastHero = false;
  showCookieBanner = false;
  private readonly cookieKey = 'cookie-consent';

  @ViewChild('grid') gridRef?: ElementRef<HTMLElement>;
  private observer?: IntersectionObserver;

  constructor(private zone: NgZone) {}

  projects: Project[] = [
    {
      id: 1,
      name: 'Workshop E-commerce & Recipes',
      year: 2025,
      role: 'Solo',
      scope: 'Full-stack',
      description: 'Solo full-stack build: Angular front, ASP.NET API, Postgres, JWT auth, transactional email, admin dashboard. Live store, real orders.',
      image: 'assets/images/AdiSite.webp',
      githubLink: 'https://github.com/itayco2/AdiCohenFit',
      siteLink: 'https://adicohenfit.netlify.app/home',
      technologies: ['Angular', 'C#', 'PostgreSQL', 'TypeScript', 'JWT', 'SendGrid', 'Bootstrap'],
      featured: true
    },
    {
      id: 2,
      name: 'University',
      year: 2024,
      role: 'Solo',
      scope: 'Full-stack',
      description: 'Course management for students, lecturers, and admin — role-based access end to end, REST API, SQL persistence, deployed.',
      image: 'assets/images/University.webp',
      githubLink: 'https://github.com/itayco2/FullStuckFinalProject',
      siteLink: 'https://universityprojectitay.netlify.app/home',
      technologies: ['Angular', 'TypeScript', 'C#', 'SQL', 'JWT', 'REST API']
    },
    {
      id: 3,
      name: 'Lian Gardens',
      year: 2026,
      role: 'Solo',
      scope: 'Marketing site',
      description: 'Marketing site for a landscaping business on Next.js 15 + React 19. Bilingual-ready, image-led, WhatsApp lead capture.',
      image: 'assets/images/LianGardens.webp',
      githubLink: 'https://github.com/itayco2/lian',
      siteLink: 'https://liangardens.vercel.app/',
      technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
    },
    {
      id: 4,
      name: 'CaTetris',
      year: 2025,
      role: 'Solo',
      scope: 'Realtime game',
      description: 'Multiplayer Tetris over Socket.io — clear lines, claim territory on a shared colonial map. Realtime room state, Express backend.',
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
      description: 'Production client site for a locksmith specialist. Cinematic intro, JSON-LD structured data, Tailwind + Framer Motion.',
      image: 'assets/images/TakeSafe.webp',
      githubLink: 'https://github.com/itayco2/safelock',
      siteLink: 'https://safe-locks.netlify.app/',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'JSON-LD']
    },
    {
      id: 6,
      name: 'Elevator Management System',
      year: 2026,
      role: 'Solo',
      scope: 'Realtime systems',
      description: 'Real-time elevator simulator on SignalR — live tracking, smart call allocation, EF Core + SQL Server.',
      image: 'assets/images/Elevator.webp',
      githubLink: 'https://github.com/itayco2/AdviceElectronics',
      siteLink: 'https://adviceassignment.netlify.app/',
      technologies: ['React', 'ASP.NET Core', 'SignalR', 'SQL Server', 'EF Core', 'JWT']
    }
  ];

  visibleTechs(project: Project): string[] {
    return project.technologies.slice(0, this.visibleTagLimit);
  }

  hiddenTechCount(project: Project): number {
    return Math.max(0, project.technologies.length - this.visibleTagLimit);
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

    // Scroll-triggered card reveals
    this.zone.runOutsideAngular(() => {
      const cards = document.querySelectorAll<HTMLElement>('.project-card');
      this.observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            this.observer?.unobserve(entry.target);
          }
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      cards.forEach((c) => this.observer!.observe(c));
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
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY;
    const next = y > 24;
    if (next !== this.isScrolled) this.isScrolled = next;
    const pastNext = y > window.innerHeight * 0.6;
    if (pastNext !== this.pastHero) this.pastHero = pastNext;
  }

  onCardPointerMove(event: PointerEvent, host: HTMLElement): void {
    const rect = host.getBoundingClientRect();
    host.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    host.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }

  scrollTo(id: string, event?: Event): void {
    event?.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
