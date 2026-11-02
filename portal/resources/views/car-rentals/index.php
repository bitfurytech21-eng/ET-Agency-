<?php
$pageTitle = "Executive Vehicle Rental Fleet | Bill & Marlena";
require_once __DIR__ . '/../layouts/main.php';
?>

<link rel="stylesheet" href="/assets/css/car-rental.css">
<script src="/assets/js/vehicle-viewer.js" defer></script>
<script src="/assets/js/car-rental.js" defer></script>

<div class="container my-4">
    <!-- Fleet Hero Banner -->
    <div class="fleet-hero">
        <div class="row align-items-center">
            <div class="col-lg-7">
                <span class="badge bg-primary-soft text-accent mb-2 px-3 py-2 fw-semibold text-uppercase tracking-wider">Premium American Fleet</span>
                <h1 class="display-5 fw-bold text-white mb-3">Executive Vehicle Rentals</h1>
                <p class="lead text-light opacity-90 mb-4">Experience high-performance luxury SUVs, flagship sedans, and heavy-duty utility trucks for your accommodation stays. Settle directly with your Corporate Units balance.</p>
                <div class="d-flex flex-wrap gap-3">
                    <a href="/portal/car-rentals/search" class="btn btn-primary btn-lg shadow-sm">
                        <i class="bi bi-search me-2"></i> Browse All Vehicles
                    </a>
                    <a href="/portal/car-rentals/my-rentals" class="btn btn-outline-light btn-lg">
                        <i class="bi bi-card-checklist me-2"></i> My Rental Bookings
                    </a>
                </div>
            </div>
            <div class="col-lg-5 d-none d-lg-block">
                <div class="card bg-navy-dark text-white border-subtle shadow-lg p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-success text-white">3D Interactive Inspector</span>
                        <small class="text-muted">360° Drag View</small>
                    </div>
                    <div id="hero-3d-canvas-container" style="height: 220px; border-radius: 12px; overflow: hidden;" data-model="cadillac-escalade"></div>
                    <div class="text-center mt-2 fw-bold text-accent">Cadillac Escalade ESV V-Series</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Category Filter -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h3 class="fw-bold text-navy mb-0">Featured Vehicles</h3>
        <form action="/portal/car-rentals/search" method="GET" class="d-flex gap-2">
            <input type="text" name="q" class="form-control" placeholder="Search Cadillac, Tesla, Lincoln...">
            <button type="submit" class="btn btn-navy"><i class="bi bi-search"></i></button>
        </form>
    </div>

    <!-- Vehicles Fleet Grid -->
    <div class="fleet-grid">
        <?php foreach ($vehicles as $v): ?>
            <div class="car-card">
                <div class="car-card-header">
                    <div id="card-3d-<?= $v['id'] ?>" class="w-100 h-100" data-model="<?= htmlspecialchars($v['three_d_model_code'] ?? 'cadillac-escalade') ?>"></div>
                    <span class="badge bg-navy text-white position-absolute top-0 start-0 m-3 px-3 py-2 shadow-sm">
                        <?= htmlspecialchars($v['category_name'] ?? 'Luxury') ?>
                    </span>
                    <?php if ($v['is_electric']): ?>
                        <span class="badge bg-info text-dark position-absolute top-0 end-0 m-3 px-2 py-1">
                            <i class="bi bi-lightning-charge-fill me-1"></i> 100% Electric
                        </span>
                    <?php endif; ?>
                </div>

                <div class="car-card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <span class="text-muted small text-uppercase font-mono fw-semibold"><?= htmlspecialchars($v['brand']) ?></span>
                            <h4 class="car-card-title"><?= htmlspecialchars($v['name']) ?></h4>
                        </div>
                        <div class="car-price-badge">
                            $<?= number_format($v['daily_rate'], 0) ?><small class="fs-6 text-muted font-sans">/day</small>
                        </div>
                    </div>

                    <div class="car-card-specs">
                        <span><i class="bi bi-speedometer2 me-1 text-accent"></i> <?= $v['horsepower'] ?> HP</span>
                        <span><i class="bi bi-people me-1 text-accent"></i> <?= $v['seating'] ?> Seats</span>
                        <span><i class="bi bi-fuel-pump me-1 text-accent"></i> <?= htmlspecialchars($v['powertrain']) ?></span>
                    </div>

                    <div class="mt-auto d-flex gap-2 pt-2">
                        <a href="/portal/car-rentals/vehicle/<?= $v['slug'] ?>" class="btn btn-outline-navy flex-grow-1">
                            Details & 3D View
                        </a>
                        <a href="/portal/car-rentals/booking?vehicle=<?= $v['slug'] ?>" class="btn btn-primary">
                            Reserve Now
                        </a>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    if (typeof VehicleViewer !== 'undefined') {
        VehicleViewer.init('hero-3d-canvas-container', 'cadillac-escalade');
        <?php foreach ($vehicles as $v): ?>
            VehicleViewer.init('card-3d-<?= $v['id'] ?>', '<?= $v['three_d_model_code'] ?? 'cadillac-escalade' ?>');
        <?php endforeach; ?>
    }
});
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
