/*=============== MAIN JAVASCRIPT FUNCTIONALITY ===============*/

/**
 * Projects Data
 */
const PROJECTS_DATA = [
  {
    id: 'mcgill-course-visualizer',
    title: 'McGill Course Dependency Visualizer',
    description: 'Full-stack application that scrapes McGill\'s course catalogue and uses an AI model (Google Gemini) to parse prerequisites into an interactive dependency graph.',
    technologies: ['Python', 'Scrapy', 'JavaScript', 'LLM', 'AsyncIO', 'vis.js'],
    category: 'web',
    featured: true,
    achievements: [
      { type: 'ai', text: 'AI-Powered Parsing', icon: 'fas fa-brain' },
      { type: 'full-stack', text: 'Full-Stack Project', icon: 'fas fa-layer-group' }
    ],
    links: {
      github: 'https://github.com/kaidalisohaib/mcgill-course-visualizer'
    },
    year: 2025
  },
  {
    id: 'sumo-robot',
    title: 'Rubber Duck Sumo Robot',
    description: 'Advanced autonomous sumo robot for the IEEE Sumo-Bot Competition, featuring an ESP32, 5 ToF sensors, PID torque control, and fault-tolerant I²C bus recovery.',
    technologies: ['C++', 'ESP32', 'PID Control', 'RTOS', 'Arduino'],
    category: 'robotics',
    featured: true,
    achievements: [
      { type: 'competition', text: 'IEEE Competition', icon: 'fas fa-trophy' },
      { type: 'embedded', text: 'Embedded Systems', icon: 'fas fa-microchip' }
    ],
    links: {
      github: 'https://github.com/cabbagecultist/Sumo',
    },
    year: 2025
  },
  {
    id: 'amcl-visualization',
    title: 'Adaptive Monte Carlo Localization Visualization',
    description: 'Interactive Unity simulation demonstrating robot localization algorithms using particle filters. An educational tool with complete documentation and a WebGL deployment.',
    technologies: ['Unity', 'C#', 'Particle Filters', 'WebGL', 'Algorithms'],
    category: 'robotics',
    featured: true,
    achievements: [
      { type: 'featured', text: 'Featured Project', icon: 'fas fa-star' },
      { type: 'educational', text: 'Educational Tool', icon: 'fas fa-graduation-cap' }
    ],
    links: {
      demo: 'https://kaidalisohaib.github.io/AMCL-Visualization/',
      github: 'https://github.com/kaidalisohaib/AMCL-Visualization',
      documentation: 'https://kaidalisohaib.github.io/AMCL-Visualization/explanation.html'
    },
    year: 2024
  },
  {
    id: 'replex-fitness-app',
    title: 'RepLex - AI Fitness Coach',
    description: 'React Native mobile app that uses on-device computer vision (TensorFlow.js & MoveNet) to automatically count exercise repetitions and track workout sets in real-time.',
    technologies: ['React Native', 'TensorFlow.js', 'AI/ML', 'JavaScript', 'Expo'],
    category: 'ai-ml',
    featured: true,
    achievements: [
      { type: 'winner', text: '1st Place Hackathon', icon: 'fas fa-trophy' },
      { type: 'mobile', text: 'Mobile App', icon: 'fas fa-mobile-alt' }
    ],
    links: {
      github: 'https://github.com/ParsaJafarian/replex'
    },
    year: 2024
  },
  {
    id: 'sign-atlas',
    title: 'Sign Atlas - AI Sign Language Tutor',
    description: 'AI-powered web platform to teach ASL using real-time gesture recognition (MediaPipe), interactive 3D hand models, and a gamified testing framework.',
    technologies: ['React', 'Next.js', 'MediaPipe', 'TensorFlow', 'AI/ML'],
    category: 'ai-ml',
    featured: true,
    achievements: [
      { type: 'winner', text: '1st Place Hackathon', icon: 'fas fa-trophy' },
      { type: 'ai', text: 'AI Innovation', icon: 'fas fa-brain' }
    ],
    links: {
      demo: 'https://sign-atlas-git-sohaib-parsajafarians-projects.vercel.app/',
      github: 'https://github.com/ParsaJafarian/sign-atlas'
    },
    year: 2024
  },
  {
    id: 'heart-disease-predictor',
    title: 'Heart Disease Predictor',
    description: 'End-to-end machine learning project to predict heart disease. Features rigorous model selection, explainability with SHAP, and a serverless deployment with ONNX for in-browser inference.',
    technologies: ['Python', 'Scikit-learn', 'ONNX', 'JavaScript', 'AI/ML'],
    category: 'ai-ml',
    featured: false,
    achievements: [
      { type: 'privacy', text: 'Privacy-First Design', icon: 'fas fa-user-secret' },
      { type: 'xai', text: 'Explainable AI', icon: 'fas fa-comment-dots' }
    ],
    links: {
      demo: 'https://kaidalisohaib.github.io/AICohortW24/',
      github: 'https://github.com/kaidalisohaib/AICohortW24'
    },
    year: 2024
  },
  {
    id: 'sandswitch',
    title: 'SandSwitch Service Exchange',
    description: 'Full-stack serverless platform for students to exchange services for non-monetary "sandwich rewards". Built with Next.js and Firebase, featuring real-time chat.',
    technologies: ['Next.js', 'React', 'Firebase', 'Tailwind CSS', 'JavaScript'],
    category: 'web',
    featured: false,
    achievements: [
      { type: 'real-time', text: 'Real-time Chat', icon: 'fas fa-bolt' },
      { type: 'serverless', text: 'Serverless Architecture', icon: 'fas fa-cloud' }
    ],
    links: {
      github: 'https://github.com/kaidalisohaib/sandswitch'
    },
    year: 2025
  },
  {
    id: '2d-place',
    title: '2D Place - Real-time Collaborative Canvas',
    description: 'Rust-powered real-time collaborative drawing application inspired by r/place. Features WebSocket communication with a high-performance binary serialization format.',
    technologies: ['Rust', 'WebSockets', 'SvelteKit', 'TypeScript', 'WebAssembly'],
    category: 'web',
    featured: false,
    achievements: [
      { type: 'performance', text: 'High Performance', icon: 'fas fa-rocket' },
      { type: 'backend', text: 'Systems Programming', icon: 'fas fa-cogs' }
    ],
    links: {
      github: 'https://github.com/kaidalisohaib/2d-place'
    },
    year: 2022
  },
  {
    id: 'nutrition-calculator',
    title: 'Nutrition Calculator',
    description: 'Full-stack MERN application for tracking daily nutritional intake. Features Google OAuth, custom ingredient creation, and a dynamic nutrition facts label.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
    category: 'web',
    featured: false,
    achievements: [
      { type: 'winner', text: '2nd Place Hackathon', icon: 'fas fa-trophy' },
      { type: 'full-stack', text: 'MERN Stack', icon: 'fas fa-database' }
    ],
    links: {
      github: 'https://github.com/kaidalisohaib/DawHacks24'
    },
    year: 2024
  },
  {
    id: 'data-journalism-sdg',
    title: 'Sustainable Cities Data Journalism',
    description: 'Data analysis and visualization project investigating the link between economic activity and UN Sustainable Development Goals, presented as a web report.',
    technologies: ['Python', 'Pandas', 'Plotly', 'Data Analysis', 'HTML/CSS'],
    category: 'data',
    featured: false,
    achievements: [
      { type: 'award', text: 'Technical Award', icon: 'fas fa-award' },
      { type: 'dataviz', text: 'Data Storytelling', icon: 'fas fa-chart-bar' }
    ],
    links: {
      github: 'https://github.com/kaidalisohaib/DAIJChallenge24'
    },
    year: 2024
  },
  {
    id: 'slime-mold-simulation',
    title: 'Slime Mold Traffic Simulation',
    description: 'Desktop application using Java and OpenGL compute shaders to procedurally generate road networks by simulating the foraging behavior of slime mold on the GPU.',
    technologies: ['Java', 'OpenGL', 'GLSL', 'Compute Shaders', 'Simulation'],
    category: 'software',
    featured: true,
    achievements: [
      { type: 'gpu', text: 'GPGPU Computing', icon: 'fas fa-server' },
      { type: 'procedural', text: 'Procedural Generation', icon: 'fas fa-infinity' }
    ],
    links: {
      github: 'https://github.com/kaidalisohaib/GraphTrafficSim'
    },
    year: 2023
  },
  {
    id: 'omnivox-downloader',
    title: 'Omnivox Document Downloader',
    description: 'Python automation tool using Selenium and Requests to scrape and download all course materials from the Omnivox college portal, with a full CI/CD pipeline for releases.',
    technologies: ['Python', 'Selenium', 'Automation', 'CI/CD', 'PyInstaller'],
    category: 'software',
    featured: false,
    achievements: [
      { type: 'automation', text: 'CI/CD Automation', icon: 'fas fa-robot' },
      { type: 'tool', text: 'Developer Tool', icon: 'fas fa-tools' }
    ],
    links: {
      github: 'https://github.com/kaidalisohaib/OmnivoxCurrentSessionDocumentDownloader'
    },
    year: 2023
  },
  {
    id: 'sqft-calculator-extension',
    title: 'SQFT Real Estate Calculator',
    description: 'Browser extension that automates calculating the total living area of properties on sites like realtor.ca. Features extensive testing and a cross-browser CI/CD pipeline.',
    technologies: ['JavaScript', 'HTML/CSS', 'Browser Extension', 'Jest', 'CI/CD'],
    category: 'web',
    featured: false,
    achievements: [
      { type: 'testing', text: 'Comprehensive Tests', icon: 'fas fa-vial' },
      { type: 'devops', text: 'Professional DevOps', icon: 'fas fa-cogs' }
    ],
    links: {
      github: 'https://github.com/MotionCorrect/sqft-total-area-calculator'
    },
    image: 'assets/images/sqft-calculator.png',
    readme: 'assets/readmes/sqft-calculator.md',
    year: 2025
  },
  {
    id: 'aes-gcm-viewer',
    title: 'AES-GCM Encryption Viewer',
    description: 'Cross-platform desktop application built with Rust and Tauri for AES-GCM encryption/decryption, featuring a performant hex viewer with virtual scrolling.',
    technologies: ['Rust', 'Tauri', 'Cryptography', 'JavaScript', 'WebAssembly'],
    category: 'software',
    featured: false,
    achievements: [
      { type: 'security', text: 'Applied Cryptography', icon: 'fas fa-shield-alt' },
      { type: 'desktop', text: 'Desktop App', icon: 'fas fa-desktop' }
    ],
    links: {
      github: 'https://github.com/MotionCorrect/AES-GCM-16b-Decryption-Viewer'
    },
    image: 'assets/images/aes-gcm-viewer.png',
    readme: 'assets/readmes/aes-gcm-viewer.md',
    year: 2023
  },
  {
    id: 'pathfinding-visualizer',
    title: 'Pathfinding & Maze Generation Visualizer',
    description: 'Interactive web tool demonstrating classic pathfinding (A*, Dijkstra) and maze generation algorithms on a customizable grid, built with vanilla JavaScript.',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'Algorithms', 'Data Structures'],
    category: 'web',
    featured: false,
    achievements: [
      { type: 'educational', text: 'Algorithm Visualization', icon: 'fas fa-project-diagram' }
    ],
    links: {
      demo: 'https://kaidalisohaib.github.io/Pathfinding-Visualizer/',
      github: 'https://github.com/kaidalisohaib/Pathfinding-Visualizer'
    },
    year: 2021
  },
  {
    id: 'acronym-aggregator',
    title: 'Acronym Aggregator',
    description: 'Full-stack web application for managing organizational acronyms, featuring a Python/Flask backend, Ember.js frontend, and a complete CI/CD pipeline with Docker.',
    technologies: ['Python', 'Flask', 'Ember.js', 'Docker', 'CI/CD'],
    category: 'web',
    featured: false,
    achievements: [
      { type: 'professional', text: 'Pro-level DevOps', icon: 'fas fa-cogs' }
    ],
    links: {
      github: 'https://github.com/kaidalisohaib/acronym-aggregator'
    },
    year: 2022
  },
  {
    id: 'algorithmic-practice',
    title: 'Algorithmic Problem Solving in Rust',
    description: 'A collection of efficient solutions to problems from Advent of Code, implemented in Rust to master the language and core CS concepts.',
    technologies: ['Rust', 'Algorithms', 'Data Structures'],
    category: 'software',
    featured: false,
    achievements: [
      { type: 'practice', text: 'Coding Practice', icon: 'fas fa-keyboard' }
    ],
    links: {
      github: 'https://github.com/kaidalisohaib/AdventOfCode'
    },
    year: 2023
  },
  {
    id: 'gamejam-vanier-2024',
    title: 'Dungeon Crawler (Vanier Game Jam \'24)',
    description: '3D third-person action game developed in 48 hours. Features enemy AI with NavMesh, wave-based spawning, and a procedural room-teleportation system.',
    technologies: ['Unity', 'C#', 'Game Development', 'AI'],
    category: 'game-dev',
    featured: false,
    achievements: [
      { type: 'jam', text: 'Game Jam Project', icon: 'fas fa-gamepad' }
    ],
    links: {
      github: 'https://github.com/kaidalisohaib/GameJamVanier2024'
    },
    year: 2024
  },
  {
    id: 'line-follower-robot',
    title: 'Arduino Line Follower "Duck" Robot',
    description: 'First-place hackathon-winning line follower robot built on the Arduino platform. Utilized infrared sensors for line detection and PID control for smooth navigation.',
    technologies: ['Arduino', 'C++', 'PID Control', 'Sensors', 'Robotics'],
    category: 'robotics',
    featured: false,
    achievements: [
      { type: 'winner', text: '1st Place Hackathon', icon: 'fas fa-trophy' }
    ],
    links: {
      devpost: 'https://devpost.com/software/ducky-v2'
    },
    image: 'assets/images/line-follower.png',
    readme: 'assets/readmes/line-follower.md',
    year: 2025
  }
];

