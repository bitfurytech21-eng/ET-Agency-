<?php require __DIR__ . '/../layouts/dashboard.php'; ?>
<div class="portal-card" style="max-width: 600px;">
    <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 1rem;">Customer Profile</h2>
    <div style="space-y: 0.75rem; font-size: 0.9rem;">
        <p><strong>Name:</strong> <?= htmlspecialchars($user['name'] ?? '') ?></p>
        <p><strong>Email:</strong> <?= htmlspecialchars($user['email'] ?? '') ?></p>
        <p><strong>Company / Hospital:</strong> <?= htmlspecialchars($user['company'] ?? '') ?></p>
        <p><strong>Role:</strong> <?= htmlspecialchars($user['role'] ?? '') ?></p>
        <p><strong>Phone:</strong> <?= htmlspecialchars($user['phone'] ?? '') ?></p>
        <p><strong>Units Balance:</strong> <?= (int)($user['units_balance'] ?? 0) ?> Units ($<?= number_format((float)($user['balance_usd'] ?? 0), 2) ?>)</p>
    </div>
</div>
</body></html>
