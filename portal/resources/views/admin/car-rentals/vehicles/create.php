<?php
$pageTitle = "Add New Vehicle | Admin";
require_once __DIR__ . '/../../../layouts/admin.php';
?>

<div class="container my-4" style="max-width: 720px;">
    <div class="card p-4 border-subtle shadow-sm bg-white">
        <h3 class="fw-bold text-navy mb-3">Add Fleet Vehicle</h3>

        <form action="/portal/admin/car-rentals/vehicles/create" method="POST">
            <div class="row g-3">
                <div class="col-12">
                    <label class="form-label font-mono small fw-semibold">Vehicle Display Name</label>
                    <input type="text" name="name" class="form-control" placeholder="Cadillac Escalade ESV V-Series" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label font-mono small fw-semibold">Brand</label>
                    <input type="text" name="brand" class="form-control" placeholder="Cadillac" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label font-mono small fw-semibold">Model</label>
                    <input type="text" name="model" class="form-control" placeholder="Escalade ESV" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label font-mono small fw-semibold">Daily Rate ($ USD)</label>
                    <input type="number" step="0.01" name="daily_rate" class="form-control" value="295.00" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label font-mono small fw-semibold">Horsepower</label>
                    <input type="number" name="horsepower" class="form-control" value="682" required>
                </div>
                <div class="col-12 mt-4">
                    <button type="submit" class="btn btn-primary btn-lg w-100">
                        Save Vehicle To Fleet
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../../../layouts/footer.php'; ?>
