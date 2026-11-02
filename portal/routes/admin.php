<?php
use App\Controllers\Admin\DashboardController;
use App\Controllers\Admin\CustomerController;
use App\Controllers\Admin\BookingController;
use App\Controllers\Admin\UnitController;
use App\Controllers\Admin\VehicleController;
use App\Controllers\Admin\TransactionController;
use App\Controllers\Admin\PaymentController;
use App\Controllers\Admin\ManualPaymentController;
use App\Controllers\Admin\PaymentSettingsController;
use App\Controllers\Admin\ReportController;
use App\Controllers\Admin\NotificationController;
use App\Controllers\Admin\StaffController;
use App\Controllers\Admin\SettingsController;

Router::get('/admin/login', [DashboardController::class, 'showLoginForm']);
Router::post('/admin/login', [DashboardController::class, 'login']);
Router::get('/admin/logout', [DashboardController::class, 'logout']);

Router::get('/admin', [DashboardController::class, 'index']);
Router::get('/admin/dashboard', [DashboardController::class, 'index']);

Router::get('/admin/customers', [CustomerController::class, 'index']);
Router::get('/admin/customers/{id}', [CustomerController::class, 'details']);
Router::get('/admin/customers/{id}/edit', [CustomerController::class, 'edit']);

Router::get('/admin/bookings', [BookingController::class, 'index']);
Router::get('/admin/bookings/pending', [BookingController::class, 'pending']);
Router::get('/admin/bookings/{id}', [BookingController::class, 'details']);

Router::get('/admin/units', [UnitController::class, 'index']);
Router::get('/admin/units/purchases', [UnitController::class, 'purchases']);
Router::get('/admin/units/allocations', [UnitController::class, 'allocations']);

Router::get('/admin/vehicles', [VehicleController::class, 'index']);
Router::get('/admin/vehicles/create', [VehicleController::class, 'create']);
Router::get('/admin/vehicles/{id}/edit', [VehicleController::class, 'edit']);
Router::get('/admin/vehicles/availability', [VehicleController::class, 'availability']);

Router::get('/admin/payments', [PaymentController::class, 'index']);
Router::get('/admin/payments/manual-payments', [ManualPaymentController::class, 'index']);
Router::get('/admin/payments/pending', [ManualPaymentController::class, 'pending']);
Router::get('/admin/payments/{id}', [ManualPaymentController::class, 'details']);
Router::post('/admin/payments/verify', [ManualPaymentController::class, 'verify']);
Router::get('/admin/payments/verified', [ManualPaymentController::class, 'verified']);
Router::get('/admin/payments/rejected', [ManualPaymentController::class, 'rejected']);
Router::get('/admin/payments/accounts', [PaymentSettingsController::class, 'index']);

Router::get('/admin/transactions', [TransactionController::class, 'index']);
Router::get('/admin/transactions/{id}', [TransactionController::class, 'details']);

Router::get('/admin/reports', [ReportController::class, 'index']);
Router::get('/admin/reports/bookings', [ReportController::class, 'bookings']);
Router::get('/admin/reports/revenue', [ReportController::class, 'revenue']);
Router::get('/admin/reports/reconciliation', [ReportController::class, 'reconciliation']);

Router::get('/admin/notifications', [NotificationController::class, 'index']);
Router::get('/admin/staff', [StaffController::class, 'index']);
Router::get('/admin/staff/permissions', [StaffController::class, 'permissions']);
Router::get('/admin/settings', [SettingsController::class, 'index']);
Router::get('/admin/audit-logs', function() {
    \App\Helpers\Response::view('admin.audit-logs.index', ['title' => 'Audit Logs']);
});
