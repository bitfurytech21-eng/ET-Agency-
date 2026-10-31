<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Helpers\Response;
class StaffController {
    public function index(): void {
        AdminMiddleware::handle();
        Response::view('admin.staff.index', ['title' => 'Staff & Administrative Access']);
    }
    public function permissions(): void {
        AdminMiddleware::handle();
        Response::view('admin.staff.permissions', ['title' => 'Role Permissions']);
    }
}
