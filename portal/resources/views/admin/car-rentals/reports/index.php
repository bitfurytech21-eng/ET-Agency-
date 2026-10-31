<?php
$pageTitle = "Rental Reports & Analytics | Admin";
require_once __DIR__ . '/../../../layouts/admin.php';
?>

<div class="container-fluid">
    <h2 class="fw-bold text-navy mb-4">Rental Analytics & Financial Reports</h2>
    <div class="row g-4 mb-4">
        <div class="col-md-4">
            <div class="card p-4 border-subtle shadow-sm bg-white">
                <span class="text-muted font-mono small uppercase">Fleet Utilization Rate</span>
                <h3 class="fw-bold text-navy mt-1">84.2%</h3>
                <span class="text-success small"><i class="bi bi-graph-up me-1"></i> +8.5% vs last month</span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card p-4 border-subtle shadow-sm bg-white">
                <span class="text-muted font-mono small uppercase">Average Rental Duration</span>
                <h3 class="fw-bold text-navy mt-1">4.2 Days</h3>
                <span class="text-muted small">Most popular: Weekend Getaway</span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card p-4 border-subtle shadow-sm bg-white">
                <span class="text-muted font-mono small uppercase">Units Paid Volume</span>
                <h3 class="fw-bold text-success mt-1">142 Units</h3>
                <span class="text-muted small">Equiv $14,200.00 USD</span>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../../layouts/footer.php'; ?>
