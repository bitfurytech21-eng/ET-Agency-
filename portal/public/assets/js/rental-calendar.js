// Rental Date Calculator & Interactive Pricing
document.addEventListener('DOMContentLoaded', () => {
    const pickupInput = document.getElementById('pickup_date');
    const returnInput = document.getElementById('return_date');
    const daysCountEl = document.getElementById('calc-days');
    const subtotalEl = document.getElementById('calc-subtotal');
    const totalEl = document.getElementById('calc-total');

    if (pickupInput && returnInput && daysCountEl) {
        const dailyRate = parseFloat(pickupInput.dataset.dailyRate || '195');

        function updatePricing() {
            const pDate = new Date(pickupInput.value);
            const rDate = new Date(returnInput.value);
            
            if (rDate <= pDate) {
                const nextDay = new Date(pDate);
                nextDay.setDate(nextDay.getDate() + 1);
                returnInput.value = nextDay.toISOString().split('T')[0];
            }

            const diffTime = Math.abs(new Date(returnInput.value) - new Date(pickupInput.value));
            const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

            const subtotal = dailyRate * diffDays;
            const tax = subtotal * 0.12;
            const total = subtotal + tax;

            daysCountEl.textContent = diffDays + (diffDays === 1 ? ' Day' : ' Days');
            if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
            if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
        }

        pickupInput.addEventListener('change', updatePricing);
        returnInput.addEventListener('change', updatePricing);
        updatePricing();
    }
});
