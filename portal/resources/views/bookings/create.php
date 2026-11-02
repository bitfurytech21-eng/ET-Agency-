<?php require __DIR__ . '/../layouts/dashboard.php'; ?>
<div class="portal-card" style="max-width: 500px; margin: 0 auto;">
    <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 1rem;">Book Mid-Term Suite</h2>
    <form method="POST">
        <div class="form-group">
            <label>Select Unit</label>
            <select name="property_id" class="form-control">
                <?php foreach (($units ?? []) as $u): ?>
                    <option value="<?= htmlspecialchars($u['unit_code']) ?>"><?= htmlspecialchars($u['title']) ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="form-group">
            <label>Move-in Date</label>
            <input type="date" name="check_in" class="form-control" required>
        </div>
        <button type="button" class="portal-btn" onclick="alert('Booking inquiry sent.');">Submit Stay Reservation</button>
    </form>
</div>
</body></html>
