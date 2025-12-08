class NewsSlider {
    constructor(containerId, options = {}) {
        this.options = {
            loop: true,
            navs: true,
            pages: true,
            auto: true,
            stopMouseHover: true,
            delay: 5, // in seconds
            ...options
        };

        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Slider container with id "${containerId}" not found`);
            return;
        }

        // Initialize slider
        this.currentSlide = 0;
        this.slides = this.container.querySelectorAll('.slider-slide');
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;

        if (this.totalSlides === 0) return;

        // Initialize UI
        this.init();
    }

    init() {
        const wrapper = document.createElement('div');
        wrapper.className = 'slider-wrapper';
        
        // Get all direct child nodes (our slides)
        const slides = Array.from(this.container.childNodes).filter(node => node.nodeType === 1);
        
        // Move slides into wrapper
        slides.forEach(slide => {
            wrapper.appendChild(slide);
        });
        
        // Clear container and add wrapper
        this.container.innerHTML = '';
        this.container.appendChild(wrapper);
        
        // Update slides reference
        this.slides = this.container.querySelectorAll('.slider-slide');
        this.totalSlides = this.slides.length;

        // Create navigation if enabled
        if (this.options.navs) {
            this.createNavigation();
        }

        // Create pagination if enabled
        if (this.options.pages) {
            this.createPagination();
        }

        // Create counter
        this.createCounter();

        // Set up event listeners
        this.setupEventListeners();

        // Initialize hover handlers (will be set up if needed)
        this._hoverEnterHandler = null;
        this._hoverLeaveHandler = null;

        // Bind hover pause immediately if requested
        if (this.options.stopMouseHover && this.options.auto) {
            this._hoverEnterHandler = () => this.stopAutoPlay();
            this._hoverLeaveHandler = () => this.startAutoPlay();
            this.container.addEventListener('mouseenter', this._hoverEnterHandler);
            this.container.addEventListener('mouseleave', this._hoverLeaveHandler);
        }

        // Show first slide
        this.showSlide(0);

        // Start autoplay if enabled
        if (this.options.auto) {
            this.startAutoPlay();
        }
    }

    createNavigation() {
        // Create navigation container
        // remove existing nav if present
        const existingNav = this.container.querySelector('.slider-nav');
        if (existingNav) existingNav.remove();

        const navContainer = document.createElement('div');
        navContainer.className = 'slider-nav';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-nav-btn prev';
        prevBtn.innerHTML = '❮';
        prevBtn.addEventListener('click', () => this.prevSlide());

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-nav-btn next';
        nextBtn.innerHTML = '❯';
        nextBtn.addEventListener('click', () => this.nextSlide());

        // Add buttons to container
        navContainer.appendChild(prevBtn);
        navContainer.appendChild(nextBtn);

        // Add navigation to slider
        this.container.appendChild(navContainer);
    }

    createPagination() {
        // remove existing pagination if present
        const existing = this.container.querySelector('.slider-pagination');
        if (existing) existing.remove();

        // Create pagination container
        const pagination = document.createElement('div');
        pagination.className = 'slider-pagination';

        // Create pagination items
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-pagination-dot';
            dot.setAttribute('data-slide', i);
            dot.addEventListener('click', () => this.goToSlide(i));
            pagination.appendChild(dot);
        }

        // Add pagination to slider
        this.container.appendChild(pagination);
    }

    createCounter() {
        // remove existing counter if present
        const existing = this.container.querySelector('.slider-counter');
        if (existing) existing.remove();

        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'slider-counter';
        counter.textContent = `1 / ${this.totalSlides}`;
        this.counterElement = counter;

        // Add counter to slider
        this.container.appendChild(counter);
    }

    setupEventListeners() {
        // Pause on hover if stopMouseHover is enabled
        // Hover pause behavior will be bound/unbound by updateOptions depending on state

        // Update counter on slide change — keep listener for compatibility
        this.container.addEventListener('slideChange', () => {
            if (this.counterElement) {
                this.counterElement.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
            }

            // Update active pagination dot
            const dots = this.container.querySelectorAll('.slider-pagination-dot');
            dots.forEach((dot, index) => {
                if (index === this.currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
    }

    showSlide(index) {
        if (this.totalSlides === 0) return;
        
        // Handle loop if enabled
        if (this.options.loop) {
            if (index >= this.totalSlides) {
                index = 0;
            } else if (index < 0) {
                index = this.totalSlides - 1;
            }
        } else {
            // Clamp index to valid range
            index = Math.max(0, Math.min(index, this.totalSlides - 1));
        }

        // Update current slide
        this.currentSlide = index;
        const wrapper = this.container.querySelector('.slider-wrapper');
        const offset = -this.currentSlide * 100;
        wrapper.style.transform = `translateX(${offset}%)`;

        // Update slide visibility
        this.slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i !== this.currentSlide);
        });

        // Update active state for pagination
        if (this.options.pages) {
            const dots = this.container.querySelectorAll('.slider-pagination-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentSlide);
            });
        }

        // Update counter
        if (this.counterElement) {
            this.counterElement.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
        }

        // notify listeners (compat)
        try{
            this.container.dispatchEvent(new CustomEvent('slideChange'));
        }catch(e){}
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    startAutoPlay() {
        if (!this.options.auto) return;
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), this.options.delay * 1000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    destroy() {
        this.stopAutoPlay();
        // Remove all event listeners and clean up
        this.container.innerHTML = '';
    }

    // Update slider options at runtime
    updateOptions(newOptions = {}){
        // Merge options
        this.options = { ...this.options, ...newOptions };

        // NAVS: create or remove
        const existingNav = this.container.querySelector('.slider-nav');
        if (this.options.navs){
            if (!existingNav) this.createNavigation();
        } else {
            if (existingNav) existingNav.remove();
        }

        // PAGES: create or remove pagination
        const existingPag = this.container.querySelector('.slider-pagination');
        if (this.options.pages){
            if (!existingPag) {
                this.createPagination();
            } else {
                // Refresh pagination to match current slide count
                this.createPagination();
            }
        } else {
            if (existingPag) existingPag.remove();
        }

        // Counter: ensure exists and update reference
        const existingCounter = this.container.querySelector('.slider-counter');
        if (!existingCounter) {
            this.createCounter();
        } else {
            this.counterElement = existingCounter;
        }

        // Autoplay handling
        if (this.options.auto){
            this.startAutoPlay();
        } else {
            this.stopAutoPlay();
        }

        // Hover pause behavior - remove old listeners and add new ones
        // Always remove existing handlers first
        if (this._hoverEnterHandler && this._hoverLeaveHandler) {
            this.container.removeEventListener('mouseenter', this._hoverEnterHandler);
            this.container.removeEventListener('mouseleave', this._hoverLeaveHandler);
            this._hoverEnterHandler = null;
            this._hoverLeaveHandler = null;
        }
        
        // Only add hover handlers if BOTH stopMouseHover AND auto are enabled
        if (this.options.stopMouseHover && this.options.auto){
            this._hoverEnterHandler = () => this.stopAutoPlay();
            this._hoverLeaveHandler = () => this.startAutoPlay();
            this.container.addEventListener('mouseenter', this._hoverEnterHandler);
            this.container.addEventListener('mouseleave', this._hoverLeaveHandler);
        }

        // Update visuals
        this.showSlide(this.currentSlide);
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.getElementById('news-slider');
    if (sliderContainer) {
        // expose instance so page scripts can update options
        window.newsSlider = new NewsSlider('news-slider', {
            loop: true,
            navs: true,
            pages: true,
            auto: true,
            stopMouseHover: true,
            delay: 5
        });
    }
});
