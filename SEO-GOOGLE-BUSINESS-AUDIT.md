# Next Print NY — SEO and Google Business Profile Audit

Official website: https://www.nextprintnyc.com/

## Business information consistency

| Data | Found on the website | Recommended Google Business value | Status |
|---|---|---|---|
| Business name | Next Print NY | Next Print NY | Consistent |
| Primary category | Printing is the principal visible service; no GBP category is stored in the code | Confirm the most accurate available printing category in GBP | Manual confirmation required |
| Secondary categories | Signs, custom apparel, websites and business support are visible | Add only categories that match services actually offered and GBP options | Manual confirmation required |
| Phone | 239 333 7935 | 239 333 7935 | Corrected and consistent |
| Website | https://www.nextprintnyc.com/ | https://www.nextprintnyc.com/ | Canonical domain configured |
| Address or service area | 1510 Gates Ave, Brooklyn, NY 11237; New York area served | 1510 Gates Ave, Brooklyn, NY 11237 | Confirm storefront eligibility and formatting in GBP |
| Business hours | Not confirmed in the project | Do not add until the owner confirms operating hours | Missing; manual action required |
| Email | nextprintny@gmail.com | nextprintny@gmail.com | Corrected and consistent on audited pages |
| Description | Printing, custom signs, banners, business cards, flyers, websites and marketing solutions | Use a natural GBP description based on the verified services | Draft manually in GBP |
| Services | Printing, signs, banners, custom apparel, websites and business support | Select only services currently provided | Manual review required |
| Logo | `/assets/logo.png` and `/assets/logo-clear.svg` | Upload the current Next Print NY logo | Available |
| Cover image | `/assets/logohero.png` is the verified social image | Choose a current, high-quality storefront or product image | Manual selection recommended |
| Social profiles | No confirmed social profile URLs were found | Add only official profiles controlled by the business | Missing; manual action required |

## A. Code changes completed

- Added unique titles, descriptions, canonicals, robots directives, Open Graph and Twitter Card metadata to public pages.
- Added `noindex, follow` to operational and private HTML pages without blocking their crawling.
- Added LocalBusiness and WebSite JSON-LD to the homepage using only confirmed information.
- Added a public-only sitemap and robots.txt.
- Added a real noindex 404 page and a canonical-domain redirect for the non-www host.
- Corrected the conflicting phone and email in `print-products-upload.html`.
- Made the primary contact-page phone and email links clickable.

## B. Manual Google Business Profile actions

1. Confirm the primary and secondary categories using the available GBP category list.
2. Confirm whether the address should appear publicly as a staffed storefront or whether a service area is required.
3. Add verified business hours; none were confirmed in the repository.
4. Upload the current logo and a suitable cover photograph.
5. Review the GBP business description and service list against actual current offerings.
6. Add only official social profiles owned by Next Print NY.

## C. Manual Google Search Console actions

1. Verify the `https://www.nextprintnyc.com/` domain property.
2. Submit `https://www.nextprintnyc.com/sitemap.xml` after deployment and review its processing status.
3. Inspect the homepage and request indexing after the approved changes are deployed.
4. Use URL Inspection to confirm checkout, payment, tracking, invoice, admin and account pages report `noindex` after Google recrawls them.
5. Review Pages, Core Web Vitals and Enhancements reports for issues that require production data.
6. Monitor which URL Google selects as canonical for the homepage and investigate any remaining alternative-domain backlinks.

## Route classification

- Public/indexable: homepage, printing, custom T-shirts, services, consulting, multiservices, about, contact, testimonials, membership, privacy, terms and websites.
- Functional/private/noindex: admin, payments, checkouts, order workflow, tracking, invoice, login, account dashboard, upload/editor/designer steps, quote/support placeholders and website purchase portals.
- Obsolete or broken routes: none removed. Unknown URLs are handled by the noindex 404 page rather than redirected to the homepage.
