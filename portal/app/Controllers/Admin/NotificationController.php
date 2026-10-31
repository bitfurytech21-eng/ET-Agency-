<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Helpers\Response;
class NotificationController {
    public function index(): void {
        AdminMiddleware::handle();
        Response::view('admin.notifications.index', ['title' => 'System Notifications']);
    }
}
