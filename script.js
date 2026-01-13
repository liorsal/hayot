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
    
    // Update nav on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 100);
    });
    
    // Initial update
    updateActiveNav();
    
    // Disable automatic scroll jumping - let user scroll naturally
    // Remove keyboard and swipe navigation that causes jumping
    
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
    
    // Prevent scroll on first load if needed - but don't force it
    // window.scrollTo(0, 0);
    
    // Discount Popup - Show after 5 seconds
    const discountPopup = document.getElementById('discount-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    
    if (discountPopup && closePopupBtn) {
        // Check if popup was already closed in this session
        const popupClosed = sessionStorage.getItem('discountPopupClosed');
        
        if (!popupClosed) {
            // Show popup after 5 seconds
            setTimeout(() => {
                discountPopup.classList.add('show');
            }, 5000);
        }
        
        // Close popup when clicking X button
        closePopupBtn.addEventListener('click', () => {
            discountPopup.classList.remove('show');
            discountPopup.classList.add('hidden');
            sessionStorage.setItem('discountPopupClosed', 'true');
        });
        
        // Close popup when clicking outside (optional)
        discountPopup.addEventListener('click', (e) => {
            if (e.target === discountPopup) {
                discountPopup.classList.remove('show');
                discountPopup.classList.add('hidden');
                sessionStorage.setItem('discountPopupClosed', 'true');
            }
        });
    }

    // Floating Call Button Menu
    const floatingCallBtn = document.getElementById('floating-call-btn');
    const callMenu = document.getElementById('call-menu');
    
    if (floatingCallBtn && callMenu) {
        // Toggle menu on button click
        floatingCallBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            callMenu.classList.toggle('show');
            floatingCallBtn.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!floatingCallBtn.contains(e.target) && !callMenu.contains(e.target)) {
                callMenu.classList.remove('show');
                floatingCallBtn.classList.remove('active');
            }
        });
        
        // Close menu when selecting a phone number
        const callOptions = callMenu.querySelectorAll('.call-option');
        callOptions.forEach(option => {
            option.addEventListener('click', () => {
                callMenu.classList.remove('show');
                floatingCallBtn.classList.remove('active');
            });
        });
    }
});
