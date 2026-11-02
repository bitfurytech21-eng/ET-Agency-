<?php
namespace App\Helpers;

class Validator {
    private array $errors = [];

    public function validate(array $data, array $rules): bool {
        $this->errors = [];
        foreach ($rules as $field => $fieldRules) {
            $val = $data[$field] ?? null;
            $ruleList = is_string($fieldRules) ? explode('|', $fieldRules) : $fieldRules;
            foreach ($ruleList as $r) {
                if ($r === 'required' && (is_null($val) || $val === '')) {
                    $this->errors[$field] = ucfirst($field) . " is required.";
                }
                if ($r === 'email' && !empty($val) && !filter_var($val, FILTER_VALIDATE_EMAIL)) {
                    $this->errors[$field] = ucfirst($field) . " must be a valid email address.";
                }
                if (str_starts_with($r, 'min:')) {
                    $min = (int)substr($r, 4);
                    if (is_string($val) && strlen($val) < $min) {
                        $this->errors[$field] = ucfirst($field) . " must be at least {$min} characters.";
                    }
                }
                if ($r === 'numeric' && !empty($val) && !is_numeric($val)) {
                    $this->errors[$field] = ucfirst($field) . " must be numeric.";
                }
            }
        }
        return empty($this->errors);
    }

    public function getErrors(): array {
        return $this->errors;
    }
}
