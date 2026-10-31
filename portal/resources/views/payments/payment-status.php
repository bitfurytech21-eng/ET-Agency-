<?php require __DIR__ . '/../layouts/dashboard.php'; ?>
<div class="portal-card" style="max-width: 600px; margin: 0 auto;">
    <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 1rem;">Payment Verification Status</h2>
    <div style="font-size: 0.95rem; line-height: 1.8;">
        <p><strong>Reference:</strong> <?= htmlspecialchars($payment['reference_code'] ?? '') ?></p>
        <p><strong>Amount:</strong> $<?= number_format((float)($payment['amount'] ?? 0), 2) ?></p>
        <p><strong>Sender Bank:</strong> <?= htmlspecialchars($payment['sender_bank'] ?? 'N/A') ?></p>
        <p><strong>Status:</strong> <span class="badge badge-warning"><?= htmlspecialchars($payment['status'] ?? 'pending_verification') ?></span></p>
    </div>
</div>
</body></html>
