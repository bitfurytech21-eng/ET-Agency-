<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Repositories\TransactionRepository;
use App\Helpers\Response;
class TransactionController {
    public function index(): void {
        AdminMiddleware::handle();
        Response::view('admin.transactions.index', ['transactions' => (new TransactionRepository())->all(), 'title' => 'Transactions Ledger']);
    }
    public function details(int $id): void {
        AdminMiddleware::handle();
        Response::view('admin.transactions.details', ['title' => 'Transaction Details']);
    }
}
