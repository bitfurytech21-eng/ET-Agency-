<?php require __DIR__ . '/../layouts/main.php'; ?>
<div style="max-width: 500px; margin: 2rem auto;" class="portal-card">
    <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem; color: #0f172a;">Client Registration</h2>
    <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">Create a portal profile to manage unit balances and mid-term stays. Receive 25 welcome units upon registration.</p>

    <form id="regForm" method="POST" action="/portal/register">
        <div class="form-group">
            <label>Full Name</label>
            <input type="text" name="name" class="form-control" required placeholder="e.g. Dr. Jane Smith">
        </div>
        <div class="form-group">
            <label>Corporate / Hospital Email</label>
            <input type="email" name="email" class="form-control" required placeholder="name@company.com">
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" class="form-control" required minlength="6">
        </div>
        <div class="grid-2">
            <div class="form-group">
                <label>Employer / Agency</label>
                <input type="text" name="company" class="form-control" placeholder="UC Davis, Sutter, Kaiser">
            </div>
            <div class="form-group">
                <label>Job Title / Role</label>
                <input type="text" name="role" class="form-control" placeholder="Travel Nurse, Fellow, Exec">
            </div>
        </div>
        <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" class="form-control" placeholder="(916) 000-0000">
        </div>
        <button type="submit" class="portal-btn" style="width: 100%;">Create Account &amp; Claim 25 Units</button>
    </form>
</div>
<script>
document.getElementById('regForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch('/portal/register', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
        alert(data.message);
        window.location.href = data.redirect || '/portal/dashboard';
    } else {
        alert(data.message || 'Registration failed');
    }
});
</script>
</body></html>
