<?php
namespace App\Controllers;

use App\Middleware\AuthMiddleware;
use App\Repositories\UnitRepository;
use App\Repositories\TransactionRepository;
use App\Services\Payments\PaymentService;
use App\Helpers\Response;

class UnitController {
    public function index(): void {
        $user = AuthMiddleware::handle();
        $units = (new UnitRepository())->all();
        Response::view('units.index', ['units' => $units, 'title' => 'Lodging Units']);
    }

    public function purchase(): void {
        $user = AuthMiddleware::handle();
        Response::view('units.purchase', ['user' => $user, 'title' => 'Purchase Lodging Units']);
    }

    public function buy(): void {
        $user = AuthMiddleware::handle();
        $units = (int)($_POST['units'] ?? 0);
        $method = trim($_POST['payment_method'] ?? 'Corporate Wire');

        if ($units <= 0) {
            Response::json(['success' => false, 'message' => 'Units must be greater than 0'], 400);
        }

        $paymentService = new PaymentService();
        $result = $paymentService->purchaseUnits((int)$user['id'], $units, $method);
        Response::json($result);
    }

    public function history(): void {
        $user = AuthMiddleware::handle();
        $txs = (new TransactionRepository())->getForUser((int)$user['id']);
        Response::view('units.history', ['transactions' => $txs, 'title' => 'Unit Purchase History']);
    }
}
