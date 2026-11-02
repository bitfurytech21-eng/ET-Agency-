<?php
namespace App\Controllers\Admin;
use App\Middleware\AdminMiddleware;
use App\Helpers\Response;
class SettingsController {
    public function index(): void {
        AdminMiddleware::handle();
        Response::view('admin.settings.index', ['title' => 'Platform Settings']);
    }
}
