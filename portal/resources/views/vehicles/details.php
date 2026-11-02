<?php require __DIR__ . '/../layouts/main.php'; ?>
<div class="portal-card">
    <a href="/portal/vehicles" style="font-size: 0.85rem; color: #00b7a8; font-weight: 600;">← Back to Vehicle Fleet</a>
    <h1 style="font-size: 1.75rem; font-weight: 900; margin-top: 0.5rem;"><?= htmlspecialchars($vehicle['name'] ?? 'Vehicle') ?></h1>
    <p style="color: #64748b;"><?= htmlspecialchars($vehicle['category'] ?? '') ?></p>

    <div style="background: #0f172a; border-radius: 12px; height: 350px; display: flex; align-items: center; justify-content: center; color: #38bdf8; margin: 1.5rem 0;">
        <div style="text-align: center;">
            <div style="font-size: 2rem;">🏎️</div>
            <div style="font-weight: bold; margin-top: 0.5rem;">Interactive 3D Turntable Active</div>
            <div style="font-size: 0.8rem; color: #94a3b8;">Use the main Fleet Rentals tab on the site to interact with the Three.js 3D viewport.</div>
        </div>
    </div>

    <div class="grid-3" style="margin-bottom: 1.5rem;">
        <div class="stat-card">
            <span class="stat-label">Daily Rate</span>
            <span class="stat-value">$<?= number_format((float)($vehicle['daily_rate'] ?? 0), 2) ?></span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Weekly Rate</span>
            <span class="stat-value">$<?= number_format((float)($vehicle['weekly_rate'] ?? 0), 2) ?></span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Monthly Rate</span>
            <span class="stat-value">$<?= number_format((float)($vehicle['monthly_rate'] ?? 0), 2) ?></span>
        </div>
    </div>

    <a href="/portal/vehicles/<?= htmlspecialchars($vehicle['slug'] ?? '') ?>/book" class="portal-btn">Proceed to Reserve Vehicle</a>
</div>
</body></html>
