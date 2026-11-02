<?php
$pageTitle = "Vehicle Categories | Admin";
require_once __DIR__ . '/../../../layouts/admin.php';
?>

<div class="container-fluid">
    <h2 class="fw-bold text-navy mb-4">Vehicle Categories</h2>
    <div class="card p-4 border-subtle shadow-sm bg-white">
        <div class="list-group list-group-flush">
            <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                <div>
                    <h6 class="fw-bold text-navy mb-0">Luxury SUV</h6>
                    <small class="text-muted">Full-size executive luxury SUVs with maximum passenger comfort.</small>
                </div>
                <span class="badge bg-navy">Active</span>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                <div>
                    <h6 class="fw-bold text-navy mb-0">Executive Sedan</h6>
                    <small class="text-muted">High-performance flagship electric and executive sedans.</small>
                </div>
                <span class="badge bg-navy">Active</span>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                <div>
                    <h6 class="fw-bold text-navy mb-0">Electric Performance</h6>
                    <small class="text-muted">Next-gen long range zero-emission luxury electric vehicles.</small>
                </div>
                <span class="badge bg-navy">Active</span>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                <div>
                    <h6 class="fw-bold text-navy mb-0">Heavy Duty Pickup</h6>
                    <small class="text-muted">Full-size electric and hybrid high-torque utility trucks.</small>
                </div>
                <span class="badge bg-navy">Active</span>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../../layouts/footer.php'; ?>
