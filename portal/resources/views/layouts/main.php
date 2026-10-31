<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title ?? 'Easy Travel Lodging Portal') ?></title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- Modular CSS Architecture -->
    <link rel="stylesheet" href="/portal/assets/css/main.css">
    <link rel="stylesheet" href="/portal/assets/css/components.css">
    <link rel="stylesheet" href="/portal/assets/css/forms.css">
    <link rel="stylesheet" href="/portal/assets/css/tables.css">
    <link rel="stylesheet" href="/portal/assets/css/dashboard.css">
    <link rel="stylesheet" href="/portal/assets/css/responsive.css">
    <link rel="stylesheet" href="/portal/assets/css/animations.css">
    <!-- 3D Graphics Engine (Three.js) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body class="animate-fade-in">
    <!-- Master Header Navigation -->
    <header class="portal-nav">
        <div class="portal-nav-inner">
            <a href="/portal/dashboard" class="portal-brand">
                <div class="portal-brand-logo">ETL</div>
                <div>
                    <span class="portal-brand-text">Easy Travel Lodging</span>
                </div>
                <span class="portal-brand-tag">PORTAL</span>
            </a>

            <nav class="portal-nav-links">
                <a href="/portal/dashboard" class="portal-nav-link <?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/dashboard')) ? 'active' : '' ?>">Overview</a>
                <a href="/portal/bookings" class="portal-nav-link <?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/bookings')) ? 'active' : '' ?>">My Stays</a>
                <a href="/portal/car-rentals" class="portal-nav-link <?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/car-rentals')) ? 'active' : '' ?>">Car Rentals (3D)</a>
                <a href="/portal/units" class="portal-nav-link <?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/units')) ? 'active' : '' ?>">Units & Balance</a>
                <a href="/portal/payments/bank-details" class="portal-nav-link <?= (str_contains($_SERVER['REQUEST_URI'] ?? '', '/payments')) ? 'active' : '' ?>">Wire / ACH Info</a>
            </nav>

            <div class="portal-nav-actions">
                <?php if (!empty($_SESSION['user'])): ?>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <a href="/portal/units/purchase" class="badge badge-info" style="text-decoration: none; font-size: 0.8rem; padding: 0.35rem 0.65rem;">
                            ⚡ <?= (int)($_SESSION['user']['units_balance'] ?? 25) ?> Units
                        </a>
                        <a href="/portal/profile" class="portal-nav-link" style="font-weight: 600;">
                            <?= htmlspecialchars($_SESSION['user']['name'] ?? 'Account') ?>
                        </a>
                        <a href="/portal/logout" class="portal-btn portal-btn-sm portal-btn-secondary">Sign Out</a>
                    </div>
                <?php else: ?>
                    <a href="/portal/login" class="portal-btn portal-btn-sm portal-btn-outline">Sign In</a>
                    <a href="/portal/register" class="portal-btn portal-btn-sm portal-btn-dark">Register</a>
                <?php endif; ?>

                <button class="portal-nav-toggle" aria-label="Toggle Navigation">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
            </div>
        </div>
    </header>

    <main class="portal-container">
