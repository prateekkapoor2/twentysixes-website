TWENTY SIXES MEDIA WEBSITE — VERSION 2 / DIRECTION 03 IDENTITY

This package deliberately preserves Version 2's original visual design and page structure. It is a static HTML/CSS/JS site.

BRAND
- Name: Twenty Sixes Media (always spell out the full name; do not abbreviate to 26s).
- Descriptor: Independent Creative & Content Studio.
- Tagline: Creators. Brands. Culture.
- Primary compact logo: assets/twentysixes-direction03.svg.
- Full signature with descriptor and tagline: assets/twentysixes-direction03-full.svg.
- PNG concept preview: assets/twentysixes-direction03-preview.png.

OWNED MEDIA
- Sensex.Senseless remains the flagship owned media property and primary feature.
- CricDoosra is presented as the secondary owned media property and links to https://cricdoosra.com/. Its supplied transparent PNG logo is used unchanged at assets/cricdoosra-logo.png in place of the former CD monogram.

PUBLIC CONTACT
- hello@twentysixes.com is the only email address displayed or used by the website. It can be configured as a Google Workspace alias to the primary mailbox.
- No founder-private email is exposed.

CONTACT FORM LIMITATION
The form submits directly to Formspree endpoint xgakzgqq and is configured to forward submissions to hello@twentysixes.com. Confirm the Formspree recipient and notification settings in the Formspree dashboard before launch.

CALENDLY
The contact section displays one external Calendly booking link: https://calendly.com/pk-twentysixes/30min. The calendar itself is not embedded.

DEPLOYMENT
Upload the CONTENTS of the twentysixes_rebuild folder to the static host's document root. Do not upload the enclosing ZIP as the website. Cloudflare Pages can deploy this static folder via a GitHub repository; no paid web hosting plan is required for this static site.

PRE-LAUNCH CHECKS
1. Connect twentysixes.com to Cloudflare Pages and enable HTTPS.
2. Preserve Google Workspace MX, SPF and DKIM records when moving DNS to Cloudflare.
3. Test navigation, mobile menu, all email links, enquiry validation and successful Formspree delivery, Calendly link and privacy page.
4. Supply the real Calendly URL if booking should be enabled.
5. Verify all public social links and business/legal details before launch.

POSITIONING
Twenty Sixes Media is an independent creative and content studio for brands, founders and agencies. It develops content strategy and creative, founder/executive content, white-label agency execution, brand campaigns and original formats. It also builds owned media properties. Sensex.Senseless and CricDoosra demonstrate the owned-media side of the business; they are not presented as client case studies.


V2.1 UPDATE
- Adjusted hero typography, vertical spacing and artwork positioning to prevent the first-screen composition from feeling cut off on common desktop and mobile viewports.
- Added restrained CSS-only motion to the orbit artwork, respecting prefers-reduced-motion.
- Sensex.Senseless and CricDoosra remain OWNED MEDIA PROPERTIES, not client case studies. Do not present them as clients.

V3 CONTACT + SERVICE INTERACTIONS
- Five service rows are interactive and open accessible editorial detail overlays.
- Each overlay contains a short explanation, deliverables and a three-step process, with CSS-generated graphic artwork.
- Enquiry form uses Formspree with asynchronous submission, status feedback and a honeypot field.
