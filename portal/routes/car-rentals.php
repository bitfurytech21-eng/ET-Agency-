<?php
use App\Controllers\CarRentalController;
use App\Controllers\RentalBookingController;
use App\Controllers\Admin\CarRentalController as AdminCarRentalController;
use App\Controllers\Admin\VehicleInventoryController;
use App\Controllers\Admin\RentalBookingController as AdminRentalBookingController;
use App\Controllers\Admin\RentalPricingController;
use App\Controllers\Admin\VehicleCategoryController;
use App\Controllers\Admin\VehicleMaintenanceController;
use App\Controllers\Admin\RentalReportController;

// Customer Car Rental Routes
Router::get('/car-rentals', [CarRentalController::class, 'index']);
Router::get('/car-rentals/search', [CarRentalController::class, 'search']);
Router::get('/car-rentals/vehicle/{slug}', [CarRentalController::class, 'show']);
Router::get('/car-rentals/booking', [RentalBookingController::class, 'createForm']);
Router::post('/car-rentals/booking', [RentalBookingController::class, 'store']);
Router::get('/car-rentals/confirmation', [RentalBookingController::class, 'confirmation']);
Router::get('/car-rentals/my-rentals', [RentalBookingController::class, 'myRentals']);

// Admin Car Rental Management Routes
Router::get('/admin/car-rentals', [AdminCarRentalController::class, 'index']);
Router::get('/admin/car-rentals/vehicles', [VehicleInventoryController::class, 'index']);
Router::get('/admin/car-rentals/vehicles/create', [VehicleInventoryController::class, 'create']);
Router::post('/admin/car-rentals/vehicles/create', [VehicleInventoryController::class, 'store']);
Router::get('/admin/car-rentals/bookings', [AdminRentalBookingController::class, 'index']);
Router::post('/admin/car-rentals/bookings/status', [AdminRentalBookingController::class, 'updateStatus']);
Router::get('/admin/car-rentals/categories', [VehicleCategoryController::class, 'index']);
Router::get('/admin/car-rentals/pricing', [RentalPricingController::class, 'index']);
Router::get('/admin/car-rentals/maintenance', [VehicleMaintenanceController::class, 'index']);
Router::get('/admin/car-rentals/reports', [RentalReportController::class, 'index']);
