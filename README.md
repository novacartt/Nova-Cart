# EMI Store — Snapmint-inspired starter

This ZIP is a functional front-end prototype for an EMI-first shopping platform.

## Included
- Responsive storefront
- Product catalogue and search/sort
- Product details
- Cart
- EMI calculator
- EMI application form
- Camera/selfie permission flow
- Demo application storage/status
- Demo admin review (approve/reject)
- Account, orders, support and legal placeholder pages
- Firebase configuration template

## Important
This is NOT a production lending/BNPL system. Real KYC, credit decisions, loan servicing, payment collection, regulated lending, document storage and compliance require appropriate providers/partners and secure server-side implementation.

## Run
Open `index.html` in a browser or serve the folder with any static web server.

## Production next steps
1. Create Firebase project and configure Authentication/Firestore/Storage with strict security rules.
2. Move sensitive operations to a trusted backend/Cloud Functions.
3. Integrate a regulated lending/financing partner for eligibility and credit.
4. Integrate payment gateway and webhooks.
5. Add secure KYC provider rather than storing sensitive identifiers directly in browser localStorage.
6. Add merchant, settlement, returns, refunds, delivery and support integrations.
7. Replace legal placeholders with reviewed policies.
