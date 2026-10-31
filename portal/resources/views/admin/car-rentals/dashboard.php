<?php
$pageTitle = "Vehicle Fleet Management | Admin Panel";
require_once __DIR__ . '/../../layouts/admin.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="fw-bold text-navy mb-1">Car Rental Fleet Management</h2>
            <p class="text-muted mb-0">Oversee active vehicle dispatches, pricing controls, and fleet inventory.</p>
        </div>
        <a href="/portal/admin/car-rentals/vehicles/create" class="btn btn-primary">
            <i class="bi bi-plus-lg me-1"></i> Add New Vehicle
        </a>
    </div>

    <!-- Admin Subnav -->
    <div class="nav nav-pills mb-4 bg-white p-2 border-subtle rounded-md gap-2">
        <a href="/portal/admin/car-rentals" class="nav-link active">Fleet Overview</a>
        <a href="/portal/admin/car-rentals/vehicles" class="nav-link">Vehicle Inventory</a>
        <a href="/portal/admin/car-rentals/bookings" class="nav-link">Rental Bookings</a>
        <a href="/portal/admin/car-rentals/categories" class="nav-link">Categories</a>
        <a href="/portal/admin/car-rentals/pricing" class="nav-link">Seasonal Pricing</a>
        <a href="/portal/admin/car-rentals/maintenance" class="nav-link">Maintenance</a>
        <a href="/portal/admin/car-rentals/reports" class="nav-link">Rental Reports</a>
    </div>

    <div class="row g-4">
        <div class="col-md-3">
            <div class="card p-3 border-subtle shadow-sm bg-white">
                <span class="text-muted small font-mono uppercase">Total Fleet Size</span>
                <h3 class="fw-bold text-navy mt-1 mb-0"><?= count($vehicles) ?> Vehicles</h3>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card p-3 border-subtle shadow-sm bg-white">
                <span class="text-muted small font-mono uppercase">Active Bookings</span>
                <h3 class="fw-bold text-accent mt-1 mb-0"><?= count($bookings) ?> Active</h3>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card p-3 border-subtle shadow-sm bg-white">
                <span class="text-muted small font-mono uppercase">Electric Fleet</span>
                <h3 class="fw-bold text-success mt-1 mb-0">40% Zero Emission</h3>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card p-3 border-subtle shadow-sm bg-white">
                <span class="text-muted small font-mono uppercase">Units Settlement Revenue</span>
                <h3 class="fw-bold text-navy mt-1 mb-0">$<?= number_format(array_sum(array_column($bookings, 'total_amount')), 2) ?></h3>
            </div>
        </div>
    </div>

    <div class="card my-4 border-subtle shadow-sm bg-white">
        <div class="card-header bg-white py-3">
            <h5 class="fw-bold text-navy mb-0">Recent Fleet Dispatches</h5>
        </div>
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Reference</th>
                        <th>Vehicle</th>
                        <th>Customer</th>
                        <th>Pickup - Return</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($bookings)): ?>
                        <tr><td colspan="6" class="text-center py-4 text-muted">No rental bookings registered.</td></tr>
                    <?php else: ?>
                        <?php foreach ($bookings as $b): ?>
                            <tr>
                                <td class="font-mono fw-bold"><?= htmlspecialchars($b['booking_reference']) ?></td>
                                <td><?= htmlspecialchars($b['vehicle_name']) ?></td>
                                <td><?= htmlspecialchars($b['customer_name']) ?></td>
                                <td><?= htmlspecialchars($b['pickup_date']) ?> to <?= htmlspecialchars($b['return_date']) ?></td>
                                <td class="fw-bold text-success">$<?= number_format($b['total_amount'], 2) ?></td>
                                <td><span class="badge bg-success"><?= htmlspecialchars($b['booking_status']) ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../layouts/footer.php'; ?>
