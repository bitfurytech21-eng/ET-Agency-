<?php require __DIR__ . '/../layouts/dashboard.php'; ?>

<!-- Welcome Section -->
<div class="welcome-banner">
    <div class="welcome-content">
        <h1>Welcome, <?= htmlspecialchars($user['name'] ?? 'Corporate Guest') ?></h1>
        <p><?= htmlspecialchars($user['company'] ?? 'Visiting Healthcare / Traveling Professional') ?> • <?= htmlspecialchars($user['role'] ?? 'Verified Account') ?></p>
        <div class="grant-badge">
            ✓ 25 Corporate Units Welcome Grant Active ($2,500.00 USD Credit)
        </div>
    </div>
    <div>
        <button class="portal-btn portal-btn-lg portal-btn-dark" onclick="openModal('reservationModal')">
            Book Stay With Bill &amp; Marlena
        </button>
    </div>
</div>

<!-- Key Stat Cards Grid -->
<div class="grid-4" style="margin-bottom: 2rem;">
    <div class="stat-card">
        <span class="stat-label">Active Units Balance</span>
        <span class="stat-value" style="color: var(--accent-teal);"><?= (int)($user['units_balance'] ?? 25) ?> Units</span>
        <span class="stat-desc">$<?= number_format((float)($user['balance_usd'] ?? 2500), 2) ?> USD Corporate Credit</span>
    </div>
    <div class="stat-card">
        <span class="stat-label">Unit Value Exchange Rate</span>
        <span class="stat-value">$100.00</span>
        <span class="stat-desc">Fixed Lodging Credit Base</span>
    </div>
    <div class="stat-card">
        <span class="stat-label">Active Reservations</span>
        <span class="stat-value"><?= count($bookings ?? []) ?></span>
        <span class="stat-desc">SAC Mid-Term Stay Units</span>
    </div>
    <div class="stat-card">
        <span class="stat-label">Account Status</span>
        <span class="stat-value" style="color: var(--success-green); font-size: 1.4rem;">VERIFIED</span>
        <span class="stat-desc">Corporate Grant Entitlement</span>
    </div>
</div>

<!-- Internal Balance Command / Settlement Engine -->
<div class="terminal-card">
    <div class="terminal-title">Internal Balance Checkout &amp; Settlement Command Engine</div>
    <p style="color: #cbd5e1; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5;">
        Internal command engine active. Settle pending or confirmed reservation balances instantly using your allocated unit credits without payment processing fees or external credit card holds.
    </p>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <button class="portal-btn portal-btn-sm" style="background: #38bdf8; color: #0b192c; font-weight: 700;" onclick="showToast('Internal command engine ready. Use Pay from Balance next to any reservation.', 'info');">
            ⚡ Internal Command Runner Active
        </button>
        <a href="/portal/units/purchase" class="portal-btn portal-btn-sm portal-btn-dark">Purchase Additional Units (+)</a>
        <a href="/portal/payments/bank-details" class="portal-btn portal-btn-sm portal-btn-secondary">View Bank Wire / ACH Details</a>
    </div>
</div>

