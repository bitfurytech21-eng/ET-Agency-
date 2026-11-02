// Rental Booking Confirmation Handler
document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('rental-checkout-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Confirming Reservation...';
            }
        });
    }
});
