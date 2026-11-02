<?php
$pageTitle = "Rental Bookings | Admin";
require_once __DIR__ . '/../../../layouts/admin.php';
?>

<div class="container-fluid">
    <h2 class="fw-bold text-navy mb-4">All Rental Dispatches</h2>

    <div class="card border-subtle shadow-sm bg-white">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Ref Code</th>
                        <th>Vehicle</th>
                        <th>Customer</th>
                        <th>Dates</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($bookings as $b): ?>
                        <tr>
                            <td class="font-mono fw-bold"><?= htmlspecialchars($b['booking_reference']) ?></td>
                            <td><?= htmlspecialchars($b['vehicle_name']) ?></td>
                            <td><?= htmlspecialchars($b['customer_name']) ?></td>
                            <td><?= htmlspecialchars($b['pickup_date']) ?> to <?= htmlspecialchars($b['return_date']) ?></td>
                            <td class="fw-bold text-success">$<?= number_format($b['total_amount'], 2) ?></td>
                            <td>
                                <form action="/portal/admin/car-rentals/bookings/status" method="POST" class="d-flex gap-2">
                                    <input type="hidden" name="id" value="<?= $b['id'] ?>">
                                    <select name="status" class="form-select form-select-sm" onchange="this.form.submit()">
                                        <option value="confirmed" <?= $b['booking_status'] === 'confirmed' ? 'selected' : '' ?>>Confirmed</option>
                                        <option value="dispatched" <?= $b['booking_status'] === 'dispatched' ? 'selected' : '' ?>>Dispatched</option>
                                        <option value="completed" <?= $b['booking_status'] === 'completed' ? 'selected' : '' ?>>Completed</option>
                                        <option value="cancelled" <?= $b['booking_status'] === 'cancelled' ? 'selected' : '' ?>>Cancelled</option>
                                    </select>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../../../layouts/footer.php'; ?>
