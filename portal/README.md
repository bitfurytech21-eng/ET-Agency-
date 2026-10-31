# Easy Travel Lodging - Customer & Admin Portal

A complete, production-grade PHP MVC application for Easy Travel Lodging mid-term rentals, client dashboards, unit purchasing, vehicle rentals, manual wire verification, and internal balance checkout commands.

## Architecture

```
portal/
├── app/
│   ├── Config/
│   ├── Controllers/
│   │   ├── Auth/
│   │   ├── Admin/
│   │   ├── DashboardController.php
│   │   ├── BookingController.php
│   │   ├── UnitController.php
│   │   ├── VehicleController.php
│   │   └── PaymentController.php
│   ├── Middleware/
│   ├── Models/
│   ├── Repositories/
│   ├── Services/
│   │   ├── Payments/
│   │   ├── Email/
│   │   ├── Inventory/
│   │   └── BookingService.php
│   └── Helpers/
├── bootstrap/
├── config/
├── database/
│   ├── schema.sql
│   ├── migrations/
│   └── seeders/
├── public/
│   ├── index.php
│   └── assets/
├── resources/
│   └── views/
├── routes/
├── storage/
└── tests/
```

## Features

1. **Client Dashboard**: Units balance tracking, unit purchase packages ($100/unit), reservation records.
2. **Internal Command Checkout**: Settle bookings directly using customer units balance via internal command execution.
3. **American Vehicle Rentals**: Authentic US vehicles with 3D views, specs, and reservations.
4. **Manual Wire / ACH Payments**: Submission of wire notices, receipts, and admin verification workflow.
5. **Administrative Control Center**: User management, bookings, reconciliation reports, and payment approval.
