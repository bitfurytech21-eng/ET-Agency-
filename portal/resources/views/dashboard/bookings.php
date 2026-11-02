<?php require __DIR__ . '/../layouts/dashboard.php'; ?>
<div class="portal-card">
    <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 1rem;">My Reservation Records</h2>
    <table class="portal-table">
        <thead>
            <tr>
                <th>Reference</th>
                <th>Property</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Nights</th>
                <th>Total USD</th>
                <th>Status</th>
                <th>Settlement</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach (($bookings ?? []) as $b): ?>
            <tr>
                <td><strong><?= htmlspecialchars($b['booking_reference'] ?? ('BK-' . $b['id'])) ?></strong></td>
                <td><?= htmlspecialchars($b['property_id'] ?? '') ?></td>
                <td><?= htmlspecialchars($b['check_in'] ?? '') ?></td>
                <td><?= htmlspecialchars($b['check_out'] ?? '') ?></td>
                <td><?= (int)($b['total_nights'] ?? 30) ?> nights</td>
                <td>$<?= number_format((float)($b['total_amount_usd'] ?? 0), 2) ?></td>
                <td><span class="badge badge-success"><?= htmlspecialchars($b['status'] ?? 'active') ?></span></td>
                <td>
                    <?php if ($b['status'] !== 'confirmed' && $b['status'] !== 'settled'): ?>
                        <button class="portal-btn portal-btn-sm" onclick="executeInternalPayFromBalance(<?= (int)$b['id'] ?>, 25)">
                            Pay from Balance
                        </button>
                    <?php else: ?>
                        <span style="color: #16a34a; font-weight: 600;">Settled from Units</span>
                    <?php endif; ?>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<script src="/portal/assets/js/dashboard.js"></script>
</body></html>
