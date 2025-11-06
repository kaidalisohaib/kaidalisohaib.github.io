/*=============== PROJECT MODAL FUNCTIONALITY ===============*/

/**
 * Project Modal System
 * Fetches and displays README files in a beautiful modal
 */
class ProjectModal {
    constructor() {
        this.modal = null;
        this.currentProject = null;
        this.cache = new Map(); // Cache README content
        this.mediaCache = new Map(); // Cache extracted media for project cards
        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
        this.setupMarkdownRenderer();
    }

    /**
     * Create the modal HTML structure
     */
    createModal() {
        const modalHTML = `
            <div class="project-modal" id="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div class="project-modal__overlay"></div>
                <div class="project-modal__container">
                    <div class="project-modal__header">
                        <div class="project-modal__title-section">
                            <h2 class="project-modal__title" id="modal-title">Project Details</h2>
                            <div class="project-modal__meta">
                                <span class="project-modal__category"></span>
                                <div class="project-modal__achievements"></div>
                            </div>
                        </div>
                        <div class="project-modal__actions">
                            <div class="project-modal__links"></div>
                            <button class="project-modal__close" aria-label="Close modal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="project-modal__body">
                        <div class="project-modal__loading">
                            <div class="loading-spinner"></div>
                            <p>Loading project details...</p>
                        </div>
                        
                        <div class="project-modal__error" style="display: none;">
                            <div class="error-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <h3>Unable to load project details</h3>
                            <p>The README file could not be loaded. Please check the repository link or try again later.</p>
                            <button class="button button--outline retry-btn">
                                <i class="fas fa-redo"></i>
                                Try Again
                            </button>
                        </div>
                        
                        <div class="project-modal__content markdown-content" style="display: none;"></div>
                    </div>
                    
                    <div class="project-modal__footer">
                        <div class="project-modal__tech-stack"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('project-modal');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Close modal events
        const closeBtn = this.modal.querySelector('.project-modal__close');
        const overlay = this.modal.querySelector('.project-modal__overlay');

        closeBtn.addEventListener('click', () => this.closeModal());
        overlay.addEventListener('click', () => this.closeModal());

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Retry button
        const retryBtn = this.modal.querySelector('.retry-btn');
        retryBtn.addEventListener('click', () => {
            if (this.currentProject) {
                this.loadProjectContent(this.currentProject);
            }
        });

        // Listen for project card clicks
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project__card');
            if (projectCard) {
                const learnMoreBtn = e.target.closest('.project__link[data-action="learn-more"]');
                if (learnMoreBtn) {
                    e.preventDefault();
                    const projectId = projectCard.dataset.projectId;
                    if (projectId) {
                        this.openModal(projectId);
                    }
                }
            }
        });

        // Preload README content on hover for faster loading
        document.addEventListener('mouseenter', (e) => {
            if (e.target && typeof e.target.closest === 'function') {
                const projectCard = e.target.closest('.project__card');
                if (projectCard) {
                    const projectId = projectCard.dataset.projectId;
                    if (projectId && !this.cache.has(projectId)) {
                        // Preload content in background
                        this.preloadProjectContent(projectId);
                    }
                }
            }
        }, true); // Use capture phase for better performance
    }

    /**
     * Setup markdown renderer
     */
    setupMarkdownRenderer() {
        // Check if markdown-it is available, otherwise load it
        if (typeof markdownit !== 'undefined') {
            this.initializeMarkdownIt();
        } else {
            this.loadMarkdownItLibrary().then(() => {
                this.initializeMarkdownIt();
            }).catch(() => {
                console.warn('Failed to load markdown-it, using fallback renderer');
                this.setupFallbackRenderer();
            });
        }
    }

    /**
     * Load markdown-it library dynamically
     */
    async loadMarkdownItLibrary() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize markdown-it with default configuration
     */
    initializeMarkdownIt() {
        if (typeof markdownit === 'undefined') {
            console.warn('markdown-it not available, falling back to simple renderer');
            this.setupFallbackRenderer();
            return;
        }

        // Initialize markdown-it with configuration to enable header IDs
        const md = markdownit({
            html: true,        // Enable HTML tags in source
            linkify: true,     // Autoconvert URL-like text to links
            typographer: true, // Enable some language-neutral replacement + quotes beautification
            breaks: false      // Convert '\n' in paragraphs into <br>
        });

        // Enable the anchor plugin for header IDs
        md.use(function (md) {
            // Override heading renderer to add IDs
            const defaultRender = md.renderer.rules.heading_open || function (tokens, idx, options, env, renderer) {
                return renderer.renderToken(tokens, idx, options);
            };

            md.renderer.rules.heading_open = function (tokens, idx, options, env, renderer) {
                const token = tokens[idx];
                const title = tokens[idx + 1].content;

                // Generate ID from title with comprehensive Unicode cleaning
                const id = title
                    .toLowerCase()
                    .trim()                                    // Remove leading/trailing whitespace
                    .replace(/[\u{1F000}-\u{1F9FF}]/gu, '')  // Remove emojis (Unicode blocks)
                    .replace(/[\u{2600}-\u{26FF}]/gu, '')    // Remove miscellaneous symbols
                    .replace(/[\u{2700}-\u{27BF}]/gu, '')    // Remove dingbats
                    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')    // Remove variation selectors
                    .replace(/[^\w\s-]/g, '')                 // Remove remaining special characters
                    .replace(/\s+/g, '-')                     // Replace spaces with hyphens
                    .replace(/-+/g, '-')                      // Replace multiple hyphens with single
                    .replace(/^-+|-+$/g, '')                  // Remove leading/trailing hyphens
                    .replace(/^$/, 'heading');                // Fallback for empty strings

                // Add id attribute to the token
                token.attrSet('id', id);

                return defaultRender(tokens, idx, options, env, renderer);
            };
        });

        this.markdownRenderer = {
            render: (markdown) => {
                try {
                    return md.render(markdown);
                } catch (error) {
                    console.error('Error rendering markdown:', error);
                    return this.fallbackRender(markdown);
                }
            }
        };
    }

    /**
     * Generate clean ID from text (matches header ID generation)
     * @param {string} text - Text to convert to ID
     * @returns {string} Clean ID
     */
    generateCleanId(text) {
        return text
            .toLowerCase()
            .trim()                                    // Remove leading/trailing whitespace
            .replace(/[\u{1F000}-\u{1F9FF}]/gu, '')  // Remove emojis (Unicode blocks)
            .replace(/[\u{2600}-\u{26FF}]/gu, '')    // Remove miscellaneous symbols
            .replace(/[\u{2700}-\u{27BF}]/gu, '')    // Remove dingbats
            .replace(/[\u{FE00}-\u{FE0F}]/gu, '')    // Remove variation selectors
            .replace(/[^\w\s-]/g, '')                 // Remove remaining special characters
            .replace(/\s+/g, '-')                     // Replace spaces with hyphens
            .replace(/-+/g, '-')                      // Replace multiple hyphens with single
            .replace(/^-+|-+$/g, '')                  // Remove leading/trailing hyphens
            .replace(/^$/, 'heading');                // Fallback for empty strings
    }

    /**
     * Setup fallback renderer if marked.js fails to load
     */
    setupFallbackRenderer() {
        this.markdownRenderer = {
            render: (markdown) => this.fallbackRender(markdown)
        };
    }

    /**
     * Simple fallback markdown renderer
     */
    fallbackRender(markdown) {
        return markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')

            // Bold and italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')

            // Code blocks
            .replace(/```[\s\S]*?```/g, (match) => {
                const code = match.replace(/```(\w+)?\n?/, '').replace(/```$/, '');
                return `<pre><code>${code}</code></pre>`;
            })
            .replace(/`(.*?)`/g, '<code>$1</code>')

            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

            // Images
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="readme-image" loading="lazy">')

            // Lists
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(?!<[h|u|p|c|i])/gm, '<p>')
            .replace(/(?<![>])$/gm, '</p>')

            // Clean up empty paragraphs
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<[h|u])/g, '$1')
            .replace(/(<\/[h|u]>)<\/p>/g, '$1');
    }

    /**
     * Open modal for a specific project
     * @param {string} projectId - Project identifier
     */
    async openModal(projectId) {
        // Find project data
        const project = this.findProjectById(projectId);
        if (!project) {
            console.error('Project not found:', projectId);
            return;
        }

        this.currentProject = project;

        // Update modal header
        this.updateModalHeader(project);

        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management
        this.modal.querySelector('.project-modal__close').focus();

        // Load content
        await this.loadProjectContent(project);
    }

    /**
     * Close modal
     */
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentProject = null;

        // Reset modal state
        this.showLoading();
    }

    /**
     * Find project by ID
     * @param {string} projectId - Project ID
     * @returns {Object|null} Project data
     */
    findProjectById(projectId) {
        // Access the global PROJECTS_DATA from main.js
        if (portfolioApp && portfolioApp.projects) {
            return portfolioApp.projects.find(p => p.id === projectId);
        }

        // Fallback: try to find in global PROJECTS_DATA
        if (window.PROJECTS_DATA) {
            return window.PROJECTS_DATA.find(p => p.id === projectId);
        }

        return null;
    }

    /**
     * Update modal header with project info
     * @param {Object} project - Project data
     */
    updateModalHeader(project) {
        const titleEl = this.modal.querySelector('.project-modal__title');
        const categoryEl = this.modal.querySelector('.project-modal__category');
        const achievementsEl = this.modal.querySelector('.project-modal__achievements');
        const linksEl = this.modal.querySelector('.project-modal__links');
        const techStackEl = this.modal.querySelector('.project-modal__tech-stack');

        // Update title
        titleEl.textContent = project.title;

        // Update category
        categoryEl.textContent = this.getCategoryDisplayName(project.category);
        categoryEl.className = `project-modal__category project-category--${project.category}`;

        // Update achievements
        achievementsEl.innerHTML = project.achievements.map(achievement => `
            <span class="achievement-badge achievement-badge--${achievement.type}">
                <i class="${achievement.icon}"></i>
                ${achievement.text}
            </span>
        `).join('');

        // Update links
        const linkButtons = Object.entries(project.links).map(([type, url]) => {
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
                <a href="${url}" class="button button--small button--outline" target="_blank" rel="noopener noreferrer">
                    <i class="${icons[type] || 'fas fa-link'}"></i>
                    ${labels[type] || type}
                </a>
            `;
        }).join('');

        linksEl.innerHTML = linkButtons;

        // Update tech stack
        const techTags = project.technologies.map(tech => `
            <span class="tech-tag tech-tag--small">${tech}</span>
        `).join('');

        techStackEl.innerHTML = `
            <div class="tech-stack-label">Technologies:</div>
            <div class="tech-stack-tags">${techTags}</div>
        `;
    }

    /**
     * Get display name for category
     * @param {string} category - Category key
     * @returns {string} Display name
     */
    getCategoryDisplayName(category) {
        const categoryNames = {
            'robotics': 'Robotics',
            'ai-ml': 'AI/ML',
            'web': 'Web Development',
            'algorithms': 'Algorithms',
            'software': 'Software',
            'game-dev': 'Game Development',
            'data': 'Data Science'
        };
        return categoryNames[category] || category;
    }

    /**
     * Preload project content in background for faster modal opening
     * @param {string} projectId - Project ID
     */
    async preloadProjectContent(projectId) {
        try {
            const project = this.findProjectById(projectId);
            if (!project) return;

            let content = '';

            // Try to fetch README from GitHub if repo link exists
            if (project.links.github) {
                content = await this.fetchGitHubReadme(project.links.github);
            }

            // Fallback to custom README or project description
            if (!content) {
                content = await this.fetchCustomReadme(project.id, project.readme) || this.generateFallbackContent(project);
            }

            // Cache the content for instant loading later
            this.cache.set(project.id, content);

            // Add visual indicator that content is ready
            this.markContentAsReady(projectId);

            console.log(`✅ Preloaded README for ${project.title} (${content.length} characters)`);
        } catch (error) {
            console.error('Error preloading project content:', error);
            // Don't cache errors, let the modal handle them when opened
        }
    }

    /**
     * Load project content (README)
     * @param {Object} project - Project data
     */
    async loadProjectContent(project) {
        this.showLoading();

        try {
            // Check cache first
            if (this.cache.has(project.id)) {
                this.displayContent(this.cache.get(project.id));
                return;
            }

            let content = '';

            // Try to fetch README from GitHub if repo link exists
            if (project.links.github) {
                content = await this.fetchGitHubReadme(project.links.github);
            }

            // Fallback to custom README or project description
            if (!content) {
                content = await this.fetchCustomReadme(project.id, project.readme) || this.generateFallbackContent(project);
            }

            // Cache the content
            this.cache.set(project.id, content);

            // Display content
            this.displayContent(content);

        } catch (error) {
            console.error('Error loading project content:', error);
            this.showError();
        }
    }

    /**
     * Fetch README from GitHub repository
     * @param {string} githubUrl - GitHub repository URL
     * @returns {Promise<string>} README content
     */
    async fetchGitHubReadme(githubUrl) {
        try {
            // Extract owner and repo from GitHub URL
            const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (!match) return '';

            const [, owner, repo] = match;

            // Try different README file names and branch names
            const readmeFiles = ['README.md', 'readme.md', 'Readme.md', 'README.MD'];
            const branches = ['main', 'master', 'develop'];

            // Try each branch with each README filename
            for (const branch of branches) {
                for (const filename of readmeFiles) {
                    try {
                        // Use raw GitHub URL format for direct file access
                        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${branch}/${filename}`;

                        // Add timeout to prevent hanging
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                        const response = await fetch(rawUrl, {
                            signal: controller.signal,
                            cache: 'default' // Allow browser caching
                        });

                        clearTimeout(timeoutId);

                        if (response.ok) {
                            const content = await response.text();
                            return content;
                        }
                    } catch (e) {
                        // Continue to next combination
                        continue;
                    }
                }
            }

            return '';
        } catch (error) {
            console.warn('Error fetching GitHub README:', error.message);
            return '';
        }
    }

    /**
     * Fetch custom README file
     * @param {string} projectId - Project ID
     * @param {string} customPath - Optional custom README path
     * @returns {Promise<string>} README content
     */
    async fetchCustomReadme(projectId, customPath = null) {
        try {
            const readmePath = customPath || `assets/readmes/${projectId}.md`;
            console.log(`🔍 Fetching README from: ${readmePath} (projectId: ${projectId}, customPath: ${customPath})`);
            const response = await fetch(readmePath);
            if (response.ok) {
                const content = await response.text();
                console.log(`✅ Successfully loaded README from ${readmePath} (${content.length} characters)`);
                return content;
            } else {
                console.warn(`❌ Failed to fetch README from ${readmePath} - Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching custom README:', error);
        }
        return '';
    }

    /**
     * Generate fallback content when no README is available
     * @param {Object} project - Project data
     * @returns {string} Fallback content
     */
    generateFallbackContent(project) {
        return `# ${project.title}

${project.description}

## Technologies Used

${project.technologies.map(tech => `- ${tech}`).join('\n')}

## Features

${project.achievements.map(achievement => `- ${achievement.text}`).join('\n')}

## Links

${Object.entries(project.links).map(([type, url]) => `- [${type.charAt(0).toUpperCase() + type.slice(1)}](${url})`).join('\n')}

---

*This project was developed in ${project.year}. For more details, please check the repository or demo links above.*`;
    }

    /**
     * Display content in modal
     * @param {string} content - Markdown content
     */
    displayContent(content) {
        const contentEl = this.modal.querySelector('.project-modal__content');
        const loadingEl = this.modal.querySelector('.project-modal__loading');
        const errorEl = this.modal.querySelector('.project-modal__error');

        // Hide loading and error
        loadingEl.style.display = 'none';
        errorEl.style.display = 'none';

        // Render markdown and display
        contentEl.innerHTML = this.markdownRenderer.render(content);
        contentEl.style.display = 'block';

        // Process images and links
        this.processContent(contentEl);

        // Scroll to top
        contentEl.scrollTop = 0;
    }

    /**
     * Process content after rendering
     * @param {Element} contentEl - Content element
     */
    processContent(contentEl) {
        // Make images responsive
        const images = contentEl.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });

            img.addEventListener('error', () => {
                img.style.display = 'none';
            });
        });

        // Add copy buttons to code blocks
        const codeBlocks = contentEl.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            const pre = block.parentElement;

            // Add copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-copy-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.setAttribute('aria-label', 'Copy code');

            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(block.textContent);
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                }
            });

            pre.style.position = 'relative';
            pre.appendChild(copyBtn);
        });

        // Smooth scroll for internal links
        const internalLinks = contentEl.querySelectorAll('a[href^="#"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const targetId = href.substring(1);

                    // Try multiple strategies to find the target element
                    let target = null;

                    // Strategy 1: Try the exact ID (URL-encoded)
                    try {
                        const escapedId = CSS.escape(targetId);
                        target = contentEl.querySelector(`#${escapedId}`);
                    } catch (e) {
                        // Invalid selector, continue to next strategy
                    }

                    // Strategy 2: Try URL-decoded version
                    if (!target) {
                        try {
                            const decodedId = decodeURIComponent(targetId);
                            const escapedDecodedId = CSS.escape(decodedId);
                            target = contentEl.querySelector(`#${escapedDecodedId}`);
                        } catch (e) {
                            // Invalid selector, continue to next strategy
                        }
                    }

                    // Strategy 3: Try to generate clean ID from the link text (fallback)
                    if (!target) {
                        const linkText = link.textContent || '';
                        const cleanId = this.generateCleanId(linkText);
                        if (cleanId) {
                            target = contentEl.querySelector(`#${cleanId}`);
                        }
                    }

                    // Strategy 4: Find by heading text content
                    if (!target) {
                        const linkText = link.textContent || '';
                        const headings = contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
                        for (const heading of headings) {
                            if (heading.textContent && heading.textContent.trim() === linkText.trim()) {
                                target = heading;
                                break;
                            }
                        }
                    }

                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        console.warn('Could not find target for link:', href, 'Link text:', link.textContent);
                    }
                }
            });
        });
    }

    /**
     * Show loading state
     */
    showLoading() {
        const loadingEl = this.modal.querySelector('.project-modal__loading');
        const contentEl = this.modal.querySelector('.project-modal__content');
        const errorEl = this.modal.querySelector('.project-modal__error');

        loadingEl.style.display = 'flex';
        contentEl.style.display = 'none';
        errorEl.style.display = 'none';
    }

    /**
     * Show error state
     */
    showError() {
        const loadingEl = this.modal.querySelector('.project-modal__loading');
        const contentEl = this.modal.querySelector('.project-modal__content');
        const errorEl = this.modal.querySelector('.project-modal__error');

        loadingEl.style.display = 'none';
        contentEl.style.display = 'none';
        errorEl.style.display = 'flex';
    }



    /**
     * Extract media URLs from README content
     * @param {string} content - README markdown content
     * @returns {Array} Array of media URLs
     */
    extractMediaFromReadme(content) {
        const mediaUrls = [];

        // Regex to find markdown images: ![alt](url)
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let match;

        while ((match = imageRegex.exec(content)) !== null) {
            const url = match[2];
            const alt = match[1] || 'Project image';

            // Include GitHub raw URLs and local asset paths
            let processedUrl = url;
            let shouldInclude = false;

            // GitHub URLs
            if (url.includes('raw.githubusercontent.com') ||
                url.includes('github.com') && (url.includes('/raw/') || url.includes('/blob/'))) {

                // Convert GitHub blob URLs to raw URLs
                if (url.includes('/blob/')) {
                    processedUrl = url.replace('/blob/', '/raw/');
                }
                shouldInclude = true;
            }
            // Local asset paths
            else if (url.startsWith('assets/') || url.startsWith('./assets/') || url.startsWith('../assets/')) {
                shouldInclude = true;
            }

            if (shouldInclude && /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(processedUrl)) {
                mediaUrls.push({
                    url: processedUrl,
                    alt: alt,
                    type: processedUrl.toLowerCase().includes('.gif') ? 'gif' : 'image'
                });
            }
        }

        // Also check for HTML img tags
        const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
        while ((match = htmlImageRegex.exec(content)) !== null) {
            const url = match[1];

            // Include GitHub URLs and local asset paths
            const isGitHub = url.includes('raw.githubusercontent.com') ||
                (url.includes('github.com') && url.includes('/raw/'));
            const isLocalAsset = url.startsWith('assets/') ||
                url.startsWith('./assets/') ||
                url.startsWith('../assets/');

            if ((isGitHub || isLocalAsset) && /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url)) {
                mediaUrls.push({
                    url: url,
                    alt: 'Project image',
                    type: url.toLowerCase().includes('.gif') ? 'gif' : 'image'
                });
            }
        }

        // Remove duplicates
        const uniqueMedia = mediaUrls.filter((media, index, self) =>
            index === self.findIndex(m => m.url === media.url)
        );

        return uniqueMedia;
    }

    /**
     * Update project card with extracted media
     * @param {string} projectId - Project ID
     * @param {Array} mediaUrls - Array of media objects
     */
    updateProjectCardMedia(projectId, mediaUrls) {
        const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
        if (!projectCard || mediaUrls.length === 0) return;

        const imgContainer = projectCard.querySelector('.project__img-container');
        if (!imgContainer) return;

        // Clear existing content
        imgContainer.innerHTML = '';

        if (mediaUrls.length === 1) {
            // Single image
            this.createSingleMediaElement(imgContainer, mediaUrls[0], projectId);
        } else {
            // Multiple images - create carousel
            this.createMediaCarousel(imgContainer, mediaUrls, projectId);
        }
    }

    /**
     * Create single media element
     * @param {Element} container - Container element
     * @param {Object} media - Media object
     * @param {string} projectId - Project ID
     */
    createSingleMediaElement(container, media, projectId) {
        const mediaElement = document.createElement('div');
        mediaElement.className = 'project__media-single';

        const img = document.createElement('img');
        img.src = media.url;
        img.alt = media.alt;
        img.className = 'project__img';
        img.loading = 'lazy';

        // Add error handling
        img.addEventListener('error', () => {
            console.warn(`Failed to load image for project ${projectId}:`, media.url);
            // Fallback to placeholder or remove
            img.src = 'assets/images/project-placeholder.svg';
        });

        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });

        mediaElement.appendChild(img);

        // Add overlay for project achievements
        const overlay = document.createElement('div');
        overlay.className = 'project__img-overlay';
        mediaElement.appendChild(overlay);

        container.appendChild(mediaElement);
    }

    /**
     * Create media carousel
     * @param {Element} container - Container element
     * @param {Array} mediaUrls - Array of media objects
     * @param {string} projectId - Project ID
     */
    createMediaCarousel(container, mediaUrls, projectId) {
        const carousel = document.createElement('div');
        carousel.className = 'project__media-carousel';

        // Create slides container
        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'carousel__slides';

        // Create slides
        mediaUrls.forEach((media, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel__slide ${index === 0 ? 'active' : ''}`;

            const img = document.createElement('img');
            img.src = media.url;
            img.alt = media.alt;
            img.className = 'project__img';
            img.loading = 'lazy';

            img.addEventListener('error', () => {
                console.warn(`Failed to load carousel image for project ${projectId}:`, media.url);
                slide.style.display = 'none';
            });

            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });

            slide.appendChild(img);
            slidesContainer.appendChild(slide);
        });

        carousel.appendChild(slidesContainer);

        // Create navigation dots
        if (mediaUrls.length > 1) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'carousel__dots';

            mediaUrls.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = `carousel__dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

                dot.addEventListener('click', () => {
                    this.showCarouselSlide(carousel, index);
                });

                dotsContainer.appendChild(dot);
            });

            carousel.appendChild(dotsContainer);

            // Auto-advance carousel
            this.startCarouselAutoplay(carousel, mediaUrls.length);
        }

        // Add overlay for project achievements
        const overlay = document.createElement('div');
        overlay.className = 'project__img-overlay';
        carousel.appendChild(overlay);

        container.appendChild(carousel);
    }

    /**
     * Show specific carousel slide
     * @param {Element} carousel - Carousel element
     * @param {number} index - Slide index
     */
    showCarouselSlide(carousel, index) {
        const slides = carousel.querySelectorAll('.carousel__slide');
        const dots = carousel.querySelectorAll('.carousel__dot');

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    /**
     * Start carousel autoplay
     * @param {Element} carousel - Carousel element
     * @param {number} slideCount - Number of slides
     */
    startCarouselAutoplay(carousel, slideCount) {
        let currentSlide = 0;

        const interval = setInterval(() => {
            // Pause autoplay if user is hovering
            if (carousel.matches(':hover')) return;

            currentSlide = (currentSlide + 1) % slideCount;
            this.showCarouselSlide(carousel, currentSlide);
        }, 4000); // Change slide every 4 seconds

        // Store interval ID for cleanup
        carousel.dataset.autoplayInterval = interval;

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(interval);
        });

        carousel.addEventListener('mouseleave', () => {
            // Restart autoplay
            this.startCarouselAutoplay(carousel, slideCount);
        });
    }

    /**
     * Preload all project media in background
     */
    async preloadAllProjectMedia() {
        console.log('🖼️ Starting background media preloading...');

        // Get all projects
        const projects = portfolioApp?.projects || window.PROJECTS_DATA || [];

        console.log(`📊 Found ${projects.length} projects to process`);

        if (projects.length === 0) {
            console.warn('⚠️ No projects found! Check if PROJECTS_DATA is loaded.');
            return;
        }

        for (const project of projects) {
            console.log(`🔄 Processing project: ${project.title} (GitHub: ${project.links?.github || 'none'}, Local: ${project.image ? 'image' : 'none'}/${project.readme ? 'readme' : 'none'})`);

            try {
                // Skip if already cached
                if (this.mediaCache.has(project.id)) continue;

                let content = '';
                let mediaUrls = [];

                // Try GitHub first if available
                if (project.links?.github) {
                    if (this.cache.has(project.id)) {
                        content = this.cache.get(project.id);
                    } else {
                        content = await this.fetchGitHubReadme(project.links.github);
                        if (content) {
                            this.cache.set(project.id, content);
                        }
                    }

                    if (content) {
                        // Extract media URLs from GitHub README
                        mediaUrls = this.extractMediaFromReadme(content);
                        console.log(`🔍 Extracted ${mediaUrls.length} GitHub media items for ${project.title}:`, mediaUrls);
                    }
                }

                // Fallback to local image and readme if no GitHub media found
                if (mediaUrls.length === 0) {
                    // Try local readme first
                    if (project.readme) {
                        try {
                            console.log(`📖 Trying to load local README for ${project.title} from: ${project.readme}`);
                            const localContent = await this.fetchCustomReadme(project.id, project.readme);
                            if (localContent) {
                                const localMediaUrls = this.extractMediaFromReadme(localContent);
                                if (localMediaUrls.length > 0) {
                                    mediaUrls = localMediaUrls;
                                    console.log(`📁 Extracted ${mediaUrls.length} local README media items for ${project.title}:`, mediaUrls);
                                }
                            } else {
                                console.warn(`📖 No content found in local README for ${project.title} at ${project.readme}`);
                            }
                        } catch (error) {
                            console.warn(`Failed to load local README for ${project.title}:`, error);
                        }
                    }

                    // If still no media and has local image, use that
                    if (mediaUrls.length === 0 && project.image) {
                        mediaUrls = [{
                            url: project.image,
                            alt: `${project.title} screenshot`,
                            type: project.image.toLowerCase().includes('.gif') ? 'gif' : 'image'
                        }];
                        console.log(`🖼️ Using local image for ${project.title}: ${project.image}`);
                    }
                }

                if (mediaUrls.length > 0) {
                    // Cache media
                    this.mediaCache.set(project.id, mediaUrls);

                    // Update project card
                    this.updateProjectCardMedia(project.id, mediaUrls);

                    console.log(`📸 Updated ${project.title} with ${mediaUrls.length} media items`);
                } else {
                    console.log(`ℹ️ No media found for ${project.title}`);
                }

                // Small delay to avoid overwhelming the browser
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.warn(`Failed to preload media for ${project.title}:`, error);
            }
        }

        console.log('✅ Background media preloading completed');
    }

    /**
     * Mark content as ready with visual indicator
     * @param {string} projectId - Project ID
     */
    markContentAsReady(projectId) {
        const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
        if (projectCard) {
            const learnMoreBtn = projectCard.querySelector('.project__link[data-action="learn-more"]');
            if (learnMoreBtn && !learnMoreBtn.classList.contains('content-ready')) {
                learnMoreBtn.classList.add('content-ready');

                // Add a subtle indicator
                const icon = learnMoreBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-info-circle');
                    icon.classList.add('fa-check-circle');
                }
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.projectModal = new ProjectModal();

    // Start background media preloading after a short delay
    setTimeout(() => {
        console.log('🕐 Starting media preload timer...');
        console.log('📱 portfolioApp available:', !!window.portfolioApp);
        console.log('📊 PROJECTS_DATA available:', !!window.PROJECTS_DATA);
        window.projectModal.preloadAllProjectMedia();
    }, 3000); // Wait 3 seconds to ensure portfolioApp is initialized
});

// Export for external use
window.ProjectModal = ProjectModal;