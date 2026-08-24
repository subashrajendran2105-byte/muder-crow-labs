# Murder Crow #Labs

Murder Crow #Labs landing page with:

- Murder Crow visual system and interactive crow micro-animation
- Editable banner slot near the top
- Animated 4-phase / 16-session roadmap
- Old marketing vs Murder Crow #Labs comparison
- Career outcomes and indicative salary ranges
- Community 10 → 2 free-seat promise
- Optional 1-to-1, Graphic Design and UI/UX add-ons
- HubSpot embedded reservation form
- Razorpay Standard Checkout for the ₹10 reservation
- Vercel serverless order creation and payment-signature verification

## Local

```bash
npm install
vercel dev
```

Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in the Vercel project environment. Never expose the secret in frontend code or GitHub.

## HubSpot

The reservation modal uses the supplied HubSpot form:

- Portal: `247139484`
- Form: `eb9a7aa6-e191-4f23-913d-cf24348cb7c2`
- Region: `na2`

## Banner

Replace the contents of the `#banner` slot with the final Murder Crow banner artwork when ready. The surrounding layout does not need to change.
