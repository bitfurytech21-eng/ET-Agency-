# Easy Travel Lodging Platform

This repository was upgraded from a static marketing front-end into a production-oriented property rental platform foundation.

## Included

- Express API foundation for property and booking data
- Persistent local data layer with booking validation and overlap prevention
- Seeded property inventory from the existing site catalog
- Admin overview endpoint for operational metrics
- Environment structure for production settings

## Starting the API

```bash
npm run server
```

The API runs at:

- http://localhost:3001/api/health
- http://localhost:3001/api/properties
- http://localhost:3001/api/bookings
- http://localhost:3001/api/admin/overview

## Front-end development

```bash
npm run dev
```

## Production readiness notes

This code creates the essential backend foundation, but live production integrations such as Stripe, PayPal, AWeber, Acuity, Google Maps, Airbnb/Vrbo sync, and email delivery still require valid provider credentials and final environment configuration. The platform now has a real backend and data layer, but full payment and channel integrations remain credential-dependent.
