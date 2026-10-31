<?php
$pageTitle = "My Vehicle Rentals | Bill & Marlena";
require_once __DIR__ . '/../layouts/main.php';
?>

<div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="fw-bold text-navy mb-1">My Rental Bookings</h2>
            <p class="text-muted mb-0">Manage and track your active executive vehicle dispatches.</p>
        </div>
        <a href="/portal/car-rentals" class="btn btn-primary">
            <i class="bi bi-plus-lg me-1"></i> Rent Another Vehicle
        </a>
    </div>

    <?php if (empty($rentals)): ?>
        <div class="card p-5 text-center border-subtle shadow-sm bg-white">
            <i class="bi bi-car-front fs-1 text-muted"></i>
            <h4 class="mt-3 text-navy">No active vehicle rentals</h4>
            <p class="text-muted">Explore our fleet of luxury American SUVs and executive sedans.</p>
            <div>
                <a href="/portal/car-rentals" class="btn btn-navy mt-2">Browse Vehicle Fleet</a>
            </div>
        </div>
    <?php else: ?>
        <div class="row g-4">
            <?php foreach ($rentals as $r): ?>
                <div class="col-md-6 col-lg-4">
                    <div class="card border-subtle shadow-sm bg-white h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <span class="badge bg-navy text-white font-mono"><?= htmlspecialchars($r['booking_reference']) ?></span>
                                <span class="badge bg-success-soft text-success fw-bold text-uppercase"><?= htmlspecialchars($r['booking_status']) ?></span>
                            </div>

                            <h5 class="fw-bold text-navy mb-1"><?= htmlspecialchars($r['vehicle_name']) ?></h5>
                            <span class="text-muted small"><?= htmlspecialchars($r['brand']) ?> • <?= htmlspecialchars($r['model']) ?></span>

                            <div class="p-3 bg-offwhite rounded-md my-3 border-subtle">
                                <div class="d-flex justify-content-between small text-muted mb-1">
                                    <span>Pickup Date:</span>
                                    <strong class="text-navy"><?= htmlspecialchars($r['pickup_date']) ?></strong>
                                </div>
                                <div class="d-flex justify-content-between small text-muted">
                                    <span>Return Date:</span>
                                    <strong class="text-navy"><?= htmlspecialchars($r['return_date']) ?></strong>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                                <div>
                                    <span class="text-muted small">Total Cost</span>
                                    <div class="fw-bold text-navy font-mono">$<?= number_format($r['total_amount'], 2) ?></div>
                                </div>
                                <span class="badge bg-info-soft text-navy small">Settled via Units</span>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
