import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Stat {
  value: string;
  label: string;
  /** Where the number was measured. */
  source?: string;
}

interface Detail {
  label: string;
  text: string;
}

interface ProjectLink {
  label: string;
  url: string;
  primary?: boolean;
}

type Media = 'film' | 'chart' | 'alert' | 'still';

interface Project {
  id: string;
  name: string;
  area: string;
  /** The headline: what it is, in one line. */
  claim: string;
  /** Why it earns its place on an AI-engineer portfolio. */
  why: string;
  stat: Stat;
  stack: string;
  media: Media;
  image?: string;
  imageAlt?: string;
  video?: string;
  videoLabel?: string;
  links: ProjectLink[];
  live?: boolean;
  note?: string;
  /** "How it works": three short lines, hidden until asked for. */
  details?: Detail[];
}

interface TokenBar {
  label: string;
  value: number;
  lean?: boolean;
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

  // CV download — set to true after dropping the PDF at public/assets/Itay-Cohen-CV.pdf
  readonly hasCv = false;
  readonly cvPath = 'assets/Itay-Cohen-CV.pdf';

  // Photo beside the name — set to true after dropping it at public/assets/images/portrait.webp
  readonly hasPortrait = false;
  readonly portraitPath = 'assets/images/portrait.webp';

  /**
   * Each project is here for one thing it proves to an AI-engineer hiring
   * manager. One line, one number with its source, and the rest behind
   * "How it works". A project that proves nothing the others don't stays off.
   */
  readonly projects: Project[] = [
    {
      id: 'driving-rl',
      name: 'Driving RL',
      area: 'Reinforcement learning',
      claim: 'A car that taught itself a stunt circuit.',
      why: 'I can train a model, not just call one.',
      stat: {
        value: '58.6 s',
        label: 'record lap, 107 min of training on a laptop',
        source: 'https://github.com/itayco2/driving-rl#the-numbers-run-3-the-canonical-run'
      },
      stack: 'PyTorch · MuJoCo · PPO · Three.js',
      media: 'film',
      image: 'assets/images/DrivingRL.webp',
      imageAlt: 'The trained car mid-lap on the stunt circuit',
      video: 'assets/video/driving-rl.mp4',
      videoLabel: 'Film of the trained car lapping the stunt circuit',
      links: [{ label: 'Code', url: 'https://github.com/itayco2/driving-rl' }],
      details: [
        { label: 'Problem', text: 'Lap a 2.3 km circuit with two jumps and three water chasms. No GPU, no demonstrations.' },
        { label: 'Built', text: 'A MuJoCo world and Gymnasium environment, trained with PPO. Every generation filmed in Three.js.' },
        { label: 'Result', text: 'The first run made zero laps. I found and fixed 20 defects; the rebuilt run set a 58.6 s record.' }
      ]
    },
    {
      id: 'lean-swarm',
      name: 'Lean-Swarm',
      area: 'Agents & evals',
      claim: 'Agent runs that read 83% fewer tokens and miss no bugs.',
      why: 'I measure agent systems and cut their cost without losing quality.',
      stat: {
        value: '11 / 11',
        label: 'subtle bugs found, 0 of 15 decoys flagged',
        source: 'https://github.com/itayco2/Token-Optimizer#proof'
      },
      stack: 'Claude Code · Multi-agent · Evals · Node.js',
      media: 'chart',
      links: [{ label: 'Code', url: 'https://github.com/itayco2/Token-Optimizer' }],
      details: [
        { label: 'Problem', text: 'Across 2,121 agents, 43% of 8.08B tokens read was each agent’s fixed start: tools it never used.' },
        { label: 'Built', text: 'X-ray, a CLI that reads Claude Code logs, and five lean agent roles, shipped as a plugin.' },
        { label: 'Result', text: '−83% tokens read on a 7-agent review, same bugs found. The cost: runs 12–16% slower.' }
      ]
    },
    {
      id: 'apartmentbot',
      name: 'ApartmentBot',
      area: 'LLM in production',
      claim: 'Every Israeli rental site in one Telegram alert.',
      why: 'I run LLMs in production, on messy input and a budget.',
      stat: {
        value: '2,900 → <100',
        label: 'LLM calls a day',
        source: 'https://github.com/itayco2/ApartmentBot'
      },
      stack: 'TypeScript · Gemini · Zod · 443 tests',
      media: 'alert',
      links: [{ label: 'Code', url: 'https://github.com/itayco2/ApartmentBot' }],
      details: [
        { label: 'Problem', text: 'Listings are spread over five sites and free-text Hebrew posts in Telegram and Facebook groups.' },
        { label: 'Built', text: 'Hand-written parsers, Gemini output validated with Zod, cross-site dedupe, Telegram alerts.' },
        { label: 'Result', text: '1,178 cities. Ten posts per model call keeps it under 100 calls a day, inside the free tier.' }
      ]
    },
    {
      id: 'dinostudy',
      name: 'DinoStudy',
      area: 'LLM product',
      claim: 'A Claude study coach that plans your week.',
      why: 'it’s the one you can use right now, built end to end.',
      stat: { value: 'Live', label: 'elzalearning.vercel.app' },
      stack: 'Next.js · Claude API · Prisma · Supabase',
      media: 'still',
      image: 'assets/images/DinoStudy.webp',
      imageAlt: 'DinoStudy landing page, hand-illustrated like a field journal',
      links: [{ label: 'Open it', url: 'https://elzalearning.vercel.app/', primary: true }],
      live: true,
      note: 'code private'
    }
  ];

  /** Lean-Swarm, round 1: tokens read per run, in thousands. */
  readonly tokenBars: TokenBar[] = [
    { label: 'default', value: 813.6 },
    { label: 'lean', value: 140.1, lean: true }
  ];

  readonly open = new Set<string>();

  showCookieBanner = false;
  private readonly cookieKey = 'cookie-consent';

  private observer?: IntersectionObserver;
  private videoObserver?: IntersectionObserver;

  constructor(private zone: NgZone) {}

  numberOf(project: Project): string {
    return (this.projects.indexOf(project) + 1).toString().padStart(2, '0');
  }

  barWidth(bar: TokenBar): string {
    const max = Math.max(...this.tokenBars.map((b) => b.value));
    return `${(bar.value / max) * 100}%`;
  }

  toggle(id: string): void {
    if (this.open.has(id)) this.open.delete(id);
    else this.open.add(id);
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
}
