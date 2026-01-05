document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');

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

    // Header Shadow on Scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
        }
    });
});
