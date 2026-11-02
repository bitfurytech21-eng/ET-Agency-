<?php
$pageTitle = "Rental Confirmation | " . htmlspecialchars($booking['booking_reference']);
require_once __DIR__ . '/../layouts/main.php';
?>

<div class="container my-5" style="max-width: 720px;">
    <div class="card p-4 p-md-5 border-subtle shadow-lg bg-white text-center">
        <div class="mb-3">
            <span class="badge bg-success-soft text-success p-3 rounded-circle">
                <i class="bi bi-check-lg display-4"></i>
            </span>
        </div>
        <h2 class="fw-bold text-navy mb-2">Vehicle Reservation Confirmed!</h2>
        <p class="text-muted fs-5 mb-4">Your vehicle dispatch reference is <strong class="text-navy font-mono"><?= htmlspecialchars($booking['booking_reference']) ?></strong></p>

        <div class="card bg-offwhite p-4 border-subtle text-start mb-4">
            <div class="row g-3">
                <div class="col-sm-6">
                    <span class="text-muted small uppercase font-mono">Vehicle</span>
                    <h6 class="fw-bold text-navy mb-0"><?= htmlspecialchars($booking['vehicle_name']) ?></h6>
                </div>
                <div class="col-sm-6">
                    <span class="text-muted small uppercase font-mono">Customer</span>
                    <h6 class="fw-bold text-navy mb-0"><?= htmlspecialchars($booking['customer_name']) ?></h6>
                </div>
                <div class="col-sm-6">
                    <span class="text-muted small uppercase font-mono">Pickup Schedule</span>
                    <h6 class="fw-bold text-navy mb-0"><?= htmlspecialchars($booking['pickup_date']) ?></h6>
                    <small class="text-muted"><?= htmlspecialchars($booking['pickup_location']) ?></small>
                </div>
                <div class="col-sm-6">
                    <span class="text-muted small uppercase font-mono">Return Schedule</span>
                    <h6 class="fw-bold text-navy mb-0"><?= htmlspecialchars($booking['return_date']) ?></h6>
                    <small class="text-muted"><?= htmlspecialchars($booking['return_location']) ?></small>
                </div>
                <div class="col-12 border-top pt-3 d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small uppercase font-mono">Total Paid</span>
                        <h5 class="fw-bold text-success mb-0">$<?= number_format($booking['total_amount'], 2) ?> USD</h5>
                    </div>
                    <span class="badge bg-success px-3 py-2">Paid via Units Balance</span>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-center gap-3">
            <a href="/portal/car-rentals/my-rentals" class="btn btn-primary btn-lg">
                <i class="bi bi-card-checklist me-2"></i> View My Rental Bookings
            </a>
            <a href="/portal/dashboard" class="btn btn-outline-navy btn-lg">
                Dashboard Overview
            </a>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
