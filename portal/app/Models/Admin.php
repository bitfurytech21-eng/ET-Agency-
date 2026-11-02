<?php
namespace App\Models;

class Admin {
    public ?int $id = null;
    public string $name = '';
    public string $email = '';
    public string $password_hash = '';
    public string $role = 'admin';
    public string $permissions = 'all';
    public string $status = 'active';
    public ?string $created_at = null;
}
