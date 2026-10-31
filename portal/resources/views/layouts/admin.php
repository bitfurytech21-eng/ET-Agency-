<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title ?? 'Admin Control') ?> | Easy Travel Lodging</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- Modular CSS Architecture -->
    <link rel="stylesheet" href="/portal/assets/css/main.css">
    <link rel="stylesheet" href="/portal/assets/css/components.css">
    <link rel="stylesheet" href="/portal/assets/css/forms.css">
    <link rel="stylesheet" href="/portal/assets/css/tables.css">
    <link rel="stylesheet" href="/portal/assets/css/admin.css">
    <link rel="stylesheet" href="/portal/assets/css/responsive.css">
    <link rel="stylesheet" href="/portal/assets/css/animations.css">
</head>
<body class="admin-body animate-fade-in">
    <div class="admin-layout">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar">
            <div class="admin-sidebar-header">
                <div class="portal-brand-logo" style="width: 32px; height: 32px; font-size: 0.95rem;">ETL</div>
                <div class="admin-sidebar-brand">
                    Admin Panel <span>CONTROL</span>
                </div>
            </div>

            <nav>
                <div class="admin-sidebar-section">Overview</div>
                <a href="/portal/admin/dashboard" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/dashboard')) ? 'active' : '' ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    Control Panel
                </a>

                <div class="admin-sidebar-section">Operations</div>
                <a href="/portal/admin/customers" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/customers')) ? 'active' : '' ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Customers
                </a>
                <a href="/portal/admin/bookings" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/bookings')) ? 'active' : '' ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Reservations
                </a>
                <a href="/portal/admin/units" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/units')) ? 'active' : '' ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Corporate Lodging Units
                </a>
                <a href="/portal/admin/vehicles" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/vehicles')) ? 'active' : '' ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="22" height="13" rx="2" ry="2"/><path d="M16 8h4"/><path d="M4 8h4"/><path d="M9 16v3"/><path d="M15 16v3"/></svg>
                    Vehicle Fleet
                </a>

                <div class="admin-sidebar-section">Financials &amp; Payments</div>
                <a href="/portal/admin/payments/manual-payments" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/payments/manual-payments')) ? 'active' : '' ?>" style="color: #fbbf24;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                    Wire / ACH Verification
                </a>
                <a href="/portal/admin/payments/pending" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/payments/pending')) ? 'active' : '' ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Pending Approvals
                </a>
                <a href="/portal/admin/transactions" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/transactions')) ? 'active' : '' ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Ledger &amp; Unit Grants
                </a>
                <a href="/portal/admin/reports/reconciliation" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/reports/reconciliation')) ? 'active' : '' ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    Reconciliation Reports
                </a>

                <div class="admin-sidebar-section">System &amp; Audit</div>
                <a href="/portal/admin/staff" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/staff')) ? 'active' : '' ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Staff &amp; Permissions
                </a>
                <a href="/portal/admin/settings" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/settings')) ? 'active' : '' ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                    System Settings
                </a>
                <a href="/portal/admin/audit-logs" class="<?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin/audit-logs')) ? 'active' : '' ?>">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                    Audit Logs
                </a>
            </nav>

            <div class="admin-sidebar-footer">
                <a href="/portal/admin/logout" style="color: var(--danger-red); font-weight: 600;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out Administrator
                </a>
            </div>
        </aside>

        <!-- Main Content Viewport -->
        <div class="admin-content">
            <div class="admin-header">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <button class="portal-btn portal-btn-secondary admin-mobile-toggle" style="display: none; padding: 0.5rem;" aria-label="Toggle Menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                    <div>
                        <h1 style="font-size: 1.65rem; font-weight: 800; color: var(--color-navy-dark);"><?= htmlspecialchars($title ?? 'Admin Control') ?></h1>
                        <p style="font-size: 0.85rem; color: var(--color-slate-muted);">Easy Travel Lodging Administrative Control System</p>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: 0.85rem;">
                    <span class="badge badge-verified">ADMINISTRATOR ACTIVE</span>
                    <a href="/portal/dashboard" class="portal-btn portal-btn-sm portal-btn-secondary" target="_blank">
                        View Customer Portal ↗
                    </a>
                </div>
            </div>
