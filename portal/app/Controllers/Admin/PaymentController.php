<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Repositories\ManualPaymentRepository;
use App\Helpers\Response;
class PaymentController {
    public function index(): void {
        AdminMiddleware::handle();
        Response::view('admin.payments.index', ['payments' => (new ManualPaymentRepository())->all(), 'title' => 'Payments Management']);
    }
}
