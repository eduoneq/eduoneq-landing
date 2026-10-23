# Enterprise AX page maintenance

Route: `/ax/`. Positioning: company-led AI system design and implementation, alongside product development and institution education.

## Source and evidence boundary

- The user supplied the EDUONEQ OS dashboard screenshot on 2026-10-23 and requested using one or two screenshots on the company site for enterprise AX/workflow automation inquiries.
- The supplied dashboard image is published unchanged. It shows navigation, collection/processing/review status, projects and runner configuration plans. It is not a certification of integrations, transaction processing, automation execution or performance.
- Direct source inspection reached an authentication screen. No credentials were read or created; no new authenticated screenshot was claimed.
- Only the attached dashboard screenshot is used. No internal site URL, customer files, task contents, credentials or private financial details are included in page copy.
- Describe the image as a self-built system view. Do not claim customer deployments, operating scale, completion rates, cost savings or live external integrations from the image.
- Areas under “WHAT WE BUILD” are proposed construction scopes, to be agreed with the customer. Provider connections, data access, permission model, hosting, schedule and price require project scoping.

## Inquiry behavior

The builder opens a user-reviewed email draft addressed to the existing public company email. It does not send email or submit/store form fields to a server. Do not use submission-success wording.

## Integration

- Shared captured React navigation, both static HTML shells, standalone education navigation and the home-page showcase link to `/ax/`.
- The existing main-link capture handler must load `/ax/` as a full document because it is outside the captured React route manifest.
- Reuse the existing service-page CSS foundation and shared brand tokens. AX-specific rules and mail builder are scoped under `eduoneq-assets/ax/`.
- Verify modified JS explicitly, validate the repository, and inspect desktop and mobile before release.

- The shared header switches to its mobile menu below 1200px so the additional AX item does not wrap at tablet/small desktop widths.
