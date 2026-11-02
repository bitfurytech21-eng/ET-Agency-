<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Repositories\UserRepository;
use App\Helpers\Response;
class CustomerController {
    public function index(): void {
        AdminMiddleware::handle();
        $users = (new UserRepository())->all();
        Response::view('admin.customers.index', ['customers' => $users, 'title' => 'Customer Management']);
    }
    public function details(int $id): void {
        AdminMiddleware::handle();
        $customer = (new UserRepository())->findById($id);
        Response::view('admin.customers.details', ['customer' => $customer, 'title' => 'Customer Details']);
    }
    public function edit(int $id): void {
        AdminMiddleware::handle();
        $customer = (new UserRepository())->findById($id);
        Response::view('admin.customers.edit', ['customer' => $customer, 'title' => 'Edit Customer']);
    }
}
