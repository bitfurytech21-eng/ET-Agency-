// Reservation Modal Controller
document.addEventListener('DOMContentLoaded', () => {
    const openModalBtns = document.querySelectorAll('[data-open-booking-modal]');
    const modal = document.getElementById('booking-modal');
    const closeModalBtn = document.querySelector('.modal-close-btn');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (modal) modal.style.display = 'flex';
        });
    });

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
});
