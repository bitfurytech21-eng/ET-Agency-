<?php require __DIR__ . '/../layouts/dashboard.php'; ?>
<div class="portal-card" style="max-width: 600px; margin: 0 auto;">
    <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem;">Purchase Lodging Units</h2>
    <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">1 Unit = $100.00 USD. Use units to settle 30+ day mid-term stays flexibly.</p>

    <form id="unitBuyForm">
        <div class="form-group">
            <label>Select Unit Package Tier</label>
            <select name="units" class="form-control" id="unitSelect">
                <option value="10">10 Units - $1,000.00 (Starter Stays)</option>
                <option value="25" selected>25 Units - $2,500.00 (1 Month 1-Bed Stay)</option>
                <option value="50">50 Units - $5,000.00 (2 Months Stay Credit)</option>
                <option value="100">100 Units - $10,000.00 (Corporate Enterprise Pack)</option>
            </select>
        </div>
        <div class="form-group">
            <label>Payment Method</label>
            <select name="payment_method" class="form-control">
                <option value="Corporate Wire">Bank Wire Transfer</option>
                <option value="ACH Direct">ACH Direct Debit</option>
                <option value="Corporate Invoice">Corporate Monthly Invoice</option>
            </select>
        </div>
        <button type="submit" class="portal-btn" style="width: 100%;">Authorize Unit Purchase</button>
    </form>
</div>
<script>
document.getElementById('unitBuyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch('/portal/units/purchase', { method: 'POST', body: formData });
    const data = await res.json();
    alert(data.message);
    if (data.success) window.location.href = '/portal/dashboard';
});
</script>
</body></html>
