<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Control Login | Easy Travel Lodging</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/portal/assets/css/main.css">
    <link rel="stylesheet" href="/portal/assets/css/components.css">
    <link rel="stylesheet" href="/portal/assets/css/forms.css">
    <link rel="stylesheet" href="/portal/assets/css/animations.css">
</head>
<body style="background: radial-gradient(circle at center, #1c2541 0%, #0b192c 100%); display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1.5rem;" class="animate-fade-in">
    <div class="portal-card" style="max-width: 420px; width: 100%; padding: 2.25rem 2rem; border-color: #334155; box-shadow: var(--shadow-modal);">
        <div style="text-align: center; margin-bottom: 1.75rem;">
            <div class="portal-brand-logo" style="width: 48px; height: 48px; font-size: 1.25rem; margin: 0 auto 0.85rem; background: linear-gradient(135deg, #0284c7, #0d9488);">ETL</div>
            <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--color-navy-dark); margin-bottom: 0.25rem;">Admin Control Center</h2>
            <p style="font-size: 0.85rem; color: var(--color-slate-muted);">Easy Travel Lodging Administrative Authorization</p>
        </div>

        <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.825rem; color: #334155; margin-bottom: 1.5rem;">
            <strong style="display: block; margin-bottom: 0.25rem; color: var(--accent-blue);">🔒 Default Admin Account:</strong>
            Email: <strong>admin@easytravellodging.com</strong><br>
            Password: <strong>admin12345</strong>
        </div>

        <form id="adminLoginForm">
            <div class="form-group">
                <label>Administrator Email <span class="required">*</span></label>
                <input type="email" name="email" class="form-control" value="admin@easytravellodging.com" required placeholder="admin@easytravellodging.com">
            </div>
            <div class="form-group">
                <label>Authorization Password <span class="required">*</span></label>
                <input type="password" name="password" class="form-control" value="admin12345" required>
            </div>
            <button type="submit" class="portal-btn portal-btn-lg portal-btn-dark" style="width: 100%; margin-top: 0.5rem; background: var(--color-navy-dark);">
                Authenticate &amp; Launch Control Panel →
            </button>
        </form>

        <div style="margin-top: 1.5rem; text-align: center;">
            <a href="/portal/dashboard" style="font-size: 0.825rem; color: var(--color-slate-muted); text-decoration: none;">← Return to Customer Portal</a>
        </div>
    </div>

    <script src="/portal/assets/js/main.js"></script>
    <script>
    document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerText = 'Authenticating...';

        try {
            const res = await fetch('/portal/admin/login', { method: 'POST', body: new FormData(e.target) });
            const data = await res.json();
            if (data.success) {
                showToast('Admin authorization granted!', 'success');
                setTimeout(() => window.location.href = data.redirect || '/portal/admin/dashboard', 800);
            } else {
                showToast(data.message || 'Authentication failed', 'danger');
                btn.disabled = false;
                btn.innerText = 'Authenticate & Launch Control Panel →';
            }
        } catch(err) {
            showToast('Error: ' + err.message, 'danger');
            btn.disabled = false;
            btn.innerText = 'Authenticate & Launch Control Panel →';
        }
    });
    </script>
</body>
</html>
