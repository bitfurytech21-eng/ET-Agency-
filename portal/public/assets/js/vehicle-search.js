// Vehicle Search Auto-submit and Live Filter
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('vehicle-search-form');
    if (searchForm) {
        const inputs = searchForm.querySelectorAll('select, input[type="radio"]');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                searchForm.submit();
            });
        });
    }
});
