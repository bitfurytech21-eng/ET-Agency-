<?php require __DIR__ . '/../layouts/main.php'; ?>
<div style="max-width: 420px; margin: 3rem auto;" class="portal-card">
    <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem;">Reset Your Password</h2>
    <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">Enter your email and we'll send a password reset link.</p>
    <form method="POST" action="/portal/forgot-password">
        <div class="form-group">
            <label>Registered Email</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        <button type="submit" class="portal-btn" style="width: 100%;">Send Reset Instructions</button>
    </form>
</div>
</body></html>