<!-- My Reservation Records Table -->
<div class="data-table-container">
    <div class="table-toolbar">
        <div>
            <h3 style="font-size: 1.15rem; font-weight: 800;">My Reservation Records</h3>
            <p style="font-size: 0.8rem; color: var(--color-slate-muted);">SAC Mid-Term Accommodation &amp; Fleet Stays</p>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center;">
            <div class="table-search">
                <span class="table-search-icon">🔍</span>
                <input type="text" class="form-control" placeholder="Search reservations..." data-table-search="bookingsTable">
            </div>
            <button class="portal-btn portal-btn-sm portal-btn-dark" onclick="openModal('reservationModal')">+ New Stay</button>
        </div>
    </div>

    <?php if (empty($bookings)): ?>
        <div class="empty-state">
            <div class="empty-state-icon">🏨</div>
            <h4>No Reservations on File</h4>
            <p>You have not created any lodging or vehicle stay records yet. Use your 25 corporate grant units to book your stay.</p>
            <button class="portal-btn portal-btn-sm" onclick="openModal('reservationModal')">Book Stay With Bill &amp; Marlena</button>
        </div>
    <?php else: ?>
        <div class="table-responsive">
            <table class="portal-table" id="bookingsTable">
                <thead>
                    <tr>
                        <th>Booking Ref</th>
                        <th>Accommodation / Unit</th>
                        <th>Check-In / Out</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                        <th>Checkout &amp; Settlement</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($bookings as $b): ?>
                    <tr>
                        <td><strong style="font-family: var(--font-mono); color: var(--accent-blue);"><?= htmlspecialchars($b['booking_reference'] ?? ('BK-' . $b['id'])) ?></strong></td>
                        <td><?= htmlspecialchars($b['property_id'] ?? 'Executive SAC Suite') ?></td>
                        <td>
                            <span style="font-size: 0.825rem; font-weight: 600;"><?= htmlspecialchars($b['check_in'] ?? '') ?></span> 
                            <span style="color: var(--color-slate-muted);">to</span> 
                            <span style="font-size: 0.825rem; font-weight: 600;"><?= htmlspecialchars($b['check_out'] ?? '') ?></span>
                        </td>
                        <td class="amount-cell"><strong style="font-size: 0.95rem;">$<?= number_format((float)($b['total_amount_usd'] ?? 2500), 2) ?></strong></td>
                        <td>
                            <span class="badge <?= ($b['status'] === 'confirmed' || $b['status'] === 'settled') ? 'badge-success' : 'badge-warning' ?>">
                                <?= strtoupper($b['status'] ?? 'pending') ?>
                            </span>
                        </td>
                        <td>
                            <?php if ($b['status'] !== 'confirmed' && $b['status'] !== 'settled'): ?>
                                <button class="portal-btn portal-btn-sm portal-btn-success" onclick="executeInternalPayFromBalance(<?= (int)$b['id'] ?>, <?= (int)($b['units_cost'] ?: 25) ?>)">
                                    Pay from Balance (<?= (int)($b['units_cost'] ?: 25) ?> Units)
                                </button>
                            <?php else: ?>
                                <span class="badge badge-success">✓ Settled from Units</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>

