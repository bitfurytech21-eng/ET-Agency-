<?php require __DIR__ . '/../layouts/dashboard.php'; ?>
<div class="portal-card">
    <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 1rem;">Submitted Wire / ACH Notices</h2>
    <table class="portal-table">
        <thead><tr><th>Ref</th><th>Amount</th><th>Sender</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>
            <?php foreach (($payments ?? []) as $p): ?>
            <tr>
                <td><?= htmlspecialchars($p['reference_code'] ?? '') ?></td>
                <td>$<?= number_format((float)$p['amount'], 2) ?></td>
                <td><?= htmlspecialchars($p['sender_name'] ?? '') ?></td>
                <td><?= htmlspecialchars($p['transfer_date'] ?? '') ?></td>
                <td><span class="badge badge-warning"><?= htmlspecialchars($p['status'] ?? '') ?></span></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
</body></html>
