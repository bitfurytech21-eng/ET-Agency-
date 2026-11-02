<?php
$pageTitle = htmlspecialchars($vehicle['name']) . " | Executive Fleet";
require_once __DIR__ . '/../layouts/main.php';
?>

<link rel="stylesheet" href="/assets/css/car-rental.css">
<link rel="stylesheet" href="/assets/css/vehicle-details.css">
<script src="/assets/js/vehicle-viewer.js" defer></script>

<div class="container my-4">
    <div class="mb-3">
        <a href="/portal/car-rentals" class="text-decoration-none text-muted">
            <i class="bi bi-arrow-left me-1"></i> Back to Fleet
        </a>
    </div>

    <div class="vehicle-details-container">
        <!-- Main Column: 3D Interactive Canvas & Specs -->
        <div>
            <div class="viewer-3d-box mb-4">
                <div id="details-3d-canvas" class="w-100 h-100" data-model="<?= htmlspecialchars($vehicle['three_d_model_code'] ?? 'cadillac-escalade') ?>"></div>
                <div class="position-absolute bottom-0 start-0 m-3 bg-navy-dark text-white px-3 py-2 rounded-pill small opacity-90 shadow-sm">
                    <i class="bi bi-arrows-move me-2"></i> Drag mouse or swipe to rotate vehicle in 360°
                </div>
            </div>

            <h2 class="fw-bold text-navy mb-2"><?= htmlspecialchars($vehicle['name']) ?></h2>
            <p class="text-muted fs-5 mb-4">Premium US executive luxury vehicle configured with executive comfort, state-of-the-art safety technology and high-torque powertrain.</p>

            <h4 class="fw-bold text-navy mb-3">Vehicle Specifications</h4>
            <div class="spec-grid">
                <div class="spec-item">
                    <div class="spec-label">Horsepower</div>
                    <div class="spec-value"><?= $vehicle['horsepower'] ?> HP</div>
                </div>
                <div class="spec-item">
                    <div class="spec-label">Seating Capacity</div>
                    <div class="spec-value"><?= $vehicle['seating'] ?> Executives</div>
                </div>
                <div class="spec-item">
                    <div class="spec-label">Powertrain</div>
                    <div class="spec-value"><?= htmlspecialchars($vehicle['powertrain']) ?></div>
                </div>
                <div class="spec-item">
                    <div class="spec-label">Transmission</div>
                    <div class="spec-value"><?= htmlspecialchars($vehicle['transmission']) ?></div>
                </div>
                <div class="spec-item">
                    <div class="spec-label">Category</div>
                    <div class="spec-value"><?= htmlspecialchars($vehicle['category_name'] ?? 'Executive') ?></div>
                </div>
                <div class="spec-item">
                    <div class="spec-label">Security Deposit</div>
                    <div class="spec-value">$<?= number_format($vehicle['deposit_amount'], 2) ?></div>
                </div>
            </div>
        </div>

        <!-- Sidebar Column: Reservation Summary Card -->
        <div>
            <div class="card p-4 border-subtle shadow-md bg-white sticky-top" style="top: 100px;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-muted uppercase font-mono small">Daily Reservation Rate</span>
                    <div class="fs-2 fw-bold text-accent font-mono">$<?= number_format($vehicle['daily_rate'], 0) ?></div>
                </div>

                <ul class="list-unstyled mb-4">
                    <li class="py-2 border-bottom d-flex justify-content-between text-muted">
                        <span>Weekly Rate (Disc.)</span>
                        <strong class="text-navy">$<?= number_format($vehicle['weekly_rate'], 0) ?>/wk</strong>
                    </li>
                    <li class="py-2 border-bottom d-flex justify-content-between text-muted">
                        <span>Monthly Rate</span>
                        <strong class="text-navy">$<?= number_format($vehicle['monthly_rate'], 0) ?>/mo</strong>
                    </li>
                    <li class="py-2 border-bottom d-flex justify-content-between text-muted">
                        <span>Settlement Method</span>
                        <strong class="text-success"><i class="bi bi-wallet2 me-1"></i> Corporate Units Balance</strong>
                    </li>
                </ul>

                <a href="/portal/car-rentals/booking?vehicle=<?= $vehicle['slug'] ?>" class="btn btn-primary btn-lg w-100 shadow-sm py-3 fw-bold">
                    Reserve This Vehicle <i class="bi bi-chevron-right ms-2"></i>
                </a>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    if (typeof VehicleViewer !== 'undefined') {
        VehicleViewer.init('details-3d-canvas', '<?= $vehicle['three_d_model_code'] ?? 'cadillac-escalade' ?>');
    }
});
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
