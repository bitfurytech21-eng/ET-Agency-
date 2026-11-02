<?php require __DIR__ . '/../layouts/main.php'; ?>
<div class="portal-card" style="max-width: 500px; margin: 0 auto;">
    <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem;">Reserve <?= htmlspecialchars($vehicle['name'] ?? 'Car') ?></h2>
    <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem;">Pickup in El Dorado Hills, CA, SMF Airport terminal curb, or directly delivered to your lodging unit.</p>
    <form method="POST" action="/portal/bookings/create">
        <div class="form-group">
            <label>Pickup Date</label>
            <input type="date" name="check_in" class="form-control" required>
        </div>
        <div class="form-group">
            <label>Return Date</label>
            <input type="date" name="check_out" class="form-control" required>
        </div>
        <div class="form-group">
            <label>Delivery Preference</label>
            <select name="delivery" class="form-control">
                <option>Delivered to Easy Travel Lodging Unit (El Dorado Hills, CA)</option>
                <option>Pickup at SMF Airport Concierge Curb</option>
            </select>
        </div>
        <button type="button" class="portal-btn" style="width: 100%;" onclick="alert('Reservation request submitted! Our concierge will contact you with booking confirmation.'); window.location.href='/portal/vehicles';">Submit Vehicle Reservation</button>
    </form>
</div>
</body></html>
