<?php
$pageTitle = "Reserve Vehicle | " . htmlspecialchars($vehicle['name']);
require_once __DIR__ . '/../layouts/main.php';
?>

<link rel="stylesheet" href="/assets/css/car-rental.css">
<link rel="stylesheet" href="/assets/css/rental-booking.css">
<script src="/assets/js/rental-calendar.js" defer></script>
<script src="/assets/js/rental-booking.js" defer></script>

<div class="container my-4" style="max-width: 960px;">
    <div class="mb-3">
        <a href="/portal/car-rentals/vehicle/<?= $vehicle['slug'] ?>" class="text-decoration-none text-muted">
            <i class="bi bi-arrow-left me-1"></i> Return to Vehicle Specification
        </a>
    </div>

    <div class="row g-4">
        <!-- Form Column -->
        <div class="col-lg-7">
            <div class="card p-4 border-subtle shadow-sm bg-white">
                <h3 class="fw-bold text-navy mb-3"><span class="checkout-step-badge">1</span> Reservation Details</h3>

                <?php if (!empty($_SESSION['error'])): ?>
                    <div class="alert alert-danger alert-dismissible fade show">
                        <?= htmlspecialchars($_SESSION['error']) ?>
                        <?php unset($_SESSION['error']); ?>
                    </div>
                <?php endif; ?>

                <form id="rental-checkout-form" action="/portal/car-rentals/booking" method="POST">
                    <input type="hidden" name="vehicle_id" value="<?= $vehicle['id'] ?>">

                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label font-mono small fw-semibold">Pickup Date</label>
                            <input type="date" id="pickup_date" name="pickup_date" class="form-control" data-daily-rate="<?= $vehicle['daily_rate'] ?>" value="<?= date('Y-m-d') ?>" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label font-mono small fw-semibold">Return Date</label>
                            <input type="date" id="return_date" name="return_date" class="form-control" value="<?= date('Y-m-d', strtotime('+3 days')) ?>" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label font-mono small fw-semibold">Pickup Location</label>
                            <select name="pickup_location" class="form-select">
                                <option value="Executive Hub Terminal (SFO)">Executive Hub Terminal (SFO Airport)</option>
                                <option value="Executive Hub Terminal (JFK)">Executive Hub Terminal (JFK Airport)</option>
                                <option value="Executive Hub Terminal (LAX)">Executive Hub Terminal (LAX Airport)</option>
                                <option value="Residence Concierge Dropoff">Residence Concierge Private Delivery</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label font-mono small fw-semibold">Return Location</label>
                            <select name="return_location" class="form-select">
                                <option value="Executive Hub Terminal (SFO)">Executive Hub Terminal (SFO Airport)</option>
                                <option value="Executive Hub Terminal (JFK)">Executive Hub Terminal (JFK Airport)</option>
                                <option value="Executive Hub Terminal (LAX)">Executive Hub Terminal (LAX Airport)</option>
                                <option value="Residence Concierge Pick-up">Residence Concierge Pick-up</option>
                            </select>
                        </div>

                        <div class="col-12">
                            <label class="form-label font-mono small fw-semibold">Special Delivery Instructions / Driver Notes</label>
                            <textarea name="notes" class="form-control" rows="3" placeholder="Flight details, driver age, custom arrival time..."></textarea>
                        </div>

                        <div class="col-12 mt-4">
                            <div class="p-3 bg-offwhite rounded-md border-subtle">
                                <div class="d-flex align-items-center gap-3">
                                    <i class="bi bi-shield-check fs-2 text-success"></i>
                                    <div>
                                        <h6 class="fw-bold mb-0 text-navy">Corporate Units Auto-Settlement</h6>
                                        <small class="text-muted">Payment will be deducted directly from your available dashboard units balance upon confirmation.</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 mt-4">
                            <button type="submit" class="btn btn-primary btn-lg w-100 shadow-sm py-3 fw-bold">
                                Confirm & Pay From Balance <i class="bi bi-check-circle ms-2"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Order Summary Column -->
        <div class="col-lg-5">
            <div class="booking-summary-card">
                <h4 class="fw-bold text-navy mb-3">Reservation Summary</h4>
                <div class="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
                    <div style="width: 70px; height: 50px; background: #0f172a; border-radius: 8px;" class="d-flex align-items-center justify-content-center text-white">
                        <i class="bi bi-car-front fs-4"></i>
                    </div>
                    <div>
                        <h6 class="fw-bold mb-0 text-navy"><?= htmlspecialchars($vehicle['name']) ?></h6>
                        <span class="text-muted small"><?= htmlspecialchars($vehicle['brand']) ?> • <?= $vehicle['horsepower'] ?> HP</span>
                    </div>
                </div>

                <div class="price-line">
                    <span>Duration</span>
                    <strong id="calc-days" class="text-navy">3 Days</strong>
                </div>
                <div class="price-line">
                    <span>Daily Rate</span>
                    <span>$<?= number_format($vehicle['daily_rate'], 2) ?></span>
                </div>
                <div class="price-line">
                    <span>Subtotal</span>
                    <strong id="calc-subtotal" class="text-navy">$<?= number_format($vehicle['daily_rate'] * 3, 2) ?></strong>
                </div>
                <div class="price-line">
                    <span>Airport Fee & Insurance (12%)</span>
                    <span>$<?= number_format($vehicle['daily_rate'] * 3 * 0.12, 2) ?></span>
                </div>
                <div class="price-line total">
                    <span>Total Amount</span>
                    <span id="calc-total">$<?= number_format($vehicle['daily_rate'] * 3 * 1.12, 2) ?></span>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
