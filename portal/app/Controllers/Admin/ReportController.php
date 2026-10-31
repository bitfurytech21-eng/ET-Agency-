<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Services\Payments\PaymentReconciliationService;
use App\Helpers\Response;
class ReportController {
    public function index(): void {
        AdminMiddleware::handle();
        Response::view('admin.reports.index', ['title' => 'Financial Reports']);
    }
    public function bookings(): void {
        AdminMiddleware::handle();
        Response::view('admin.reports.bookings', ['title' => 'Booking Occupancy Report']);
    }
    public function revenue(): void {
        AdminMiddleware::handle();
        Response::view('admin.reports.revenue', ['title' => 'Revenue Report']);
    }
    public function reconciliation(): void {
        AdminMiddleware::handle();
        $summary = PaymentReconciliationService::getReconciliationSummary();
        Response::view('admin.reports.reconciliation', ['summary' => $summary, 'title' => 'Payment Reconciliation']);
    }
}
