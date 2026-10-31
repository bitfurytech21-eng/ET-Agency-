// Navigation Toggle & Mobile Menu Handler
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.portal-nav-toggle');
    const navLinks = document.querySelector('.portal-nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});
