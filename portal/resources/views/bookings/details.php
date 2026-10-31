<?php require __DIR__ . '/../layouts/dashboard.php'; ?>
<div class="portal-card" style="max-width: 600px; margin: 0 auto;">
    <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 1rem;">Booking Details #<?= htmlspecialchars($booking['booking_reference'] ?? '') ?></h2>
    <p><strong>Property:</strong> <?= htmlspecialchars($booking['property_id'] ?? '') ?></p>
    <p><strong>Guest:</strong> <?= htmlspecialchars($booking['guest_name'] ?? '') ?></p>
    <p><strong>Dates:</strong> <?= htmlspecialchars($booking['check_in'] ?? '') ?> to <?= htmlspecialchars($booking['check_out'] ?? '') ?></p>
    <p><strong>Status:</strong> <?= htmlspecialchars($booking['status'] ?? '') ?></p>
</div>
</body></html>
