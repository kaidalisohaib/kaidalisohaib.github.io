# Design Document

## Overview

The portfolio homepage will be a modern, single-page application (SPA) built with vanilla HTML5, CSS3, and JavaScript to ensure optimal performance and compatibility with GitHub Pages hosting. The design will feature a clean, professional aesthetic with smooth animations and interactive elements that showcase Sohaib's technical expertise and achievements.

The site will use a mobile-first responsive design approach, ensuring excellent user experience across all devices. The color scheme will be modern and professional, using a dark theme with accent colors to create visual hierarchy and maintain readability.

## Architecture

### Hosting & Deployment
- **Platform**: GitHub Pages (github.io subdomain)
- **Repository Structure**: Standard GitHub Pages setup with `index.html` in root
- **Domain**: `kaidalisohaib.github.io` (or custom domain if configured)
- **SSL**: Automatic HTTPS via GitHub Pages
- **CDN**: GitHub's global CDN for fast content delivery

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid and Flexbox for layouts
- **Icons**: Font Awesome or Feather Icons via CDN
- **Fonts**: Google Fonts (Inter, JetBrains Mono for code)
- **Animations**: CSS animations and transitions, Intersection Observer API
- **Build Process**: None required - direct static files for GitHub Pages compatibility

### File Structure
```
/
├── index.html              # Main homepage
├── styles/
│   ├── main.css           # Main stylesheet
│   ├── components.css     # Component-specific styles
│   └── responsive.css     # Media queries
├── scripts/
│   ├── main.js           # Main JavaScript functionality
│   ├── animations.js     # Animation controllers
│   └── utils.js          # Utility functions
├── assets/
│   ├── images/           # Project screenshots, profile photo
│   ├── icons/            # Custom icons if needed
│   └── documents/        # Resume PDF
└── README.md             # Repository documentation
```

## Components and Interfaces

### 1. Navigation Header
- **Fixed/Sticky Navigation**: Transparent background that becomes solid on scroll
- **Logo/Name**: "Sohaib Kaidali" as clickable home link
- **Navigation Menu**: Smooth scroll links to sections (About, Projects, Experience, Contact)
- **Mobile Menu**: Hamburger menu for mobile devices
- **Theme Toggle**: Optional dark/light mode switcher

### 2. Hero Section
- **Full Viewport Height**: Compelling first impression
- **Animated Typography**: Typewriter effect for name and title
- **Subtitle**: "Computer Engineering Student at McGill University"
- **Key Value Proposition**: Brief statement highlighting expertise areas
- **CTA Buttons**: "View Projects", "Download Resume", "Contact Me"
- **Social Links**: GitHub, LinkedIn, Email with hover animations
- **Background**: Subtle animated particles or geometric patterns

### 3. About Section
- **Professional Summary**: Concise overview of background and goals
- **Technical Skills Grid**: 
  - Programming Languages: Python, C/C++, Rust, Java, JavaScript/TypeScript
  - Tools: Git, Docker, Unity, ROS2, ESP32, AWS
  - Frameworks: React, Node.js, Arduino, WPILib
  - AI/CV: TensorFlow, PyTorch, OpenCV, MediaPipe
- **Skill Visualization**: Progress bars, badges, or icon-based display
- **Personal Touch**: Brief mention of trilingual abilities and interests

### 4. Featured Projects Section
- **Project Grid**: Responsive card layout (3 columns desktop, 2 tablet, 1 mobile)
- **Project Cards**: Each containing:
  - Project thumbnail/screenshot
  - Title and brief description
  - Technology tags/badges
  - Achievement indicators (hackathon wins, awards)
  - Links to demo, GitHub, documentation
