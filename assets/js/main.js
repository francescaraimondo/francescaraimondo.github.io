document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Partner Carousel
    class PartnerCarousel {
        constructor() {
            this.currentSlide = 0;
            this.container = document.querySelector('.partner-carousel-container');
            this.dotsContainer = document.querySelector('.carousel-dots');
            this.isMobile = window.innerWidth <= 768;
            this.partners = [
                'assets/images/partners/logo1.webp',
                'assets/images/partners/logo2.webp',
                'assets/images/partners/logo3.webp',
                'assets/images/partners/logo4.webp',
                'assets/images/partners/logo7.webp',
                'assets/images/partners/logo5.webp',
                'assets/images/partners/logo6.webp',
                'assets/images/partners/logo8.webp',
                'assets/images/partners/logo9.webp',
                'assets/images/partners/logo10.webp',
                'assets/images/partners/logo11.webp',
                'assets/images/partners/logo12.webp',
                'assets/images/partners/logo14.webp',
                'assets/images/partners/logo13.webp',
                'assets/images/partners/logo15.webp',
            ];
            
            this.init();
            
            // Handle resize
            window.addEventListener('resize', () => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 768;
                if (wasMobile !== this.isMobile) {
                    this.currentSlide = 0;
                    this.updateCarousel();
                }
            });
        }

        init() {
            // Create slides
            this.partners.forEach((partner, index) => {
                const slide = document.createElement('div');
                slide.className = 'partner-slide';
                slide.innerHTML = `<img src="${partner}" alt="Partner ${index + 1}">`;
                this.container.appendChild(slide);
            });

            // Create dots
            this.partners.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });

            // Add event listeners
            document.querySelector('.carousel-button.prev').addEventListener('click', () => {
                this.prevSlide();
            });
            document.querySelector('.carousel-button.next').addEventListener('click', () => {
                this.nextSlide();
            });

            // Initialize state
            this.updateCarousel();
        }

        updateCarousel() {
            const slideWidth = this.isMobile ? 129 : (100 / 3); 
            const offset = -this.currentSlide * slideWidth;
            this.container.style.transform = `translateX(${offset}%)`;

            // Update dots
            const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });

            // Update buttons
            this.updateArrowButtons();
        }

        nextSlide() {
            const maxSlide = this.isMobile ? 
                this.partners.length - 1 : 
                this.partners.length - 1;
                
            if (this.currentSlide < maxSlide) {
                this.currentSlide++;
                this.updateCarousel();
            }
        }

        prevSlide() {
            if (this.currentSlide > 0) {
                this.currentSlide--;
                this.updateCarousel();
            }
        }

        updateArrowButtons() {
            const prevButton = document.querySelector('.carousel-button.prev');
            const nextButton = document.querySelector('.carousel-button.next');
            const maxSlide = this.isMobile ? 
                this.partners.length - 1 : 
                this.partners.length - 1;
            
            prevButton.classList.toggle('disabled', this.currentSlide === 0);
            nextButton.classList.toggle('disabled', this.currentSlide >= maxSlide);
        }

        goToSlide(index) {
            this.currentSlide = index;
            this.updateCarousel();
        }
    }

    // Initialize carousel when DOM is loaded
    new PartnerCarousel();

    // Video player functionality
    const overlay = document.querySelector('.video-overlay');
    const iframe = overlay.querySelector('iframe');
    const closeBtn = overlay.querySelector('.close-video');

    // Function to get embed URL
    function getEmbedUrl(url) {
        if (url.includes('vimeo.com')) {
            const videoId = url.split('/').pop().split('?')[0];
            return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId = '';
            if (url.includes('youtu.be')) {
                videoId = url.split('/').pop();
            } else {
                videoId = url.split('v=')[1].split('&')[0];
            }
            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        return url;
    }

    // Handle click on videos
    document.addEventListener('click', function(e) {
        // For regular videos
        const videoThumbnail = e.target.closest('.video-thumbnail:not(.full-width .video-thumbnail)');
        const playButton = e.target.closest('.play-button');
        
        // For banner and full-width videos
        const bannerBg = e.target.closest('.hero-background');
        const fullWidthVideo = e.target.closest('.full-width .video-thumbnail');
        
        if (videoThumbnail || playButton || bannerBg || fullWidthVideo) {
            e.preventDefault();
            let link;
            if (bannerBg) {
                link = document.querySelector('#hero a');
            } else if (fullWidthVideo) {
                link = fullWidthVideo.querySelector('a');
            } else {
                link = videoThumbnail?.closest('a') || playButton?.closest('a');
            }
            
            const videoUrl = link?.href;
            if (videoUrl) {
                iframe.src = getEmbedUrl(videoUrl);
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    });

    // Close video
    closeBtn.addEventListener('click', function() {
        overlay.classList.remove('active');
        iframe.src = '';
        document.body.style.overflow = '';
    });

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeBtn.click();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeBtn.click();
        }
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', data);
            
            // Clear form
            this.reset();
            alert('Message envoyé! Nous vous contacterons bientôt.');
        });
    }
});
