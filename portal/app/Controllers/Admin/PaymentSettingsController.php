<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Repositories\PaymentAccountRepository;
use App\Helpers\Response;
class PaymentSettingsController {
    public function index(): void {
        AdminMiddleware::handle();
        Response::view('admin.payments.payment-accounts', ['accounts' => (new PaymentAccountRepository())->getActive(), 'title' => 'Payment Accounts']);
    }
}