/**
 * Main Portfolio Application
 */
class PortfolioApp {
  constructor() {
    this.projects = PROJECTS_DATA;
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    // Initialize mobile viewport height fix
    this.updateViewportHeight();

    this.setupEventListeners();
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupProjects();
    this.setupAchievements();
    this.setupContactForm();
    this.setupTheme();
    this.setupAccessibility();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // DOM is already loaded when this is called
    this.onDOMContentLoaded();

    // Window Load
    window.addEventListener('load', () => {
      this.onWindowLoad();
    });

    // Window Resize
    const resizeHandler = window.Utils ?
      window.Utils.debounce(() => this.onWindowResize(), 250) :
      () => this.onWindowResize();

    window.addEventListener('resize', resizeHandler);

    // Window Scroll
    const scrollHandler = window.Utils ?
      window.Utils.throttle(() => this.onWindowScroll(), 16) :
      () => this.onWindowScroll();

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  /**
   * Setup navigation functionality
   */
  setupNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle with ARIA support
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu?.setAttribute('aria-expanded', !isExpanded);
        navMenu?.classList.add('show-menu');

        // Focus management
        if (!isExpanded) {
          navClose?.focus();
        }
      });
    }

    if (navClose) {
      navClose.addEventListener('click', () => {
        navToggle?.setAttribute('aria-expanded', 'false');
        navMenu?.setAttribute('aria-expanded', 'false');
        navMenu?.classList.remove('show-menu');

        // Return focus to toggle button
        navToggle?.focus();
      });
    }

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Close mobile menu and update ARIA
          navMenu?.classList.remove('show-menu');
          navToggle?.setAttribute('aria-expanded', 'false');
          navMenu?.setAttribute('aria-expanded', 'false');

          // Smooth scroll to section
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          if (window.Utils && window.Utils.smoothScrollTo) {
            window.Utils.smoothScrollTo(targetElement, headerHeight + 20);
          } else {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }

          // Update active link and ARIA
          this.updateActiveNavLink(link);

          // Focus management for accessibility
          setTimeout(() => {
            targetElement.focus();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      });

      // Keyboard navigation support
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });

    // Mobile-specific enhancements
    this.setupMobileEnhancements(navMenu, navToggle, navClose);
  }

  /**
   * Setup mobile-specific navigation enhancements
   */
  setupMobileEnhancements(navMenu, navToggle, navClose) {
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu && navMenu.classList.contains('show-menu')) {
        if (!navMenu.contains(e.target) && !navToggle?.contains(e.target)) {
          navMenu.classList.remove('show-menu');
        }
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu?.classList.contains('show-menu')) {
        navMenu.classList.remove('show-menu');
        navToggle?.focus(); // Return focus to toggle button
      }
    });

    // Trap focus within mobile menu when open
    if (navMenu) {
      const getFocusableElements = () => navMenu.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );

      navMenu.addEventListener('keydown', (e) => {
        if (!navMenu.classList.contains('show-menu')) return;

        const focusableElements = getFocusableElements();
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable?.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable?.focus();
            }
          }
        } else if (e.key === 'Escape') {
          // Close menu on Escape
          navMenu.classList.remove('show-menu');
          navToggle?.setAttribute('aria-expanded', 'false');
          navMenu?.setAttribute('aria-expanded', 'false');
          navToggle?.focus();
        }
      });
    }

    // Improve touch interactions
    if (navToggle) {
      navToggle.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent double-tap zoom
      });
    }

    if (navClose) {
      navClose.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent double-tap zoom
      });
    }

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      // Close menu on orientation change to prevent layout issues
      if (navMenu?.classList.contains('show-menu')) {
        navMenu.classList.remove('show-menu');
      }

      // Recalculate viewport height after orientation change
      setTimeout(() => {
        this.updateViewportHeight();
      }, 100);
    });

    // Handle resize events for responsive behavior
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Close mobile menu if screen becomes large enough
        if (window.innerWidth >= 768 && navMenu?.classList.contains('show-menu')) {
          navMenu.classList.remove('show-menu');
        }
        this.updateViewportHeight();
      }, 150);
    });
  }

  /**
   * Update viewport height for mobile browsers
   */
  updateViewportHeight() {
    // Fix for mobile browsers where 100vh doesn't account for address bar
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

  }

  /**
   * Update active navigation link
   * @param {Element} activeLink - The active link element
   */
  updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav__link').forEach(link => {
      link.classList.remove('active-link');
    });
    activeLink.classList.add('active-link');
  }

  /**
   * Setup projects functionality
   */
  setupProjects() {
    this.renderProjects();
    this.setupProjectFilters();
  }

  /**
   * Render projects grid
   */
  renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';

    this.projects.forEach(project => {
      const projectCard = this.createProjectCard(project);
      projectsGrid.appendChild(projectCard);
    });
  }

  /**
   * Create project card element
   * @param {Object} project - Project data
   * @returns {Element} Project card element
   */
  createProjectCard(project) {
    const card = document.createElement('article');
    card.className = `project__card filter-visible`;
    card.setAttribute('data-category', project.category);
    card.setAttribute('data-project-id', project.id)

    const achievementsHTML = project.achievements.map(achievement => `
      <span class="project__achievement-badge project__achievement-badge--${achievement.type}">
        <i class="${achievement.icon}" aria-hidden="true"></i>
        ${achievement.text}
      </span>
    `).join('');

    const technologiesHTML = project.technologies.map(tech => `
      <span class="project__tech-tag">${tech}</span>
    `).join('');

    // Add "Learn More" button first, then other links
    const learnMoreButton = `
      <a href="#" class="project__link project__link--primary" data-action="learn-more" aria-label="Learn more about ${project.title}">
        <i class="fas fa-info-circle" aria-hidden="true"></i>
        Learn More
      </a>
    `;

    const externalLinksHTML = Object.entries(project.links).map(([type, url]) => {
      const icons = {
        demo: 'fas fa-external-link-alt',
        github: 'fab fa-github',
        documentation: 'fas fa-book',
        devpost: 'fas fa-trophy'
      };

      const labels = {
        demo: 'Live Demo',
        github: 'Source Code',
        documentation: 'Documentation',
        devpost: 'Devpost'
      };

      return `
        <a href="${url}" class="project__link" target="_blank" rel="noopener noreferrer" aria-label="${labels[type]} for ${project.title}">
          <i class="${icons[type] || 'fas fa-link'}" aria-hidden="true"></i>
          ${labels[type] || type}
        </a>
      `;
    }).join('');

    const linksHTML = learnMoreButton + externalLinksHTML;

    card.innerHTML = `
      <div class="project__img-container">
        <img 
          src="assets/images/project-placeholder.svg" 
          alt="${project.title} project screenshot" 
          class="project__img"
          loading="lazy"
          width="400"
          height="250"
        >
        <div class="project__img-overlay"></div>
        <div class="project__achievements" role="list" aria-label="Project achievements">
          ${achievementsHTML}
        </div>
      </div>
      
      <div class="project__content">
        <h3 class="project__title">${project.title}</h3>
        <p class="project__description">${project.description}</p>
        
        <div class="project__technologies" role="list" aria-label="Technologies used">
          ${technologiesHTML}
        </div>
        
        <div class="project__links" role="list" aria-label="Project links">
          ${linksHTML}
        </div>
      </div>
    `;

    // The image will be replaced by the dynamic media system
    // No need for lazy loading setup since we start with a placeholder

    return card;
  }

  /**
   * Setup lazy loading for images
   * @param {Element} img - Image element
   * @param {string} title - Image title for error handling
   */
  setupLazyLoading(img, title) {
    let hasTriedFallback = false;

    // Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy-load');
          lazyImage.classList.add('loading');
          observer.unobserve(lazyImage);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    imageObserver.observe(img);

    // Error handling with fallback
    img.addEventListener('error', function () {
      if (!hasTriedFallback) {
        hasTriedFallback = true;
        this.src = 'assets/images/project-placeholder.svg';
      } else {
        // If even the placeholder fails, hide the image container
        this.style.display = 'none';
        console.warn('Failed to load project image and placeholder for:', title);
      }
    });

    // Loading success handler
    img.addEventListener('load', function () {
      this.classList.remove('loading');
      this.classList.add('loaded');
    });
  }

  /**
   * Setup project filters
   */
  setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.projects__filter-btn');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        this.filterProjects(filter);
        this.updateActiveFilter(button);
      });
    });
  }

  /**
   * Filter projects by category
   * @param {string} filter - Filter category
   */
  filterProjects(filter) {
    this.currentFilter = filter;
    const projectCards = document.querySelectorAll('.project__card');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        card.classList.remove('filter-hidden');
        card.classList.add('filter-visible');
        card.style.display = 'block';
      } else {
        card.classList.remove('filter-visible');
        card.classList.add('filter-hidden');
        setTimeout(() => {
          if (card.classList.contains('filter-hidden')) {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  }

  /**
   * Update active filter button
   * @param {Element} activeButton - The active filter button
   */
  updateActiveFilter(activeButton) {
    document.querySelectorAll('.projects__filter-btn').forEach(btn => {
      btn.classList.remove('projects__filter-btn--active');
    });
    activeButton.classList.add('projects__filter-btn--active');
  }

  /**
   * Setup scroll effects
   */
  setupScrollEffects() {
    // Skills accordion
    const skillsHeaders = document.querySelectorAll('.skills__header');
    skillsHeaders.forEach(header => {
      header.addEventListener('click', () => {
        this.toggleSkillsSection(header);
      });
    });

    // Initialize skills bars animation
    this.initializeSkillsBars();

    // Setup header scroll effect
    this.setupHeaderScrollEffect();

    // Setup scroll progress indicator
    this.setupScrollProgress();
  }

  /**
   * Setup header scroll effect for transparent to solid transition
   */
  setupHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scroll-header');
      } else {
        header.classList.remove('scroll-header');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  /**
   * Setup scroll progress indicator
   */
  setupScrollProgress() {
    // Create scroll progress indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'scroll-indicator';
    document.body.appendChild(progressIndicator);

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      progressIndicator.style.setProperty('--scroll-progress', `${Math.min(scrollPercent, 100)}%`);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial call
  }

  /**
   * Show notification to user
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning)
   * @param {number} duration - Duration in milliseconds
   */
  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Hide and remove notification
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  /**
   * Toggle skills section accordion
   * @param {Element} header - Skills header element
   */
  toggleSkillsSection(header) {
    const skillsContent = header.parentElement;
    const isCurrentlyOpen = skillsContent.classList.contains('skills__open');

    // Update ARIA attributes
    header.setAttribute('aria-expanded', !isCurrentlyOpen);

    // If clicking on an already open section, close it
    if (isCurrentlyOpen) {
      skillsContent.classList.remove('skills__open');
      skillsContent.classList.add('skills__close');
      header.setAttribute('aria-expanded', 'false');
      return;
    }

    // Close all sections first and update their ARIA attributes
    document.querySelectorAll('.skills__content').forEach(content => {
      content.classList.remove('skills__open');
      content.classList.add('skills__close');
      const contentHeader = content.querySelector('.skills__header');
      if (contentHeader) {
        contentHeader.setAttribute('aria-expanded', 'false');
      }
    });

    // Open the clicked section
    skillsContent.classList.remove('skills__close');
    skillsContent.classList.add('skills__open');
    header.setAttribute('aria-expanded', 'true');

    // Animate skill bars when section opens
    setTimeout(() => {
      this.animateSkillBars(skillsContent);
    }, 300);

    // Trigger progress animation if scroll animations are available
    if (window.scrollAnimations) {
      window.scrollAnimations.triggerProgressAnimation(skillsContent);
    }

    // Announce to screen readers
    const skillsTitle = header.querySelector('.skills__title')?.textContent || 'Skills section';
    this.announceToScreenReader(`${skillsTitle} ${isCurrentlyOpen ? 'collapsed' : 'expanded'}`);
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   */
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Initialize skills bars animation
   */
  initializeSkillsBars() {
    // Animate bars in the initially open section
    const openSection = document.querySelector('.skills__content.skills__open');
    if (openSection) {
      setTimeout(() => {
        this.animateSkillBars(openSection);
      }, 500);
    }
  }

  /**
   * Animate skill bars in a section
   * @param {Element} section - Skills section element
   */
  animateSkillBars(section) {
    const skillBars = section.querySelectorAll('.skills__percentage');
    skillBars.forEach((bar, index) => {
      const percentage = bar.getAttribute('data-percentage');
      if (percentage) {
        setTimeout(() => {
          bar.style.width = percentage;
        }, index * 100);
      }
    });
  }

  /**
   * Setup achievements section functionality
   */
  setupAchievements() {
    this.setupAchievementAnimations();
    this.setupAchievementInteractions();
    this.setupAchievementCounters();
  }

  /**
   * Setup achievement animations
   */
  setupAchievementAnimations() {
    const achievementCards = document.querySelectorAll('.achievement__card');
    if (achievementCards.length === 0) return;

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const achievementObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 150);

          achievementObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    achievementCards.forEach(card => {
      achievementObserver.observe(card);
    });
  }

  /**
   * Setup achievement interactions
   */
  setupAchievementInteractions() {
    const achievementCards = document.querySelectorAll('.achievement__card');

    achievementCards.forEach(card => {
      card.addEventListener('click', (e) => {
        this.handleAchievementCardClick(card, e);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleAchievementCardClick(card, e);
        }
      });
    });
  }

  /**
   * Handle achievement card click
   * @param {Element} card - Achievement card element
   * @param {Event} e - Click event
   */
  handleAchievementCardClick(card, e) {
    const title = card.querySelector('.achievement__title')?.textContent || 'Achievement';
    const description = card.querySelector('.achievement__description')?.textContent || '';

    this.showNotification(`🏆 ${title}: ${description}`, 'success');
    console.log('Achievement clicked:', title);
  }

  /**
   * Setup achievement counters
   */
  setupAchievementCounters() {
    const statNumbers = document.querySelectorAll('.achievement__stat-number');
    if (statNumbers.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateAchievementCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    statNumbers.forEach(stat => {
      counterObserver.observe(stat);
    });
  }

  /**
   * Animate achievement counter
   * @param {Element} element - Counter element
   */
  animateAchievementCounter(element) {
    const text = element.textContent;
    const isPercentage = text.includes('%');
    const isDollar = text.includes('$') || text.includes('K');

    let target = 0;
    let suffix = '';

    if (isPercentage) {
      target = parseInt(text.replace('%', ''));
      suffix = '%';
    } else if (isDollar) {
      if (text.includes('K')) {
        target = parseInt(text.replace(/[$K]/g, ''));
        suffix = 'K';
      } else {
        target = parseInt(text.replace('$', ''));
        suffix = '';
      }
    } else {
      target = parseInt(text);
    }

    if (isNaN(target)) return;

    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        const displayValue = Math.floor(current);
        element.textContent = isDollar && suffix === 'K' ? `$${displayValue}K` :
          isDollar ? `$${displayValue}` :
            isPercentage ? `${displayValue}%` :
              displayValue;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = text;
      }
    };

    updateCounter();
  }

  /**
   * Setup contact form functionality
   */
  setupContactForm() {
    // Contact form removed - using direct contact methods only
    console.log('Contact form disabled - using direct contact methods');
  }

  /**
   * Setup theme functionality
   */
  setupTheme() {
    // Theme functionality placeholder
    console.log('Theme setup - using dark theme as default');
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Accessibility features placeholder
    console.log('Accessibility setup - basic features enabled');
  }

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info)
   */
  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: 500;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease-in-out;
      max-width: 300px;
      word-wrap: break-word;
    `;

    // Set background color based on type
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  /**
   * Event handlers
   */
  onDOMContentLoaded() {
    console.log('DOM Content Loaded');
  }

  onWindowLoad() {
    console.log('Window Loaded');
  }

  onWindowResize() {
    console.log('Window Resized');
  }

  onWindowScroll() {
    // Handle scroll events
    const header = document.querySelector('.header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scroll-header');
      } else {
        header.classList.remove('scroll-header');
      }
    }
  }

  /**
   * Contact Methods - Simple direct contact links only
   * No form submission needed for static GitHub Pages site
   */
}

// Initialize the application when DOM is ready
let portfolioApp;

document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing PortfolioApp...');
  portfolioApp = new PortfolioApp();
});

// Export for external use
window.PortfolioApp = PortfolioApp;
window.PROJECTS_DATA = PROJECTS_DATA;