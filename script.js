document.addEventListener('DOMContentLoaded', () => {
    // Header transition logic
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');

    const updateHeader = () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateHeader);
    updateHeader();

    // Hero Parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroVideo = document.querySelector('.hero-video-bg');
        if (heroVideo) {
            heroVideo.style.transform = `translateY(${scrolled * 0.4}px)`;
        }

        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - (headerHeight - 20);

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll reveal animations
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve if you only want it to animate once
                // revealObserver.unobserve(entry.target);
            } else {
                // Remove active class when out of view for re-animation (premium feel)
                // entry.target.classList.remove('active');
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.category-card, .product-card, .section-title, .owner-container, .gallery-item, .tag, .footer-section');
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Tag and Category filtering
    const filterElements = document.querySelectorAll('[data-filter]');
    const products = document.querySelectorAll('.product-card');

    filterElements.forEach(el => {
        el.addEventListener('click', (e) => {
            const filter = el.getAttribute('data-filter');

            // Only update tags if it was a tag that was clicked
            if (el.classList.contains('tag')) {
                filterElements.forEach(t => t.classList.remove('active'));
                el.classList.add('active');
            } else {
                // If it was a category button, find the corresponding tag and activate it
                const correspondingTag = document.querySelector(`.tag[data-filter="${filter}"]`);
                if (correspondingTag) {
                    filterElements.forEach(t => t.classList.remove('active'));
                    correspondingTag.classList.add('active');
                }
            }

            // Filter products
            products.forEach(product => {
                const category = product.getAttribute('data-category');

                if (filter === 'all' || filter === category) {
                    product.style.display = 'flex';
                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    product.style.opacity = '0';
                    product.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        product.style.display = 'none';
                    }, 400);
                }
            });

            // Add a little bounce animation when clicking
            el.style.transform = 'scale(0.95)';
            setTimeout(() => el.style.transform = '', 100);
        });
    });

    // Force autoplay for hero video (fixes mobile issues)
    const heroVideo = document.querySelector('.hero-video-bg');
    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.play().catch(error => {
            console.log("Autoplay prevented, trying again on interaction");
            // If prevented, attempt to play on first user interaction
            const playOnInteraction = () => {
                heroVideo.play();
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
            };
            document.addEventListener('click', playOnInteraction);
            document.addEventListener('touchstart', playOnInteraction);
        });
    }
});