- **Featured Projects**:
  - AMCL Visualization (Unity, C#, Particle Filters)
  - Rubber Duck Sumo Robot (C++, ESP32, PID Control)
  - Sign Atlas (AI/ML, React, MediaPipe)
  - 2D Place (Rust, WebSockets, Real-time)
  - FIRST Robotics motor control system
  - MotionCorrect CI/CD improvements
  - Hackathon highlights
  - Pathfinding Visualizer (JavaScript, Algorithms)

### 5. Experience Timeline
- **Professional Experience**: 
  - FIRST Robotics Team 3986 (Captain, Lead Developer)
  - MotionCorrect Inc. (Software Development Consultant)
  - Vanier College (Lab Assistant)
- **Timeline Design**: Vertical timeline with alternating content
- **Achievement Highlights**: Key accomplishments and metrics
- **Education**: McGill University Computer Engineering program

### 6. Achievements & Recognition
- **Hackathon Victories**: Grid of achievement cards
- **Competition Results**: FIRST Robotics championship, IEEE competitions
- **Awards**: Scholarships, grants, technical awards
- **Metrics**: Build time optimizations, performance improvements

### 7. Contact Section
- **Contact Form**: Simple form with name, email, message fields
- **Direct Contact**: Email, phone, LinkedIn, GitHub links
- **Location**: Montreal, QC indication
- **Availability**: Current status (seeking internships/opportunities)

### 8. Footer
- **Copyright**: Current year and name
- **Quick Links**: Navigation shortcuts
- **Social Media**: Icon links to profiles
- **Back to Top**: Smooth scroll to hero section

## Data Models

### Project Data Structure
```javascript
const projects = [
  {
    id: 'amcl-visualization',
    title: 'Adaptive Monte Carlo Localization Visualization',
    description: 'Interactive Unity simulation demonstrating robot localization algorithms',
    technologies: ['Unity', 'C#', 'Particle Filters', 'WebGL'],
    category: 'Robotics',
    featured: true,
    achievements: ['Educational Tool', 'Complete Documentation'],
    links: {
      demo: 'https://kaidalisohaib.github.io/AMCL-Visualization/',
      github: 'https://github.com/kaidalisohaib/AMCL-Visualization',
      documentation: 'https://kaidalisohaib.github.io/AMCL-Visualization/explanation.html'
    },
    image: 'assets/images/amcl-preview.png',
    year: 2024
  },
  // Additional projects...
];
```

### Experience Data Structure
```javascript
const experiences = [
  {
    id: 'first-robotics',
    title: 'Captain, Pilot, and Lead Developer',
    company: 'FIRST Robotics Team 3986 - Express-O',
    location: 'Montreal, QC',
    period: 'Jan. 2020 – Jun. 2022',
    type: 'Leadership',
    achievements: [
      'Engineered advanced motor control system with PID and feedforward control',
      'Designed computer vision pipeline using OpenCV for robot localization',
      'Led team to 2023 Montreal Regional Championship victory',
      'Secured $5,000 annual grant and $2,000 scholarship'
    ]
  },
  // Additional experiences...
];
```

## Error Handling

### Performance Optimization
- **Image Optimization**: WebP format with fallbacks, lazy loading
- **Code Splitting**: Separate CSS and JS files for better caching
- **Minification**: Minified CSS and JS for production
- **Caching Strategy**: Proper cache headers for static assets

### Accessibility
- **WCAG 2.1 AA Compliance**: Proper heading hierarchy, alt text, color contrast
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Fallbacks**: CSS fallbacks for advanced features
- **Polyfills**: Minimal polyfills for essential features if needed

## Testing Strategy

### Manual Testing
- **Cross-Browser Testing**: Test on major browsers and versions
- **Device Testing**: Test on various screen sizes and devices
- **Performance Testing**: Lighthouse audits for performance, accessibility, SEO
- **User Experience Testing**: Navigation flow and interaction testing

### Automated Testing
- **HTML Validation**: W3C HTML validator
- **CSS Validation**: W3C CSS validator
- **Accessibility Testing**: axe-core or similar tools
- **Performance Monitoring**: GitHub Actions with Lighthouse CI

### GitHub Pages Specific Testing
- **Build Process**: Ensure all assets load correctly from GitHub Pages
- **HTTPS**: Verify SSL certificate and secure connections
- **Custom Domain**: Test custom domain configuration if applicable
- **CDN Performance**: Verify global content delivery performance

## Deployment Strategy

### GitHub Pages Setup
1. **Repository Configuration**: Enable GitHub Pages in repository settings
2. **Branch Strategy**: Deploy from `main` branch root directory
3. **Custom Domain**: Configure custom domain if desired
4. **SSL Certificate**: Automatic HTTPS via GitHub Pages

### Continuous Deployment
1. **Automatic Deployment**: Changes to main branch trigger automatic deployment
2. **Build Validation**: GitHub Actions workflow for pre-deployment checks
3. **Performance Monitoring**: Automated Lighthouse audits on deployment
4. **Backup Strategy**: Git history serves as version control and backup

### SEO and Analytics
- **Meta Tags**: Proper title, description, and Open Graph tags
- **Structured Data**: JSON-LD for professional profile information
- **Sitemap**: Simple sitemap.xml for search engines
- **Analytics**: Google Analytics or similar for visitor tracking
- **Search Console**: Google Search Console for SEO monitoring