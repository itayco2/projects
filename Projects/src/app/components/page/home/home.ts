import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Proof {
  value: string;
  label: string;
  target: string;
  /** Leads the value with the green live dot. */
  live?: boolean;
}

type Media = 'film' | 'chart' | 'alert' | 'redacted' | 'still' | 'board';

interface Project {
  id: string;
  name: string;
  /** The skill it proves, shown as the card's tag. */
  tag: string;
  line: string;
  media: Media;
  /**
   * Columns out of 12 on wide screens. A bento: the film (8) and the tall AI Stock Agent
   * (4, both rows) side by side, the other two (4 + 4) under the film; Blink (12) full width below.
   */
  span: 4 | 8 | 12;
  /** Spans both grid rows. */
  tall?: boolean;
  image?: string;
  imageAlt?: string;
  video?: string;
  videoLabel?: string;
  /** The code, on GitHub. Absent for a private repo: the card offers a walkthrough instead. */
  url?: string;
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
    { value: 'Live', label: 'Autonomous trading, in production · AI Stock Agent', target: 'ai-stock-agent', live: true },
    { value: '−52%', label: 'Tokens per run, long agents · Lean-Swarm', target: 'lean-swarm' },
    { value: '<100 / day', label: 'LLM calls, down from 2,900 · ApartmentBot', target: 'apartmentbot' },
    { value: '89.8%', label: 'DeepMind's 10,000 chess puzzles, no search · Blink', target: 'blink' }
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
      span: 8,
      image: 'assets/images/DrivingRL.webp',
      imageAlt: 'The trained car mid-lap on the stunt circuit',
      video: 'assets/video/driving-rl.mp4',
      videoLabel: 'Film of the trained car lapping the stunt circuit',
      url: 'https://github.com/itayco2/driving-rl'
    },
    {
      id: 'ai-stock-agent',
      name: 'AI Stock Agent',
      tag: 'Production AI, end to end',
      line: 'An autonomous AI trading platform, built alone from market data to live execution.',
      media: 'redacted',
      span: 4,
      tall: true
    },
    {
      id: 'lean-swarm',
      name: 'Lean-Swarm',
      tag: 'Agents & evals',
      line: 'Multi-agent runs that read half the tokens, cost 38% less and still catch every bug.',
      media: 'chart',
      span: 4,
      url: 'https://github.com/itayco2/Lean-Swarm'
    },
    {
      id: 'apartmentbot',
      name: 'ApartmentBot',
      tag: 'LLM in production',
      line: 'Every Israeli rental site in one Telegram alert, on under 100 LLM calls a day.',
      media: 'alert',
      span: 4,
      url: 'https://github.com/itayco2/ApartmentBot'
    },
    {
      id: 'blink',
      name: 'Blink',
      tag: 'Machine learning',
      line: "A chess AI that never searches, trained from scratch on one home GPU, and it beats DeepMind's 9M model.",
      media: 'board',
      span: 12,
      url: 'https://github.com/itayco2/Blink-Chess'
    }
  ];

  /**
   * Lean-Swarm v0.2 on long review agents (15–27 turns, 15,000-line codebase):
   * tokens read per run, in millions. The repo's headline result, not its best round.
   */
  /**
   * Blink's mark and card visual: e4's cosine similarity to all 64 squares, read from the shipped
   * model's own square embeddings (runs/long-final, step 151,722, raw weights), rank 8 first.
   * Nobody drew it: the bright cross is the board geometry the model learned by itself.
   */
  private readonly e4: number[] = [
    -0.43, -0.37, -0.41, -0.11, -0.18, -0.1, -0.43, -0.24, -0.13, -0.27, 0.1, 0.14, 0.35, 0.07, 0.03, -0.26,
    -0.2, 0.09, 0.21, 0.57, 0.48, 0.49, 0.01, 0.04, 0.21, 0.17, 0.64, 0.72, 1.0, 0.55, 0.45, 0.15,
    -0.15, 0.14, 0.2, 0.65, 0.55, 0.53, 0.05, 0.12, -0.13, -0.26, 0.25, 0.17, 0.46, 0.17, 0.05, -0.24,
    -0.46, -0.22, -0.3, 0.04, -0.09, 0.06, -0.29, -0.17, -0.24, -0.4, -0.12, -0.15, 0.1, -0.17, -0.11, -0.32
  ];
  readonly blinkCells: string[] = this.boardCells();
  /**
   * Share of DeepMind's full 10,000-puzzle set solved, both models measured here on the same puzzles.
   * DeepMind 9M is its EMA weights, the better of its two released sets (86.4%; 86.2% for the other).
   */
  readonly blinkBars: TokenBar[] = [
    { label: 'Blink · 22.5M parameters · one home GPU', value: 89.8, lean: true },
    { label: 'DeepMind 9M', value: 86.4 }
  ];

  readonly tokenBars: TokenBar[] = [
    { label: 'default agents', value: 6.61 },
    { label: 'lean roles', value: 3.19, lean: true }
  ];

  /**
   * AI Stock Agent is private: the stages are named, how each one works is not.
   * Only what the résumé already says.
   */
  readonly pipeline: string[] = [
    'Market data ingestion',
    'Multi-agent analysis',
    'Validated, explainable decisions',
    'Live execution'
  ];
  readonly benchModels: string[] = ['Claude Fable', 'Claude Opus', 'Gemini', 'ChatGPT'];
  readonly walkthroughHref = `mailto:${this.email}?subject=${encodeURIComponent('AI Stock Agent walkthrough')}`;

  readonly facts: Fact[] = [
    { label: 'Now', value: 'AB Solutions, Prism AI' },
    { label: 'Studied', value: 'John Bryce, GPA 100' },
    { label: 'Served', value: 'IDF combat medic' }
  ];

  showCookieBanner = false;
  private readonly cookieKey = 'cookie-consent';

  private observer?: IntersectionObserver;
  private videoObserver?: IntersectionObserver;

  /**
   * In-page links (#work, #about, …): with <base href="/"> the browser resolves "#work" to "/#work",
   * a different URL than /home, and reloads the page at the top. So the page scrolls itself.
   */
  private readonly onAnchorClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
    const id = link?.getAttribute('href')?.slice(1);
    if (!id) {
      return;
    }
    const target = id === 'top' ? document.body : document.getElementById(id);
    if (!target) {
      return;
    }
    event.preventDefault();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    } else {
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    }
    history.replaceState(null, '', `${location.pathname}#${id}`);
  };

  constructor(private zone: NgZone) {}

  private boardCells(): string[] {
    const mix = (a: number[], b: number[], t: number) => a.map((x, i) => Math.round(x + (b[i] - x) * t));
    const hex = (c: number[]) => '#' + c.map((x) => x.toString(16).padStart(2, '0')).join('');
    const low = [25, 25, 27], zero = [44, 45, 49], hot = [244, 162, 97], top = [248, 236, 214];
    const cells: string[] = [];
    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const v = Math.max(-1, Math.min(1, this.e4[rank * 8 + file]));
        if (v < 0) cells.push(hex(mix(zero, low, Math.min(1, -v / 0.45))));
        else if (v < 0.6) cells.push(hex(mix(zero, hot, v / 0.6)));
        else cells.push(hex(mix(hot, top, (v - 0.6) / 0.4)));
      }
    }
    return cells;
  }

  /** Bars drawn to scale: a percentage fills that share of the track. */
  pctWidth(bar: TokenBar): string {
    return `${bar.value}%`;
  }

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
      document.addEventListener('click', this.onAnchorClick);

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
    document.removeEventListener('click', this.onAnchorClick);
    this.observer?.disconnect();
    this.videoObserver?.disconnect();
  }
}
