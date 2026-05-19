import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  id: number;
  name: string;
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
      name: 'Workshop E-commerce And Recipes',
      description: 'Full-stack online shopping platform with payment integration and admin dashboard.',
      image: 'assets/images/AdiSite.webp',
      githubLink: 'https://github.com/itayco2/AdiCohenFit',
      siteLink: 'https://adicohenfit.netlify.app/home',
      technologies: ['Angular', 'C#', 'PostgreSQL', 'TypeScript', 'JWT', 'SendGrid', 'Bootstrap'],
      featured: true
    },
    {
      id: 2,
      name: 'University',
      description: 'Real-time university course management application with role-based access.',
      image: 'assets/images/University.webp',
      githubLink: 'https://github.com/itayco2/FullStuckFinalProject',
      siteLink: 'https://universityprojectitay.netlify.app/home',
      technologies: ['Angular', 'TypeScript', 'C#', 'SQL', 'JWT', 'REST API']
    },
    {
      id: 3,
      name: 'Lian Gardens',
      description: 'Marketing site for a landscaping business — bilingual-ready, image-led, WhatsApp lead capture.',
      image: 'assets/images/LianGardens.webp',
      githubLink: 'https://github.com/itayco2/lian',
      siteLink: 'https://liangardens.vercel.app/',
      technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
    },
    {
      id: 4,
      name: 'CaTetris',
      description: 'Multiplayer Tetris where you build a colonial map as you clear lines.',
      image: 'assets/images/CaTetris.webp',
      githubLink: 'https://github.com/itayco2/CataTetris',
      siteLink: 'https://catetris.netlify.app/',
      technologies: ['React', 'Vite', 'TypeScript', 'Socket.io', 'Express']
    },
    {
      id: 5,
      name: 'Take-Safe',
      description: 'Client site for a safe & security specialist — cinematic intro, SEO structured data, modern UI.',
      image: 'assets/images/TakeSafe.webp',
      githubLink: 'https://github.com/itayco2/safelock',
      siteLink: 'https://safe-locks.netlify.app/',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'JSON-LD']
    },
    {
      id: 6,
      name: 'Elevator Management System',
      description: 'Real-time elevator simulation with live tracking, smart call allocation, and SignalR updates.',
      image: 'assets/images/Elevator.webp',
      githubLink: 'https://github.com/itayco2/AdviceElectronics',
      siteLink: 'https://adviceassignment.netlify.app/',
      technologies: ['React', 'ASP.NET Core', 'SignalR', 'SQL Server', 'EF Core', 'JWT']
    }
  ];

  get stackCount(): number {
    const stacks = new Set<string>();
    for (const p of this.projects) {
      for (const t of p.technologies) {
        const root = t.split(' ')[0].toLowerCase();
        if (['angular', 'react', 'next.js', 'c#', 'asp.net'].includes(root)) {
          stacks.add(root);
        }
      }
    }
    return stacks.size;
  }

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
