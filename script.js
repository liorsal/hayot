document.addEventListener('DOMContentLoaded', () => {
    // Video autoplay fix for mobile
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // Try to play the video
        const playPromise = heroVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Autoplay was prevented, try to play on user interaction
                console.log('Autoplay prevented, waiting for user interaction');
                
                // Try to play on first user interaction
                const playVideo = () => {
                    heroVideo.play().catch(err => console.log('Video play failed:', err));
                    document.removeEventListener('touchstart', playVideo);
                    document.removeEventListener('click', playVideo);
                };
                
                document.addEventListener('touchstart', playVideo, { once: true });
                document.addEventListener('click', playVideo, { once: true });
            });
        }
        
        // Ensure video plays when it becomes visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(err => console.log('Video play failed:', err));
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(heroVideo);
    }

    // Mobile Menu Logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = (show) => {
        if (show) {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => toggleMenu(true));
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => toggleMenu(false));
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => toggleMenu(false));
    }

    // Close menu when clicking on nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    toggleMenu(false);
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            } else {
                toggleMenu(false);
            }
        });
    });

    // Header Shadow on Scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
        }
    });

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .hero-cta-btn, .category-item');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Details buttons - scroll to contact section
    const detailsButtons = document.querySelectorAll('.btn-details');
    detailsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Carousel scroll hint - hide when scrolling
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselHint = document.querySelector('.carousel-scroll-hint');
    const carouselFade = document.querySelector('.carousel-fade-left');
    
    if (carouselWrapper && carouselHint && carouselFade) {
        const updateHintVisibility = () => {
            const scrollLeft = carouselWrapper.scrollLeft;
            const maxScroll = carouselWrapper.scrollWidth - carouselWrapper.clientWidth;
            const canScroll = maxScroll > 10; // Check if there's content to scroll
            
            if (!canScroll) {
                // No scrolling needed, hide hint and fade
                carouselHint.style.display = 'none';
                carouselFade.style.display = 'none';
                return;
            }
            
            carouselHint.style.display = 'flex';
            carouselFade.style.display = 'block';
            
            // Hide hint if scrolled significantly
            if (scrollLeft > 50) {
                carouselHint.style.opacity = '0';
            } else {
                carouselHint.style.opacity = '0.9';
            }
            
            // Update fade effect - show on right if can scroll right
            if (scrollLeft < maxScroll - 10) {
                carouselFade.style.opacity = '1';
            } else {
                carouselFade.style.opacity = '0';
            }
        };
        
        carouselWrapper.addEventListener('scroll', updateHintVisibility);
        
        // Check on resize
        window.addEventListener('resize', () => {
            setTimeout(updateHintVisibility, 100);
        });
        
        // Initial check
        setTimeout(updateHintVisibility, 100);
        
        // Hide hint after 5 seconds if not scrolled (but keep fade)
        setTimeout(() => {
            if (carouselWrapper.scrollLeft < 50 && carouselWrapper.scrollWidth > carouselWrapper.clientWidth) {
                carouselHint.style.opacity = '0.7';
            }
        }, 5000);
    }
});
