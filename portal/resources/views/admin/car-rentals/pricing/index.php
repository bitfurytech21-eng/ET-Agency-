<?php
$pageTitle = "Seasonal Pricing Rules | Admin";
require_once __DIR__ . '/../../../layouts/admin.php';
?>

<div class="container-fluid">
    <h2 class="fw-bold text-navy mb-4">Seasonal Pricing Configuration</h2>
    <div class="card p-4 border-subtle shadow-sm bg-white">
        <p class="text-muted">Configure surge multipliers for peak holiday travel, luxury events, and high-demand summer seasons.</p>
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Season</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Multiplier</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="fw-bold text-navy">Summer Peak Luxury</td>
                        <td>June 01</td>
                        <td>August 31</td>
                        <td><span class="badge bg-primary fs-6">1.25x</span></td>
                        <td><span class="badge bg-success">Active</span></td>
                    </tr>
                    <tr>
                        <td class="fw-bold text-navy">Holiday Season Surge</td>
                        <td>December 15</td>
                        <td>January 05</td>
                        <td><span class="badge bg-primary fs-6">1.35x</span></td>
                        <td><span class="badge bg-success">Active</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../../layouts/footer.php'; ?>
