<?php
$pageTitle = "Vehicle Inventory | Admin";
require_once __DIR__ . '/../../../layouts/admin.php';
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-navy mb-0">Vehicle Fleet Inventory</h2>
        <a href="/portal/admin/car-rentals/vehicles/create" class="btn btn-primary">
            <i class="bi bi-plus-lg me-1"></i> Add Vehicle
        </a>
    </div>

    <div class="card border-subtle shadow-sm bg-white">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Brand & Model</th>
                        <th>Power / Horsepower</th>
                        <th>Daily Rate</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($vehicles as $v): ?>
                        <tr>
                            <td>#<?= $v['id'] ?></td>
                            <td class="fw-bold text-navy"><?= htmlspecialchars($v['name']) ?></td>
                            <td><?= htmlspecialchars($v['brand']) ?> <?= htmlspecialchars($v['model']) ?></td>
                            <td><?= $v['horsepower'] ?> HP (<?= htmlspecialchars($v['powertrain']) ?>)</td>
                            <td class="fw-bold text-accent">$<?= number_format($v['daily_rate'], 2) ?></td>
                            <td><span class="badge bg-success"><?= htmlspecialchars($v['status']) ?></span></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../../layouts/footer.php'; ?>
