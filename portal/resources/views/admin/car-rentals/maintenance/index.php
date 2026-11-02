<?php
$pageTitle = "Vehicle Maintenance Log | Admin";
require_once __DIR__ . '/../../../layouts/admin.php';
?>

<div class="container-fluid">
    <h2 class="fw-bold text-navy mb-4">Vehicle Maintenance & Fleet Health</h2>
    <div class="card p-4 border-subtle shadow-sm bg-white">
        <p class="text-muted">Track scheduled oil changes, tire rotations, EV battery health diagnostics, and detailing services.</p>
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Vehicle</th>
                        <th>Service Type</th>
                        <th>Scheduled Date</th>
                        <th>Estimated Cost</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="fw-bold text-navy">Cadillac Escalade ESV</td>
                        <td>Routine 10,000 Mile Service & Detailing</td>
                        <td>Next Month</td>
                        <td>$350.00</td>
                        <td><span class="badge bg-warning text-dark">Scheduled</span></td>
                    </tr>
                    <tr>
                        <td class="fw-bold text-navy">Tesla Model S Plaid</td>
                        <td>EV Battery Diagnostic & Brake Service</td>
                        <td>This Week</td>
                        <td>$220.00</td>
                        <td><span class="badge bg-success">Completed</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../../layouts/footer.php'; ?>
