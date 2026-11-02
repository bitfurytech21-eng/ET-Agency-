<?php
use App\Helpers\Response;
use App\Repositories\UserRepository;
use App\Repositories\BookingRepository;
use App\Repositories\VehicleRepository;
use App\Repositories\UnitRepository;

Router::get('/api/health', function() {
    Response::json(['status' => 'ok', 'portal' => 'Easy Travel Lodging PHP Portal', 'timestamp' => time()]);
});

Router::get('/api/units', function() {
    Response::json((new UnitRepository())->all());
});

Router::get('/api/vehicles', function() {
    Response::json((new VehicleRepository())->all());
});
