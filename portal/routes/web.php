<?php
use App\Controllers\Auth\LoginController;
use App\Controllers\Auth\RegisterController;
use App\Controllers\Auth\PasswordController;
use App\Controllers\DashboardController;
use App\Controllers\BookingController;
use App\Controllers\UnitController;
use App\Controllers\VehicleController;
use App\Controllers\PaymentController;

// Public & Auth
Router::get('/', [DashboardController::class, 'index']);
Router::get('/login', [LoginController::class, 'showLoginForm']);
Router::post('/login', [LoginController::class, 'login']);
Router::get('/register', [RegisterController::class, 'showRegistrationForm']);
Router::post('/register', [RegisterController::class, 'register']);
Router::get('/logout', [LoginController::class, 'logout']);
Router::get('/forgot-password', [PasswordController::class, 'showForgotForm']);
Router::post('/forgot-password', [PasswordController::class, 'sendResetLink']);

// Customer Dashboard
Router::get('/dashboard', [DashboardController::class, 'index']);
Router::get('/profile', [DashboardController::class, 'profile']);
Router::get('/bookings', [BookingController::class, 'index']);
Router::get('/bookings/create', [BookingController::class, 'create']);
Router::get('/bookings/{id}', [BookingController::class, 'details']);
Router::get('/transactions', [DashboardController::class, 'transactions']);
Router::get('/notifications', [DashboardController::class, 'notifications']);

// Units
Router::get('/units', [UnitController::class, 'index']);
Router::get('/units/purchase', [UnitController::class, 'purchase']);
Router::post('/units/purchase', [UnitController::class, 'buy']);
Router::get('/units/history', [UnitController::class, 'history']);

// Vehicles
Router::get('/vehicles', [VehicleController::class, 'index']);
Router::get('/vehicles/{slug}', [VehicleController::class, 'details']);
Router::get('/vehicles/{slug}/book', [VehicleController::class, 'booking']);

// Payments & Internal Balance Command
Router::get('/payments/manual', [PaymentController::class, 'manualPayment']);
Router::post('/payments/manual', [PaymentController::class, 'submitManualPayment']);
Router::get('/payments/bank-details', [PaymentController::class, 'bankDetails']);
Router::get('/payments/upload-proof', [PaymentController::class, 'uploadProof']);
Router::get('/payments/history', [PaymentController::class, 'paymentHistory']);
Router::get('/payments/{id}/status', [PaymentController::class, 'paymentStatus']);
// Internal command: pay from balance
Router::post('/payments/pay-from-balance', [PaymentController::class, 'payFromBalance']);
