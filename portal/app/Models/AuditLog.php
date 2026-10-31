<?php
namespace App\Models;

class AuditLog {
    public ?int $id = null;
    public string $actor_type = 'user';
    public ?int $actor_id = null;
    public string $action = '';
    public ?string $details = null;
    public ?string $ip_address = null;
    public ?string $created_at = null;
}
