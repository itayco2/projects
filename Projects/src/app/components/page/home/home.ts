import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  githubLink: string;
  siteLink?: string; 
  technologies: string[];
}

@Component({
  selector: 'home-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  projects: Project[] = [
    {
      id: 1,
      name: 'Workshop E-commerce And Recipes',
      description: 'Full-stack online shopping platform with payment integration',
      image: 'assets/images/AdiSite.png',
      githubLink: 'https://github.com/itayco2/AdiCohenFit',
      siteLink: 'https://adicohenfit.netlify.app/home',
      technologies: ['Angular', 'C#', 'postgreSQL','TypeScript', 'Api Calls', 'JWT', 'sendGrid', 'Bootstrap']
    },
    {
      id: 2,
      name: 'University',
      description: 'Real-time university course management application',
      image: 'assets/images/University.png',
      githubLink: 'https://github.com/itayco2/FullStuckFinalProject',
      siteLink: 'https://universityprojectitay.netlify.app/home',
      technologies: ['Angular', 'TypeScript', 'API', 'JWT', 'C#', 'Sql']
    },
    {
      id: 3,
      name: 'Lian Gardens',
      description: 'Professional landscaping site for a garden design & maintenance business — bilingual-ready, image-led marketing site with WhatsApp lead capture and Next.js image optimization.',
      image: 'assets/images/LianGardens.png',
      githubLink: 'https://github.com/itayco2/lian',
      siteLink: 'https://liangardens.vercel.app/',
      technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Phosphor Icons']
    },
    {
      id: 4,
      name: 'CaTetris',
      description: 'A game of tetris that you can build your colonial map on it',
      image: 'assets/images/CaTetris.png',
      githubLink: 'https://github.com/itayco2/CataTetris',
      siteLink: 'https://catetris.netlify.app/',
      technologies: ['React', 'Vite', 'TypeScript', 'Socket.io', 'Express']
    },
     {
  id: 5,
  name: "Take-Safe",
  description: "A professional website for a client specializing in safes and security solutions. Features a cinematic safe intro animation, comprehensive SEO optimization with structured data, and a responsive, modern UI.",
  image: "assets/images/TakeSafe.png",
  githubLink: "https://github.com/itayco2/safelock",
  siteLink: "https://safe-locks.netlify.app/",
  technologies: [
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "Framer Motion",
    "React Helmet",
    "Lucide Icons",
    "Session Storage (Browser API)",
    "Schema.org JSON-LD (SEO Structured Data)"
  ]
},
{
  id: 6,
  name: "Elevator Management System",
  description: "Real-time elevator simulation and management system for buildings. Features live elevator tracking, intelligent call allocation algorithm, and real-time updates using SignalR.",
  image: "assets/images/Elevator.png",
  githubLink: "https://github.com/itayco2/AdviceElectronics",
  siteLink: "https://adviceassignment.netlify.app/",
  technologies: [
    "React",
    "TypeScript",
    "ASP.NET Core",
    "SignalR",
    "SQL Server",
    "Entity Framework",
    "Real-time Updates",
    "Tailwind CSS",
    "JWT Authentication"
  ]
}

  ];
}