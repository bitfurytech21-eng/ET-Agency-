<?php require __DIR__ . '/../layouts/dashboard.php'; ?>
<div class="portal-card">
    <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 1rem;">Unit Purchase Ledger</h2>
    <table class="portal-table">
        <thead><tr><th>Ref</th><th>Units</th><th>Total USD</th><th>Date</th></tr></thead>
        <tbody>
            <?php foreach (($transactions ?? []) as $t): ?>
            <tr>
                <td><?= htmlspecialchars($t['transaction_ref']) ?></td>
                <td>+<?= (int)$t['units'] ?></td>
                <td>$<?= number_format((float)$t['amount_usd'], 2) ?></td>
                <td><?= htmlspecialchars($t['created_at']) ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
</body></html>
