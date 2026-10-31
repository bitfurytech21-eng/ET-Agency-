<?php require __DIR__ . '/../layouts/dashboard.php'; ?>
<div class="portal-card">
    <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 1rem;">My Mid-Term Stay Reservations</h2>
    <table class="portal-table">
        <thead><tr><th>Ref</th><th>Property</th><th>Dates</th><th>Status</th><th>Total USD</th></tr></thead>
        <tbody>
            <?php foreach (($bookings ?? []) as $b): ?>
            <tr>
                <td><strong><?= htmlspecialchars($b['booking_reference'] ?? ('BK-' . $b['id'])) ?></strong></td>
                <td><?= htmlspecialchars($b['property_id']) ?></td>
                <td><?= htmlspecialchars($b['check_in']) ?> to <?= htmlspecialchars($b['check_out']) ?></td>
                <td><span class="badge badge-success"><?= htmlspecialchars($b['status']) ?></span></td>
                <td>$<?= number_format((float)$b['total_amount_usd'], 2) ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
</body></html>
