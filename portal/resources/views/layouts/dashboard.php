<?php require __DIR__ . '/main.php'; ?>
<nav class="subnav-bar">
    <div class="subnav-inner">
        <a href="/portal/dashboard" class="subnav-item <?= ($_SERVER['REQUEST_URI'] === '/portal/dashboard' || $_SERVER['REQUEST_URI'] === '/portal/') ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Overview
        </a>
        <a href="/portal/bookings" class="subnav-item <?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/bookings')) ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            My Reservations
        </a>
        <a href="/portal/vehicles" class="subnav-item <?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/vehicles')) ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="22" height="13" rx="2" ry="2"/><path d="M16 8h4"/><path d="M4 8h4"/><path d="M9 16v3"/><path d="M15 16v3"/></svg>
            Vehicle Rentals (3D)
        </a>
        <a href="/portal/units" class="subnav-item <?= ($_SERVER['REQUEST_URI'] === '/portal/units' || str_contains($_SERVER['REQUEST_URI'] ?? '', '/units/history')) ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 6v2"/><path d="M12 16v2"/></svg>
            Units & Records
        </a>
        <a href="/portal/units/purchase" class="subnav-item subnav-item-highlight">
            ⚡ Purchase Corporate Units (+)
        </a>
        <a href="/portal/transactions" class="subnav-item <?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/transactions')) ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Ledger & History
        </a>
        <a href="/portal/payments/manual" class="subnav-item <?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/payments/manual')) ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            Submit Wire Notice
        </a>
        <a href="/portal/notifications" class="subnav-item <?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/notifications')) ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Alerts
        </a>
        <a href="/portal/profile" class="subnav-item <?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/profile')) ? 'active' : '' ?>">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
        </a>
    </div>
</nav>
