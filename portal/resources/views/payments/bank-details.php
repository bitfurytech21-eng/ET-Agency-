<?php require __DIR__ . '/../layouts/main.php'; ?>
<div class="portal-card" style="max-width: 650px; margin: 0 auto;">
    <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Bank Wire &amp; Direct ACH Details</h1>
    <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">Official payment instructions for corporate wire transfers, ACH debits, and unit packages.</p>

    <?php foreach (($accounts ?? []) as $acc): ?>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: #00b7a8; margin-bottom: 0.5rem;"><?= htmlspecialchars($acc['bank_name']) ?></h3>
        <p><strong>Account Name:</strong> <?= htmlspecialchars($acc['account_name']) ?></p>
        <p><strong>Account Number:</strong> <code><?= htmlspecialchars($acc['account_number']) ?></code></p>
        <p><strong>Routing Number (ABA):</strong> <code><?= htmlspecialchars($acc['routing_number']) ?></code></p>
        <?php if (!empty($acc['swift_code'])): ?>
            <p><strong>SWIFT / BIC:</strong> <code><?= htmlspecialchars($acc['swift_code']) ?></code></p>
        <?php endif; ?>
        <?php if (!empty($acc['zelle_identifier'])): ?>
            <p><strong>Zelle:</strong> <?= htmlspecialchars($acc['zelle_identifier']) ?></p>
        <?php endif; ?>
        <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #64748b;"><?= htmlspecialchars($acc['notes'] ?? '') ?></p>
    </div>
    <?php endforeach; ?>

    <a href="/portal/payments/manual" class="portal-btn">Submit Wire Payment Notice</a>
</div>
</body></html>
