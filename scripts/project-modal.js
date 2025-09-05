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
            const projectCard = e.target.closest('.project__card');
            if (projectCard) {
                const projectId = projectCard.dataset.projectId;
                if (projectId && !this.cache.has(projectId)) {
                    // Preload content in background
                    this.preloadProjectContent(projectId);
                }
            }
        }, true); // Use capture phase for better performance
    }

    /**
     * Setup markdown renderer
     */
    setupMarkdownRenderer() {
        // Simple markdown renderer - you can replace with a more robust one like marked.js
        this.markdownRenderer = {
            render: (markdown) => {
                return markdown
                    // Headers
                    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                    .replace(/^# (.*$)/gim, '<h1>$1</h1>')

                    // Bold and italic
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')

                    // Code blocks
                    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                    .replace(/`(.*?)`/g, '<code>$1</code>')

                    // Links
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

                    // Images
                    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="readme-image">')

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
        };
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
                content = await this.fetchCustomReadme(project.id) || this.generateFallbackContent(project);
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
                content = await this.fetchCustomReadme(project.id) || this.generateFallbackContent(project);
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
     * @returns {Promise<string>} README content
     */
    async fetchCustomReadme(projectId) {
        try {
            const response = await fetch(`assets/readmes/${projectId}.md`);
            if (response.ok) {
                return await response.text();
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
                const target = contentEl.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
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
});

// Export for external use
window.ProjectModal = ProjectModal;