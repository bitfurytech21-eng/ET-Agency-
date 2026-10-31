<?php
namespace App\Models;

class Notification {
    public ?int $id = null;
    public ?int $user_id = null;
    public ?int $admin_id = null;
    public string $title = '';
    public string $message = '';
    public string $type = 'info';
    public int $is_read = 0;
    public ?string $created_at = null;
}
