<?php require __DIR__ . '/../layouts/main.php'; ?>
<div class="portal-card">
    <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Available Mid-Term Lodging Units</h1>
    <div class="grid-2">
        <?php foreach (($units ?? []) as $u): ?>
        <div style="border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: 8px;">
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #00b7a8;"><?= htmlspecialchars($u['title']) ?></h3>
            <p style="font-size: 0.85rem; color: #64748b; margin: 0.25rem 0 0.75rem 0;"><?= htmlspecialchars($u['category']) ?> • <?= (int)$u['beds'] ?> Bed / <?= (int)$u['baths'] ?> Bath</p>
            <div style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">
                $<?= number_format((float)$u['monthly_rate'], 2) ?> <span style="font-size: 0.85rem; font-weight: 400; color: #64748b;">/ mo</span>
            </div>
            <a href="/portal/units/purchase" class="portal-btn portal-btn-sm">Purchase Units for this Suite</a>
        </div>
        <?php endforeach; ?>
    </div>
</div>
</body></html>
