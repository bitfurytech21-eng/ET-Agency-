// Car Rental JS Interactive Controller
document.addEventListener('DOMContentLoaded', () => {
    console.log('Car Rental Module Initialized');
    
    // Quick filter button handlers
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
});
