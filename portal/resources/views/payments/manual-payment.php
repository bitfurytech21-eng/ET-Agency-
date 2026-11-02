<?php require __DIR__ . '/../layouts/dashboard.php'; ?>

<!-- Step Progress Indicator -->
<div style="display: flex; justify-content: space-between; align-items: center; max-width: 800px; margin: 0 auto 2rem; position: relative;">
    <div style="text-align: center; flex: 1; position: relative; z-index: 2;">
        <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent-blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; margin: 0 auto 0.35rem;">1</div>
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-blue);">Bank Details</span>
    </div>
    <div style="text-align: center; flex: 1; position: relative; z-index: 2;">
        <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent-blue); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; margin: 0 auto 0.35rem;">2</div>
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-blue);">Execute Wire</span>
    </div>
    <div style="text-align: center; flex: 1; position: relative; z-index: 2;">
        <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent-teal); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; margin: 0 auto 0.35rem; box-shadow: 0 0 0 4px var(--accent-teal-light);">3</div>
        <span style="font-size: 0.8rem; font-weight: 800; color: var(--accent-teal-dark);">Submit Notice</span>
    </div>
    <div style="text-align: center; flex: 1; position: relative; z-index: 2;">
        <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--bg-surface-elevated); color: var(--color-slate-muted); display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 0.35rem; border: 1px solid var(--color-slate-border);">4</div>
        <span style="font-size: 0.8rem; color: var(--color-slate-muted);">Admin Verify</span>
    </div>
</div>

<div class="portal-card" style="max-width: 720px; margin: 0 auto;">
    <!-- Bank Information Card -->
    <div style="background: var(--accent-blue-light); border: 1px solid var(--accent-blue-border); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--accent-blue-hover);">WIRE / ACH TRANSFER DESTINATION</h4>
                <p style="font-size: 0.85rem; color: var(--color-navy); margin-top: 0.25rem;">El Dorado Hills, CA Commercial Treasury • Routing: <strong>121000358</strong></p>
            </div>
            <button class="portal-btn portal-btn-sm portal-btn-outline" data-copy="7890123456">Copy Account #</button>
        </div>
    </div>

    <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-navy-dark); margin-bottom: 0.35rem;">Submit Bank Wire / ACH Notice</h2>
    <p style="font-size: 0.875rem; color: var(--color-slate-muted); margin-bottom: 1.75rem;">
        Notify our accounting verification team immediately after initiating your bank transfer to match your payment record with your corporate units or reservation.
    </p>

    <form id="wireNoticeForm">
        <div class="form-grid-2">
            <div class="form-group">
                <label>Transfer Amount (USD) <span class="required">*</span></label>
                <div class="input-group">
                    <span class="input-icon">$</span>
                    <input type="number" step="0.01" name="amount" class="form-control" required placeholder="2500.00" value="2500.00">
                </div>
            </div>
            <div class="form-group">
                <label>Transfer Date <span class="required">*</span></label>
                <input type="date" name="transfer_date" class="form-control" value="<?= date('Y-m-d') ?>" required>
            </div>
        </div>

        <div class="form-grid-2">
            <div class="form-group">
                <label>Sender / Account Name <span class="required">*</span></label>
                <input type="text" name="sender_name" class="form-control" value="<?= htmlspecialchars($user['company'] ?? $user['name'] ?? '') ?>" required placeholder="e.g. UC Davis Health Corp">
            </div>
            <div class="form-group">
                <label>Originating Bank Name <span class="required">*</span></label>
                <input type="text" name="sender_bank" class="form-control" required placeholder="e.g. Wells Fargo / Chase">
            </div>
        </div>

        <div class="form-group">
            <label>Wire Reference / IMAD / OMAD #</label>
            <input type="text" name="transaction_number" class="form-control" placeholder="e.g. W-20261031-99824" style="font-family: var(--font-mono);">
        </div>

        <!-- Receipt Dropzone -->
        <div class="form-group">
            <label>Upload Receipt / Bank Confirmation Image</label>
            <div class="file-dropzone" id="receiptDropzone">
                <div class="file-dropzone-icon">📄</div>
                <div class="file-dropzone-title">Click or drag receipt photo / PDF here</div>
                <div class="file-dropzone-sub">Supported formats: JPG, PNG, WEBP (Max 10MB)</div>
                <input type="file" name="receipt" id="receiptFileInput" style="display: none;" accept="image/*,.pdf">
                <img id="receiptPreviewImg" class="file-preview" style="display: none; margin: 1rem auto 0;" alt="Receipt Preview">
            </div>
        </div>

        <div class="form-group">
            <label>Notes / Unit Reference</label>
            <textarea name="notes" class="form-control" placeholder="e.g. Transfer for 25 Corporate Units package or Booking BK-101"></textarea>
        </div>

        <button type="submit" class="portal-btn portal-btn-lg portal-btn-dark" style="width: 100%; margin-top: 1rem;">
            Submit Wire Transfer Notice for Verification →
        </button>
    </form>
</div>

<script src="/portal/assets/js/main.js"></script>
<script>
document.getElementById('wireNoticeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = 'Submitting Notice...';

    const formData = new FormData(e.target);
    try {
        const res = await fetch('/portal/payments/manual', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
            showToast('Wire transfer notice submitted! Verification queue pending.', 'success');
            setTimeout(() => window.location.href = '/portal/dashboard', 1500);
        } else {
            showToast(data.message || 'Submission failed', 'danger');
            btn.disabled = false;
            btn.innerText = 'Submit Wire Transfer Notice for Verification →';
        }
    } catch(err) {
        showToast('Error: ' + err.message, 'danger');
        btn.disabled = false;
        btn.innerText = 'Submit Wire Transfer Notice for Verification →';
    }
});
</script>

</main>
<footer class="portal-footer">
    <div class="portal-footer-bottom" style="max-width: 1360px; margin: 0 auto; text-align: center;">
        &copy; <?= date('Y') ?> Easy Travel Lodging Accounting.
    </div>
</footer>
</body>
</html>
