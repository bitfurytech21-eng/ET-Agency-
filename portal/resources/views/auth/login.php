<?php require __DIR__ . '/../layouts/main.php'; ?>

<div class="portal-card" style="max-width: 440px; margin: 3rem auto; padding: 2.25rem 2rem;">
    <div style="text-align: center; margin-bottom: 1.75rem;">
        <div class="portal-brand-logo" style="width: 48px; height: 48px; font-size: 1.3rem; margin: 0 auto 0.85rem;">ETL</div>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-navy-dark); margin-bottom: 0.25rem;">Client Dashboard Sign In</h2>
        <p style="font-size: 0.875rem; color: var(--color-slate-muted);">Sacramento Executive &amp; Medical Travel Portal</p>
    </div>

    <!-- Quick Demo Pill -->
    <div style="background: var(--accent-blue-light); border: 1px solid var(--accent-blue-border); padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.825rem; color: var(--accent-blue-hover); margin-bottom: 1.5rem;">
        <strong style="display: block; margin-bottom: 0.25rem;">🔑 Demo Client Credentials:</strong>
        Email: <strong>client@easytravellodging.com</strong><br>
        Password: <strong>welcome123</strong>
    </div>

    <form id="loginForm" method="POST" action="/portal/login">
        <div class="form-group">
            <label>Work Email Address <span class="required">*</span></label>
            <input type="email" name="email" class="form-control" value="client@easytravellodging.com" required placeholder="name@company.com">
        </div>
        <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label style="margin-bottom: 0;">Password <span class="required">*</span></label>
                <a href="/portal/forgot-password" style="font-size: 0.8rem; color: var(--accent-blue); text-decoration: none; font-weight: 600;">Forgot?</a>
            </div>
            <input type="password" name="password" class="form-control" value="welcome123" required>
        </div>

        <button type="submit" class="portal-btn portal-btn-lg portal-btn-dark" style="width: 100%; margin-top: 0.5rem;">
            Sign In to Dashboard →
        </button>
    </form>

    <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--color-slate-border); font-size: 0.875rem; text-align: center; color: var(--color-slate-muted);">
        Don't have a corporate account? <a href="/portal/register" style="color: var(--accent-blue); font-weight: 700; text-decoration: none;">Register Here</a>
    </div>
</div>

<script src="/portal/assets/js/main.js"></script>
<script>
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = 'Signing In...';

    const formData = new FormData(e.target);
    try {
        const res = await fetch('/portal/login', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
            showToast('Authentication successful!', 'success');
            setTimeout(() => window.location.href = data.redirect || '/portal/dashboard', 800);
        } else {
            showToast(data.message || 'Login failed', 'danger');
            btn.disabled = false;
            btn.innerText = 'Sign In to Dashboard →';
        }
    } catch(err) {
        showToast('Network error: ' + err.message, 'danger');
        btn.disabled = false;
        btn.innerText = 'Sign In to Dashboard →';
    }
});
</script>

</main>
<footer class="portal-footer">
    <div class="portal-footer-bottom" style="max-width: 1360px; margin: 0 auto; text-align: center;">
        &copy; <?= date('Y') ?> Easy Travel Lodging. All rights reserved.
    </div>
</footer>
</body>
</html>
