<?php require __DIR__ . '/../layouts/admin.php'; ?>

<!-- Admin Stat Metrics Grid -->
<div class="grid-4" style="margin-bottom: 2rem;">
    <div class="stat-card">
        <span class="stat-label">Verified Revenue</span>
        <span class="stat-value" style="color: var(--success-green);">$<?= number_format((float)($reconciliation['verified_manual_revenue'] ?? 0), 2) ?></span>
        <span class="stat-desc"><?= (int)($reconciliation['verified_manual_count'] ?? 0) ?> Bank Wires Reconciled</span>
    </div>
    <div class="stat-card">
        <span class="stat-label">Units Purchased</span>
        <span class="stat-value"><?= (int)($reconciliation['total_units_purchased'] ?? 0) ?> Units</span>
        <span class="stat-desc">Corporate Accounts Total</span>
    </div>
    <div class="stat-card">
        <span class="stat-label">Units Settled</span>
        <span class="stat-value" style="color: var(--accent-blue);"><?= (int)($reconciliation['total_units_settled'] ?? 0) ?> Units</span>
        <span class="stat-desc">Applied to Stays</span>
    </div>
    <div class="stat-card">
        <span class="stat-label">Pending Verification Queue</span>
        <span class="stat-value" style="color: var(--warning-amber);"><?= count($pendingPayments ?? []) ?></span>
        <span class="stat-desc">Action Required</span>
    </div>
</div>

<!-- Wire & ACH Verification Action Queue -->
<div class="data-table-container" style="border-left: 4px solid var(--warning-amber);">
    <div class="table-toolbar">
        <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-navy-dark);">Pending Wire &amp; ACH Verification Queue</h3>
            <p style="font-size: 0.8rem; color: var(--color-slate-muted);">Manual payment notices submitted by corporate clients</p>
        </div>
        <div class="table-search">
            <span class="table-search-icon">🔍</span>
            <input type="text" class="form-control" placeholder="Search pending payments..." data-table-search="pendingPaymentsTable">
        </div>
    </div>

    <?php if (empty($pendingPayments)): ?>
        <div class="empty-state">
            <div class="empty-state-icon" style="background: var(--success-bg); color: var(--success-green);">✓</div>
            <h4>No Pending Payments</h4>
            <p>All client wire notices have been processed and reconciled.</p>
        </div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="portal-table" id="pendingPaymentsTable">
                <thead>
                    <tr>
                        <th>Ref Code</th>
                        <th>Client / Organization</th>
                        <th>Amount</th>
                        <th>Originating Bank &amp; Tx #</th>
                        <th>Notice Date</th>
                        <th>Verification Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($pendingPayments as $p): ?>
                    <tr>
                        <td><strong style="font-family: var(--font-mono); color: var(--accent-blue);"><?= htmlspecialchars($p['reference_code']) ?></strong></td>
                        <td>
                            <strong style="color: var(--color-navy-dark);"><?= htmlspecialchars($p['user_name']) ?></strong>
                            <div style="font-size: 0.775rem; color: var(--color-slate-muted);"><?= htmlspecialchars($p['user_email']) ?></div>
                        </td>
                        <td class="amount-cell"><strong style="font-size: 1rem; color: var(--color-navy-dark);">$<?= number_format((float)$p['amount'], 2) ?></strong></td>
                        <td>
                            <div><?= htmlspecialchars($p['sender_bank']) ?></div>
                            <div style="font-size: 0.775rem; font-family: var(--font-mono); color: var(--color-slate-muted);"><?= htmlspecialchars($p['transaction_number'] ?: 'N/A') ?></div>
                        </td>
                        <td><?= htmlspecialchars($p['transfer_date']) ?></td>
                        <td>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="portal-btn portal-btn-sm portal-btn-success" onclick="verifyManualPayment(<?= (int)$p['id'] ?>, 'approve')">
                                    Approve &amp; Credit
                                </button>
                                <button class="portal-btn portal-btn-sm portal-btn-danger" onclick="verifyManualPayment(<?= (int)$p['id'] ?>, 'reject')">
                                    Reject
                                </button>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

<!-- Split Tables: Customers & Reservations -->
<div class="grid-2">
    <!-- Recent Registered Customers -->
    <div class="data-table-container">
        <div class="table-toolbar">
            <h3 style="font-size: 1.1rem; font-weight: 800;">Registered Corporate Clients</h3>
            <a href="/portal/admin/customers" class="portal-btn portal-btn-sm portal-btn-secondary">View All</a>
        </div>
        <div class="table-responsive">
            <table class="portal-table">
                <thead>
                    <tr>
                        <th>Client Name</th>
                        <th>Email / Org</th>
                        <th>Unit Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach (($users ?? []) as $u): ?>
                    <tr>
                        <td><strong style="color: var(--color-navy-dark);"><?= htmlspecialchars($u['name']) ?></strong></td>
                        <td><?= htmlspecialchars($u['email']) ?></td>
                        <td>
                            <span class="badge badge-info"><?= (int)$u['units_balance'] ?> Units</span>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Recent Reservations -->
    <div class="data-table-container">
        <div class="table-toolbar">
            <h3 style="font-size: 1.1rem; font-weight: 800;">Recent Reservation Records</h3>
            <a href="/portal/admin/bookings" class="portal-btn portal-btn-sm portal-btn-secondary">View All</a>
        </div>
        <div class="table-responsive">
            <table class="portal-table">
                <thead>
                    <tr>
                        <th>Booking Ref</th>
                        <th>Unit ID</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach (($bookings ?? []) as $b): ?>
                    <tr>
                        <td><strong style="font-family: var(--font-mono); color: var(--accent-blue);"><?= htmlspecialchars($b['booking_reference'] ?? ('BK-' . $b['id'])) ?></strong></td>
                        <td><?= htmlspecialchars($b['property_id']) ?></td>
                        <td>
                            <span class="badge <?= ($b['status'] === 'confirmed' || $b['status'] === 'settled') ? 'badge-success' : 'badge-warning' ?>">
                                <?= strtoupper($b['status'] ?? 'pending') ?>
                            </span>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script src="/portal/assets/js/main.js"></script>
<script src="/portal/assets/js/admin.js"></script>
</div>
</div>
</body>
</html>
