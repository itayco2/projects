import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Proof {
  value: string;
  label: string;
  target: string;
}

type Media = 'film' | 'chart' | 'alert' | 'still';

interface Project {
  id: string;
  name: string;
  /** The skill it proves, shown as the card's tag. */
  tag: string;
  line: string;
  media: Media;
  /** Columns out of 12 on desktop: the film runs full width, the other two share a row. */
  span: 6 | 12;
  image?: string;
  imageAlt?: string;
  video?: string;
  videoLabel?: string;
  /** The code, on GitHub. */
  url: string;
}

interface TokenBar {
  label: string;
  value: number;
  lean?: boolean;
}

interface Fact {
  label: string;
  value: string;
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

  // Résumé download — set to true after dropping the PDF at public/assets/Itay-Cohen-CV.pdf
  readonly hasCv = false;
  readonly cvPath = 'assets/Itay-Cohen-CV.pdf';

  readonly portraitPath = 'assets/images/portrait.webp';

  /** One number per project, closing the first screen: the whole portfolio in two seconds. */
  readonly proof: Proof[] = [
    { value: '58.6 s', label: 'Record lap · Driving RL', target: 'driving-rl' },
    { value: '−83%', label: 'Tokens per agent run · Lean-Swarm', target: 'lean-swarm' },
    { value: '<100 / day', label: 'LLM calls, down from 2,900 · ApartmentBot', target: 'apartmentbot' }
  ];

  /**
   * Each project is here for one skill an AI-engineer hiring manager looks for,
   * named by its tag. A project that proves nothing the others don't stays off.
   */
  readonly projects: Project[] = [
    {
      id: 'driving-rl',
      name: 'Driving RL',
      tag: 'Reinforcement learning',
      line: 'A car that taught itself a stunt circuit in 107 minutes, on a laptop.',
      media: 'film',
      span: 12,
      image: 'assets/images/DrivingRL.webp',
      imageAlt: 'The trained car mid-lap on the stunt circuit',
      video: 'assets/video/driving-rl.mp4',
      videoLabel: 'Film of the trained car lapping the stunt circuit',
      url: 'https://github.com/itayco2/driving-rl'
    },
    {
      id: 'lean-swarm',
      name: 'Lean-Swarm',
      tag: 'Agents & evals',
      line: 'Multi-agent runs that read 83% fewer tokens and still catch every bug.',
      media: 'chart',
      span: 6,
      url: 'https://github.com/itayco2/Token-Optimizer'
    },
    {
      id: 'apartmentbot',
      name: 'ApartmentBot',
      tag: 'LLM in production',
      line: 'Every Israeli rental site in one Telegram alert, on under 100 LLM calls a day.',
      media: 'alert',
      span: 6,
      url: 'https://github.com/itayco2/ApartmentBot'
    }
  ];

  /** Lean-Swarm's 7-agent review workflow: tokens read per run, in thousands. */
  readonly tokenBars: TokenBar[] = [
    { label: 'default agents', value: 813.6 },
    { label: 'lean roles', value: 140.1, lean: true }
  ];

  readonly facts: Fact[] = [
    { label: 'Now', value: 'AB Solutions, Prism AI' },
    { label: 'Studied', value: 'John Bryce, GPA 100' },
    { label: 'Served', value: 'IDF combat medic' }
  ];

  showCookieBanner = false;
  private readonly cookieKey = 'cookie-consent';

  private observer?: IntersectionObserver;
  private videoObserver?: IntersectionObserver;

  constructor(private zone: NgZone) {}

  barWidth(bar: TokenBar): string {
    const max = Math.max(...this.tokenBars.map((b) => b.value));
    return `${(bar.value / max) * 100}%`;
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
