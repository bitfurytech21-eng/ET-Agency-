<?php
namespace App\Models;

class PaymentProof {
    public ?int $id = null;
    public int $manual_payment_id = 0;
    public string $file_path = '';
    public string $original_filename = '';
    public ?string $mime_type = null;
    public ?int $file_size = null;
    public ?string $uploaded_at = null;
}
