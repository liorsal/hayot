document.addEventListener('DOMContentLoaded', () => {
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

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('.newsletter-input').value;
            if (email) {
                alert('תודה על ההרשמה! נשלח אליך עדכונים על חדשות, טיפים ומידע מעניין על בעלי חיים.');
                newsletterForm.querySelector('.newsletter-input').value = '';
            }
        });
    }

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
});
