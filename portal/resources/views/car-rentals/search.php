<?php
$pageTitle = "Search Vehicle Fleet | Bill & Marlena";
require_once __DIR__ . '/../layouts/main.php';
?>

<link rel="stylesheet" href="/assets/css/car-rental.css">
<script src="/assets/js/vehicle-viewer.js" defer></script>

<div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="fw-bold text-navy mb-1">Search & Filter Fleet</h2>
            <p class="text-muted mb-0">Filter by powertrain, daily rate, seating capacity and vehicle category.</p>
        </div>
        <a href="/portal/car-rentals" class="btn btn-outline-navy"><i class="bi bi-arrow-left me-2"></i> All Vehicles</a>
    </div>

    <!-- Filter Form Bar -->
    <div class="card p-3 mb-4 border-subtle shadow-sm bg-white">
        <form action="/portal/car-rentals/search" method="GET" class="row g-3">
            <div class="col-md-3">
                <label class="form-label font-mono small fw-semibold">Search Keywords</label>
                <input type="text" name="q" class="form-control" placeholder="Model, brand..." value="<?= htmlspecialchars($_GET['q'] ?? '') ?>">
            </div>
            <div class="col-md-3">
                <label class="form-label font-mono small fw-semibold">Category</label>
                <select name="category" class="form-select">
                    <option value="">All Categories</option>
                    <option value="luxury-suv" <?= ($_GET['category'] ?? '') === 'luxury-suv' ? 'selected' : '' ?>>Luxury SUV</option>
                    <option value="executive-sedan" <?= ($_GET['category'] ?? '') === 'executive-sedan' ? 'selected' : '' ?>>Executive Sedan</option>
                    <option value="electric-performance" <?= ($_GET['category'] ?? '') === 'electric-performance' ? 'selected' : '' ?>>Electric Performance</option>
                    <option value="heavy-duty-pickup" <?= ($_GET['category'] ?? '') === 'heavy-duty-pickup' ? 'selected' : '' ?>>Heavy Duty Pickup</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label font-mono small fw-semibold">Powertrain</label>
                <select name="electric" class="form-select">
                    <option value="">All Powertrains</option>
                    <option value="1" <?= ($_GET['electric'] ?? '') === '1' ? 'selected' : '' ?>>100% Electric</option>
                    <option value="0" <?= ($_GET['electric'] ?? '') === '0' ? 'selected' : '' ?>>Gasoline / Supercharged</option>
                </select>
            </div>
            <div class="col-md-3 d-flex align-items-end">
                <button type="submit" class="btn btn-primary w-100">
                    <i class="bi bi-funnel me-2"></i> Apply Filters
                </button>
            </div>
        </form>
    </div>

    <!-- Results Grid -->
    <div class="fleet-grid">
        <?php if (empty($vehicles)): ?>
            <div class="col-12 text-center py-5 bg-white border-subtle rounded-lg">
                <i class="bi bi-car-front fs-1 text-muted"></i>
                <h4 class="mt-3 text-navy">No vehicles match your filter criteria</h4>
                <p class="text-muted">Try broadening your search keywords or category filters.</p>
                <a href="/portal/car-rentals/search" class="btn btn-navy mt-2">Reset Filters</a>
            </div>
        <?php else: ?>
            <?php foreach ($vehicles as $v): ?>
                <div class="car-card">
                    <div class="car-card-header">
                        <div id="search-3d-<?= $v['id'] ?>" class="w-100 h-100" data-model="<?= htmlspecialchars($v['three_d_model_code'] ?? 'cadillac-escalade') ?>"></div>
                    </div>
                    <div class="car-card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <span class="text-muted small text-uppercase font-mono fw-semibold"><?= htmlspecialchars($v['brand']) ?></span>
                                <h4 class="car-card-title"><?= htmlspecialchars($v['name']) ?></h4>
                            </div>
                            <div class="car-price-badge">$<?= number_format($v['daily_rate'], 0) ?><small class="fs-6 text-muted">/day</small></div>
                        </div>
                        <div class="car-card-specs">
                            <span><?= $v['horsepower'] ?> HP</span>
                            <span><?= $v['seating'] ?> Seats</span>
                            <span><?= htmlspecialchars($v['powertrain']) ?></span>
                        </div>
                        <div class="mt-auto d-flex gap-2 pt-2">
                            <a href="/portal/car-rentals/vehicle/<?= $v['slug'] ?>" class="btn btn-outline-navy flex-grow-1">Details</a>
                            <a href="/portal/car-rentals/booking?vehicle=<?= $v['slug'] ?>" class="btn btn-primary">Reserve</a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    if (typeof VehicleViewer !== 'undefined') {
        <?php foreach ($vehicles as $v): ?>
            VehicleViewer.init('search-3d-<?= $v['id'] ?>', '<?= $v['three_d_model_code'] ?? 'cadillac-escalade' ?>');
        <?php endforeach; ?>
    }
});
</script>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
