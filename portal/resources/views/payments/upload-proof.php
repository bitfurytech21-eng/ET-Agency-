<?php require __DIR__ . '/../layouts/dashboard.php'; ?>
<div class="portal-card" style="max-width: 500px; margin: 0 auto;">
    <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem;">Upload Wire Transfer Receipt / PDF</h2>
    <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">Upload your bank transfer confirmation document.</p>
    <div class="form-group">
        <label>Receipt Document (PDF, PNG, JPG)</label>
        <input type="file" class="form-control">
    </div>
    <button class="portal-btn" onclick="alert('Receipt uploaded successfully. Accounting will match with bank records.');">Upload Receipt</button>
</div>
</body></html>
