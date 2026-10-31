<?php require __DIR__ . '/../layouts/main.php'; ?>

<!-- Page Title Banner -->
<div class="welcome-banner" style="background: linear-gradient(135deg, #0b192c 0%, #1c2541 100%); margin-bottom: 2rem;">
    <div class="welcome-content">
        <h1>American Luxury &amp; Executive Vehicle Fleet</h1>
        <p>Premium US vehicles paired with Sacramento extended stays. Featuring real-time interactive 3D animated viewing, instant reservation, and flexible corporate unit billing.</p>
    </div>
    <div>
        <span class="grant-badge" style="background: rgba(2, 132, 199, 0.2); color: #38bdf8; border-color: #0284c7;">
            ⚡ 3D ANIMATED FLEET VIEWER ACTIVE
        </span>
    </div>
</div>

<!-- 3D Fleet Viewer Container -->
<div class="portal-card" style="padding: 1.5rem; margin-bottom: 2.5rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--color-navy-dark);">3D Interactive Vehicle Inspector</h3>
            <p style="font-size: 0.85rem; color: var(--color-slate-muted);">Click and drag to rotate vehicle in 360° space</p>
        </div>
        <div class="canvas-3d-controls">
            <button class="canvas-btn active" onclick="switch3DVehicle('cadillac-escalade', this)">Cadillac Escalade</button>
            <button class="canvas-btn" onclick="switch3DVehicle('tesla-model-s', this)">Tesla Model S</button>
            <button class="canvas-btn" onclick="switch3DVehicle('lincoln-navigator', this)">Lincoln Navigator</button>
            <button class="canvas-btn" onclick="switch3DVehicle('ford-f150-lightning', this)">Ford F-150</button>
            <button class="canvas-btn" onclick="switch3DVehicle('chevrolet-tahoe', this)">Chevy Tahoe</button>
        </div>
    </div>

    <div class="canvas-3d-wrapper" id="fleetViewer3D">
        <div class="canvas-3d-overlay">
            <span class="badge badge-info" id="activeVehicleBadge">2026 CADILLAC ESCALADE ESV</span>
            <span style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">360° ROTATING MODEL</span>
        </div>
    </div>
</div>

<!-- Vehicle Fleet Cards Grid -->
<h3 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 1.25rem;">Available Fleet Inventory</h3>
<div class="vehicle-grid">
    <?php foreach (($vehicles ?? []) as $v): ?>
    <div class="vehicle-card">
        <div class="vehicle-card-body">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <div>
                    <span class="vehicle-category"><?= htmlspecialchars($v['category']) ?></span>
                    <h3 class="vehicle-title"><?= htmlspecialchars($v['name']) ?></h3>
                </div>
                <div style="text-align: right;">
                    <div class="vehicle-price">$<?= number_format((float)$v['daily_rate'], 0) ?> <span>/ day</span></div>
                    <div style="font-size: 0.775rem; color: var(--accent-teal); font-weight: 700;">$<?= number_format((float)$v['monthly_rate'], 0) ?> / mo</div>
                </div>
            </div>

            <div class="vehicle-specs">
                <div>⚡ <strong><?= htmlspecialchars($v['powertrain']) ?></strong></div>
                <div>🏇 <strong><?= (int)$v['horsepower'] ?> HP</strong></div>
                <div>👥 <strong><?= (int)$v['seating'] ?> Seats</strong></div>
            </div>

            <p style="font-size: 0.85rem; color: var(--color-slate-muted); margin-bottom: 1.25rem;">
                <?= htmlspecialchars($v['description'] ?? 'Premium corporate fleet vehicle available for daily, weekly, or monthly extended stay rentals.') ?>
            </p>

            <div class="vehicle-actions">
                <a href="/portal/vehicles/<?= htmlspecialchars($v['slug']) ?>" class="portal-btn portal-btn-sm portal-btn-outline" style="flex: 1;">
                    3D Inspector &amp; Specs
                </a>
                <a href="/portal/vehicles/<?= htmlspecialchars($v['slug']) ?>/book" class="portal-btn portal-btn-sm portal-btn-dark" style="flex: 1;">
                    Reserve Vehicle
                </a>
            </div>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<script src="/portal/assets/js/vehicle-viewer.js"></script>
<script>
let currentViewer = null;
document.addEventListener('DOMContentLoaded', () => {
    currentViewer = initVehicleViewer('fleetViewer3D', 'cadillac-escalade');
});

function switch3DVehicle(slug, btn) {
    document.querySelectorAll('.canvas-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('activeVehicleBadge').innerText = slug.replace('-', ' ').toUpperCase();
    
    const container = document.getElementById('fleetViewer3D');
    container.innerHTML = `
        <div class="canvas-3d-overlay">
            <span class="badge badge-info" id="activeVehicleBadge">${slug.replace('-', ' ').toUpperCase()}</span>
            <span style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">360° ROTATING MODEL</span>
        </div>
    `;
    currentViewer = initVehicleViewer('fleetViewer3D', slug);
}
</script>

</main>
<footer class="portal-footer">
    <div class="portal-footer-bottom" style="max-width: 1360px; margin: 0 auto; text-align: center;">
        &copy; <?= date('Y') ?> Easy Travel Lodging Vehicle Fleet. All rights reserved.
    </div>
</footer>
</body>
</html>
