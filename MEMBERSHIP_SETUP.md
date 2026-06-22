# Next Print NY Membership Setup

The membership experience is implemented in the website. Complete these production steps before accepting subscribers.

## 1. Create the Supabase tables

Open the Supabase SQL Editor and run `supabase-membership.sql` once. It creates:

- Member profiles and membership records
- Saved editable designs
- Private member files
- The private `member-assets` storage bucket

## 2. Configure Vercel environment variables

Keep the existing PayPal and Supabase variables and add:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
PAYPAL_ENV=live
PAYPAL_WEBHOOK_ID
PAYPAL_MEMBERSHIP_PLAN_ID
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `PAYPAL_CLIENT_SECRET` in browser code.

## 3. Create the PayPal membership plan

In PayPal, create a subscription product and a recurring billing plan for `$30.00 USD` every month. Put the resulting plan ID in `PAYPAL_MEMBERSHIP_PLAN_ID` in Vercel.

The checkout starts from `/membership.html` or the member dashboard. The return URL confirms the subscription through `/api/member`.

## 4. Add PayPal webhook events

Use this production webhook URL:

```text
https://www.nextprintnyc.com/api/paypal?action=webhook
```

Subscribe to these events:

```text
BILLING.SUBSCRIPTION.ACTIVATED
BILLING.SUBSCRIPTION.UPDATED
BILLING.SUBSCRIPTION.SUSPENDED
BILLING.SUBSCRIPTION.CANCELLED
BILLING.SUBSCRIPTION.EXPIRED
```

Copy the webhook ID into `PAYPAL_WEBHOOK_ID`.

## 5. Supabase authentication settings

Add `https://www.nextprintnyc.com` as the Site URL and an allowed redirect URL in Supabase Authentication. Enable email/password authentication. Decide whether users must confirm their email before signing in.

## 6. Deploy and test

Test with a PayPal sandbox plan first, then switch to live credentials. Verify:

1. Registration and sign in
2. Monthly membership checkout
3. Dashboard membership status
4. Saving and reopening designs
5. Protected file downloads
6. Reordering a previous order

Member-specific product prices can be added later without changing the authentication, dashboard, or saved-design structure.
