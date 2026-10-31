<?php require __DIR__ . '/../layouts/dashboard.php'; ?>
<div class="portal-card">
    <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 1rem;">Unit Transactions &amp; Purchase History</h2>
    <table class="portal-table">
        <thead>
            <tr>
                <th>Ref</th>
                <th>Type</th>
                <th>Units</th>
                <th>Amount USD</th>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach (($transactions ?? []) as $t): ?>
            <tr>
                <td><code><?= htmlspecialchars($t['transaction_ref'] ?? '') ?></code></td>
                <td><?= ucfirst(htmlspecialchars($t['type'] ?? 'purchase')) ?></td>
                <td style="font-weight: bold; color: <?= $t['units'] >= 0 ? '#16a34a' : '#dc2626' ?>;">
                    <?= $t['units'] >= 0 ? '+' : '' ?><?= (int)$t['units'] ?>
                </td>
                <td>$<?= number_format((float)$t['amount_usd'], 2) ?></td>
                <td><?= htmlspecialchars($t['description'] ?? '') ?></td>
                <td><?= htmlspecialchars($t['created_at'] ?? '') ?></td>
                <td><span class="badge badge-success"><?= htmlspecialchars($t['status'] ?? 'completed') ?></span></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
</body></html>
