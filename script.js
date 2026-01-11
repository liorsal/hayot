// Try to autoplay video immediately - run as early as possible
(function() {
    function initVideoAutoplay() {
        const videoSection = document.getElementById('section-1');
        const videoIframe = videoSection?.querySelector('iframe');
        
        if (videoIframe) {
            // Ensure autoplay is in URL
            const currentSrc = videoIframe.src;
            if (!currentSrc.includes('autoplay=true')) {
                videoIframe.src = currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'autoplay=true';
            }
            
            // Try multiple times to ensure it plays
            const tryPlay = () => {
                try {
                    // Try to trigger play via postMessage
                    videoIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                } catch (e) {
                    // Cross-origin restriction - this is expected
                }
            };
            
            // Try immediately
            tryPlay();
            
            // Try when iframe loads
            videoIframe.addEventListener('load', () => {
                tryPlay();
                // Try again after iframe fully loads
                setTimeout(tryPlay, 100);
                setTimeout(tryPlay, 500);
            });
            
            // Try multiple times with delays
            setTimeout(tryPlay, 100);
            setTimeout(tryPlay, 300);
            setTimeout(tryPlay, 500);
            setTimeout(tryPlay, 1000);
        }
    }
    
    // Try immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoAutoplay);
    } else {
        initVideoAutoplay();
    }
    
    // Also try on window load
    window.addEventListener('load', initVideoAutoplay);
})();

document.addEventListener('DOMContentLoaded', () => {
    
    // Smooth scroll to sections
    const sections = document.querySelectorAll('.fullpage-section');
    const navDots = document.querySelectorAll('.nav-dot');
    const scrollIndicators = document.querySelectorAll('.scroll-indicator');
    
    // Update active nav dot based on scroll position
    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navDots.forEach(dot => dot.classList.remove('active'));
                if (navDots[index]) {
                    navDots[index].classList.add('active');
                }
            }
        });
    };
    
    // Scroll to section when clicking nav dot
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = sections[index];
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Scroll to next section when clicking scroll indicator
    scrollIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index < sections.length - 1) {
                sections[index + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Update nav on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 100);
    });
    
    // Initial update
    updateActiveNav();
    
    // Keyboard navigation (arrow keys)
    let isScrolling = false;
    window.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        
        const currentIndex = Array.from(sections).findIndex(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= 0 && rect.top < window.innerHeight / 2;
        });
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentIndex < sections.length - 1) {
                isScrolling = true;
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => { isScrolling = false; }, 1000);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                isScrolling = true;
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => { isScrolling = false; }, 1000);
            }
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold && !isScrolling) {
            const currentIndex = Array.from(sections).findIndex(section => {
                const rect = section.getBoundingClientRect();
                return rect.top >= 0 && rect.top < window.innerHeight / 2;
            });
            
            if (diff > 0 && currentIndex < sections.length - 1) {
                // Swipe up - next section
                isScrolling = true;
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => { isScrolling = false; }, 1000);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe down - previous section
                isScrolling = true;
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => { isScrolling = false; }, 1000);
            }
        }
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in animation
    sections.forEach((section, index) => {
        if (index > 0) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        }
    });
    
    // Prevent scroll on first load if needed
    window.scrollTo(0, 0);
});