<!-- Modern Reservation Inquiry Modal: Book Your Stay With Bill & Marlena -->
<div class="modal-backdrop" id="reservationModal">
    <div class="modal-container">
        <div class="modal-header">
            <div>
                <div class="modal-header-category">ACCOMMODATION RESERVATION INQUIRY</div>
                <h3>Book Your Stay With Bill &amp; Marlena</h3>
                <p style="font-size: 0.85rem; color: var(--color-slate-muted); margin-top: 0.15rem;">Sacramento Mid-Term Executive &amp; Medical Travel Lodging</p>
            </div>
            <button class="modal-close" onclick="closeModal('reservationModal')">&times;</button>
        </div>
        <form action="/portal/bookings/create" method="GET">
            <div class="modal-body">
                <!-- Section 1: Guest Information -->
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.85rem; padding-bottom: 0.35rem; border-bottom: 1px solid var(--color-slate-border);">
                        1. Guest Information
                    </h4>
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label>Full Name <span class="required">*</span></label>
                            <input type="text" name="guest_name" class="form-control" value="<?= htmlspecialchars($user['name'] ?? '') ?>" required placeholder="e.g. Dr. Sarah Jenkins">
                        </div>
                        <div class="form-group">
                            <label>Email Address <span class="required">*</span></label>
                            <input type="email" name="guest_email" class="form-control" value="<?= htmlspecialchars($user['email'] ?? '') ?>" required placeholder="sarah.j@health.org">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Phone Number <span class="required">*</span></label>
                        <input type="tel" name="phone" class="form-control" placeholder="+1 (916) 555-0192" required>
                    </div>
                </div>

                <!-- Section 2: Professional Information -->
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.85rem; padding-bottom: 0.35rem; border-bottom: 1px solid var(--color-slate-border);">
                        2. Professional Information
                    </h4>
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label>Employer / Hospital / Agency</label>
                            <input type="text" name="company" class="form-control" value="<?= htmlspecialchars($user['company'] ?? '') ?>" placeholder="UC Davis Health / Sutter / Travel Agency">
                        </div>
                        <div class="form-group">
                            <label>Job Title / Traveler Role</label>
                            <select name="traveler_role" class="form-control">
                                <option value="Travel Nurse / Healthcare Professional">Travel Nurse / Healthcare Professional</option>
                                <option value="Corporate Executive / Consultant">Corporate Executive / Consultant</option>
                                <option value="Relocation / Government Contractor">Relocation / Government Contractor</option>
                                <option value="Visiting Professional">Visiting Professional</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Section 3: Accommodation Preferences -->
                <div>
                    <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.85rem; padding-bottom: 0.35rem; border-bottom: 1px solid var(--color-slate-border);">
                        3. Stay Dates &amp; Unit Preference
                    </h4>
                    <div class="form-group">
                        <label>Preferred Accommodation Unit</label>
                        <select name="property_id" class="form-control">
                            <option value="SAC-UNIT-101">SAC Mid-Term Executive Suite #101 (25 Units/30 Days)</option>
                            <option value="SAC-UNIT-102">SAC Mid-Term Luxury Apartment #102 (30 Units/30 Days)</option>
                            <option value="SAC-UNIT-103">SAC Medical Center Travel Suite #103 (25 Units/30 Days)</option>
                            <option value="SAC-UNIT-104">SAC Downtown Corporate Loft #104 (35 Units/30 Days)</option>
                        </select>
                    </div>
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label>Estimated Move-In Date <span class="required">*</span></label>
                            <input type="date" name="check_in" class="form-control" required value="<?= date('Y-m-d', strtotime('+3 days')) ?>">
                        </div>
                        <div class="form-group">
                            <label>Estimated Move-Out Date <span class="required">*</span></label>
                            <input type="date" name="check_out" class="form-control" required value="<?= date('Y-m-d', strtotime('+33 days')) ?>">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Special Requests / Booking Notes</label>
                        <textarea name="notes" class="form-control" placeholder="Quiet floor preference, parking requirement, or corporate billing notes..."></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="portal-btn portal-btn-secondary" onclick="closeModal('reservationModal')">Cancel</button>
                <button type="submit" class="portal-btn portal-btn-dark">Proceed to Reservation Review →</button>
            </div>
        </form>
    </div>
</div>

<script src="/portal/assets/js/main.js"></script>
<script src="/portal/assets/js/dashboard.js"></script>

</main>
<footer class="portal-footer">
    <div class="portal-footer-inner">
        <div class="portal-footer-brand">
            <h4>Easy Travel Lodging</h4>
            <p>Sacramento Executive &amp; Medical Travel Mid-Term Stays with Bill &amp; Marlena. Premium accommodations and American vehicle fleet rentals.</p>
        </div>
        <div class="portal-footer-col">
            <h5>Navigation</h5>
            <ul>
                <li><a href="/portal/dashboard">Overview</a></li>
                <li><a href="/portal/bookings">My Reservations</a></li>
                <li><a href="/portal/vehicles">3D Vehicle Rentals</a></li>
                <li><a href="/portal/units">Units &amp; Purchases</a></li>
            </ul>
        </div>
        <div class="portal-footer-col">
            <h5>Payments &amp; ACH</h5>
            <ul>
                <li><a href="/portal/payments/bank-details">Wire Transfer Instructions</a></li>
                <li><a href="/portal/payments/manual">Submit Payment Receipt</a></li>
                <li><a href="/portal/transactions">Transaction Ledger</a></li>
            </ul>
        </div>
        <div class="portal-footer-col">
            <h5>Support &amp; Contact</h5>
            <ul>
                <li><a href="#">Bill &amp; Marlena Host Direct</a></li>
                <li><a href="#">SAC Mid-Term Headquarters</a></li>
                <li><a href="/portal/admin/login">Admin Sign In</a></li>
            </ul>
        </div>
    </div>
    <div class="portal-footer-bottom">
        <div>&copy; <?= date('Y') ?> Easy Travel Lodging (SAC Mid-Term Stays). All rights reserved.</div>
        <div>25 Corporate Grant Units Program Active</div>
    </div>
</footer>
</body>
</html>
