# MakeMyMarriage_API_Design_Document_v1

MakeMyMarriage

API Design &amp; Specification Document

Version 1.0  |  REST API  |  Node.js + Express.js + MongoDB

Status: Approved design baseline for V1 implementation

Purpose

This document defines the backend API contract for MakeMyMarriage, a wedding-management platform for couples, partners, organizers, and guests. It converts the approved product, architecture, and database decisions into implementation-ready REST endpoints and supporting API rules.

Table of Contents

1. API Goals and Scope

2. Technology &amp; Architecture

3. API Conventions

4. Authentication &amp; Authorization

5. Roles and Permissions

6. Endpoint Catalogue

7. Authentication APIs

8. Wedding &amp; Membership APIs

9. Event APIs

10. Guest, Invitation &amp; RSVP APIs

11. Task APIs

12. Vendor &amp; Budget APIs

13. Gallery APIs

14. Live Stream &amp; Website APIs

15. Notification APIs

16. Public APIs

17. File Uploads

18. Real-Time Socket.IO

19. Background Jobs

20. Validation, Errors &amp; Status Codes

21. Security, Rate Limits &amp; Logging

22. Transactions &amp; Idempotency

23. API ↔ Database Mapping

24. Testing Strategy

25. Swagger/OpenAPI Structure

26. Postman Structure

27. Backend API Folder Structure

28. API Flows

29. V1 Completion Checklist

1. API Goals and Scope

Provide a stable versioned REST API under /api/v1.

Support Owner, Partner, Organizer and public Guest workflows.

Keep wedding data isolated by weddingId and membership authorization.

Expose public invitation/website data only through safe projections.

Support real-time notifications and collaboration through Socket.IO.

Use BullMQ + Redis for asynchronous reminders, email, and scheduled jobs.

Provide OpenAPI/Swagger and Postman-ready contracts.

Keep the V1 API modular so future payments, marketplace, and Super Admin capabilities can be added without redesigning the core API.

V1 exclusions: vendor marketplace/booking/payments, guest accounts, guest photo uploads, admin dashboard, Canva-level editor, proprietary streaming, subscriptions, and advanced analytics.

2. Technology &amp; Architecture

Area

Decision

Runtime

Node.js

Framework

Express.js

API style

REST

Version

/api/v1

Database

MongoDB Atlas + Mongoose

Validation

Zod

Authentication

JWT access + refresh token

Access token

Authorization: Bearer &lt;token&gt;

Refresh token

Secure HTTP-only cookie with rotation

Real-time

Socket.IO

Jobs

BullMQ + Redis

Uploads

multipart/form-data → storage adapter → metadata in MongoDB

Maps

Google Maps

Live stream

Provider adapter; YouTube Live initially

API docs

OpenAPI/Swagger + Postman

Frontend

React + Vite

Deployment

Vercel frontend; Render/Railway backend; managed Redis; MongoDB Atlas; object storage

Client  |  | HTTPS /api/v1  vExpress API  ├── Auth / JWT middleware  ├── Validation middleware (Zod)  ├── Wedding authorization / permissions  ├── Controllers  ├── Services  ├── Mongoose Models  ├── Socket.IO  └── BullMQ producers       |       +--&gt; MongoDB Atlas       +--&gt; Redis       +--&gt; Email provider       +--&gt; Object storage       +--&gt; Google Maps       +--&gt; YouTube Live

3. API Conventions

Convention

Rule

Base URL

/api/v1

Content-Type

application/json unless file upload

Dates

ISO 8601; UTC in transport where practical

IDs

MongoDB ObjectId strings

Success envelope

{"success":true,"message":"...","data":{}}

Error envelope

{"success":false,"message":"...","error":{"code":"..."}}

Pagination

Cursor-based by default for large lists; page-based may be used for simple admin-like lists

Filtering

Query parameters

Sorting

sort and order query parameters

Search

Server-side search where useful

Empty update

PATCH with only changed fields

Delete

Soft delete for operational entities; explicit controlled/hybrid deletion for wedding/account data

4. Authentication &amp; Authorization

Registered users: Owner, Partner, Organizer. Guests do not create accounts.

4.1 Token model

Access token: short-lived JWT sent in Authorization: Bearer &lt;accessToken&gt;.

Refresh token: secure, HTTP-only, SameSite cookie; rotate on refresh.

Server-side refresh session/token record must be revocable for logout and compromise response.

Passwords are hashed; plaintext passwords and tokens are never logged.

Sensitive destructive actions require OTP/email confirmation.

4.2 Authorization flow

JWT → user → wedding → membership → role → permission → wedding status → allow/deny

4.3 Protected resource rules

Every wedding-scoped protected endpoint resolves the target wedding and checks active membership.

Owner has full wedding permissions.

Partner has broad management access but cannot perform protected ownership/destructive operations unless explicitly allowed.

Organizer can access only permissions granted in WeddingMembership.

Archived weddings are read-only except restore by Owner.

Removed memberships immediately lose access while historical work remains.

5. Roles and Permissions

Area

Typical actions

Wedding Settings

VIEW, EDIT

Events

VIEW, CREATE, EDIT, DELETE

Guests

VIEW, CREATE, EDIT, DELETE

Invitations

VIEW, CREATE, EDIT, DELETE, SEND

RSVP

VIEW, EDIT, REMIND

Tasks

VIEW, CREATE, EDIT, DELETE

Vendors

VIEW, CREATE, EDIT, DELETE

Budget

VIEW, CREATE, EDIT, DELETE

Gallery

VIEW, CREATE, EDIT, DELETE (couple upload only)

Live Stream

VIEW, CREATE, EDIT, DELETE

Notifications

VIEW, EDIT/READ

Membership/Organizers

Owner controlled; Partner limited

Permission strings should be normalized, for example: events.view, events.create, events.edit, events.delete.

6. Endpoint Catalogue

Method

Endpoint

Auth

Purpose

POST

/auth/register

Public

Register user

POST

/auth/verify-email

Public

Verify email

POST

/auth/resend-verification

Public

Resend verification

POST

/auth/login

Public

Login

POST

/auth/refresh

Refresh cookie

Rotate refresh token

POST

/auth/logout

Auth

Revoke refresh session

POST

/auth/forgot-password

Public

Start password reset

POST

/auth/verify-reset-otp

Public

Verify reset OTP

POST

/auth/reset-password

Public after OTP

Reset password

GET

/me

Auth

Current user

PATCH

/me

Auth

Update profile

DELETE

/me

Auth + confirmation

Delete account

POST

/weddings

Auth

Create wedding

GET

/weddings

Auth

List memberships

GET

/weddings/:weddingId

Wedding access

Get dashboard-safe wedding

PATCH

/weddings/:weddingId

Wedding edit

Update wedding

POST

/weddings/:weddingId/archive

Owner

Archive

POST

/weddings/:weddingId/restore

Owner

Restore

DELETE

/weddings/:weddingId

Owner + verification

Controlled deletion

GET

/weddings/:weddingId/members

Owner/authorized

List members

POST

/weddings/:weddingId/members/invite

Owner/authorized

Invite organizer/partner

PATCH

/weddings/:weddingId/members/:memberId

Owner/authorized

Change role/permissions

DELETE

/weddings/:weddingId/members/:memberId

Owner/authorized

Remove member

GET

/weddings/:weddingId/events

Events.view

List events

POST

/weddings/:weddingId/events

Events.create

Create event

GET

/weddings/:weddingId/events/:eventId

Events.view

Get event

PATCH

/weddings/:weddingId/events/:eventId

Events.edit

Update event

DELETE

/weddings/:weddingId/events/:eventId

Events.delete

Delete event

GET

/weddings/:weddingId/guests

Guests.view

List guests

POST

/weddings/:weddingId/guests

Guests.create

Create guest

GET

/weddings/:weddingId/guests/:guestId

Guests.view

Get guest

PATCH

/weddings/:weddingId/guests/:guestId

Guests.edit

Update guest

DELETE

/weddings/:weddingId/guests/:guestId

Guests.delete

Delete guest

POST

/weddings/:weddingId/invitations

Invitations.create

Create invitation

POST

/weddings/:weddingId/invitations/:id/send

Invitations.send

Send invitation

GET

/weddings/:weddingId/invitations

Invitations.view

List invitations

PATCH

/weddings/:weddingId/invitations/:id

Invitations.edit

Edit invitation

DELETE

/weddings/:weddingId/invitations/:id

Invitations.delete

Delete invitation

GET

/invite/:token

Public token

Get safe invitation

POST

/invite/:token/rsvp

Public token

Create RSVP

PATCH

/invite/:token/rsvp

Public token

Update RSVP

GET

/weddings/:weddingId/tasks

Tasks.view

List tasks

POST

/weddings/:weddingId/tasks

Tasks.create

Create task

PATCH

/weddings/:weddingId/tasks/:taskId

Tasks.edit

Update task

DELETE

/weddings/:weddingId/tasks/:taskId

Tasks.delete

Delete task

GET

/weddings/:weddingId/vendors

Vendors.view

List vendors

POST

/weddings/:weddingId/vendors

Vendors.create

Create vendor

PATCH

/weddings/:weddingId/vendors/:vendorId

Vendors.edit

Update vendor

DELETE

/weddings/:weddingId/vendors/:vendorId

Vendors.delete

Delete vendor

GET

/weddings/:weddingId/budget

Budget.view

List budget items/totals

POST

/weddings/:weddingId/budget

Budget.create

Create budget item

PATCH

/weddings/:weddingId/budget/:budgetId

Budget.edit

Update budget item

DELETE

/weddings/:weddingId/budget/:budgetId

Budget.delete

Delete budget item

GET

/weddings/:weddingId/gallery/albums

Gallery.view

List albums

POST

/weddings/:weddingId/gallery/albums

Gallery.create

Create album

POST

/weddings/:weddingId/gallery/albums/:albumId/photos

Gallery.create

Upload photos

PATCH

/weddings/:weddingId/gallery/albums/:albumId

Gallery.edit

Update album

DELETE

/weddings/:weddingId/gallery/photos/:photoId

Gallery.delete

Delete photo

GET

/weddings/:weddingId/livestream

LiveStream.view

Get stream

POST

/weddings/:weddingId/livestream

LiveStream.create

Create/configure stream

PATCH

/weddings/:weddingId/livestream/:id

LiveStream.edit

Update stream

DELETE

/weddings/:weddingId/livestream/:id

LiveStream.delete

Delete stream

GET

/weddings/:weddingId/website

Website.view

Get website settings

PATCH

/weddings/:weddingId/website

Website.edit

Update website

GET

/w/:slug

Public

Public website safe projection

GET

/notifications

Auth

List notifications

PATCH

/notifications/:id/read

Auth

Mark notification read

PATCH

/notifications/read-all

Auth

Mark all read

7. Authentication APIs

POST /auth/register

Auth: Public  |  Purpose: Create account

Request / response contract:

Request:{"name":"Priya","email":"priya@example.com","password":"StrongPassword123"}Response 201:{"success":true,"message":"Registration successful","data":{"user":{"id":"...","name":"Priya","email":"priya@example.com"},"emailVerificationRequired":true}}

POST /auth/verify-email

Auth: Public  |  Purpose: Verify email

Request / response contract:

Request: {"token":"verification-token"}Response 200: {"success":true,"message":"Email verified successfully","data":{}}

POST /auth/resend-verification

Auth: Public  |  Purpose: Resend verification

Request / response contract:

Request: {"email":"priya@example.com"}Response 200: {"success":true,"message":"Verification email sent","data":{}}

POST /auth/login

Auth: Public  |  Purpose: Authenticate

Request / response contract:

Request: {"email":"priya@example.com","password":"StrongPassword123"}Response 200:{"success":true,"message":"Login successful","data":{"accessToken":"&lt;jwt&gt;","user":{...}}}Refresh token is set as an HTTP-only cookie.

POST /auth/refresh

Auth: Refresh cookie  |  Purpose: Rotate refresh token

Request / response contract:

Response 200:{"success":true,"message":"Token refreshed","data":{"accessToken":"&lt;jwt&gt;"}}

POST /auth/logout

Auth: Auth  |  Purpose: Revoke refresh session

Request / response contract:

Response 204 with cleared refresh cookie.

POST /auth/forgot-password

Auth: Public  |  Purpose: Start reset

Request / response contract:

Request: {"email":"priya@example.com"}Response 200: {"success":true,"message":"If the account exists, reset instructions were sent","data":{}}

POST /auth/verify-reset-otp

Auth: Public  |  Purpose: Verify reset OTP

Request / response contract:

Request: {"email":"priya@example.com","otp":"123456"}Response 200: {"success":true,"message":"OTP verified","data":{"resetToken":"&lt;short-lived-token&gt;"}}

POST /auth/reset-password

Auth: Public + reset token  |  Purpose: Set new password

Request / response contract:

Request: {"resetToken":"...","newPassword":"NewStrongPassword123"}Response 200: {"success":true,"message":"Password reset successfully","data":{}}

GET /me

Auth: Auth  |  Purpose: Get current user

Request / response contract:

Response 200: {"success":true,"message":"Profile fetched","data":{"user":{...}}}

PATCH /me

Auth: Auth  |  Purpose: Update profile

Request / response contract:

Request: {"name":"Priya Sharma","profile":{"phone":"+91..."}} Response 200: {"success":true,"message":"Profile updated","data":{"user":{...}}}

DELETE /me

Auth: Auth + verification  |  Purpose: Delete account

Request / response contract:

Request: {"confirmation":"DELETE","otp":"123456"}Response 204.

8. Wedding &amp; Membership APIs

POST /weddingsRequest:{  "partner1Name":"Rahul",  "partner2Name":"Priya",  "weddingDate":"2027-02-14",  "venue":{"name":"Grand Hall","address":"...","mapData":{}},  "description":"Optional",  "theme":"Floral"}Response 201:{"success":true,"message":"Wedding created successfully","data":{"wedding":{...}}}

Creation creates the Wedding and Owner WeddingMembership. Couple photo remains optional.

PATCH /weddings/:weddingIdRequest: {"theme":"Royal","description":"Updated"}Response 200: {"success":true,"message":"Wedding updated successfully","data":{"wedding":{...}}}

POST /weddings/:weddingId/archiveResponse 200: {"success":true,"message":"Wedding archived successfully","data":{"status":"ARCHIVED"}}POST /weddings/:weddingId/restoreResponse 200: {"success":true,"message":"Wedding restored successfully","data":{"status":"ACTIVE"}}

POST /weddings/:weddingId/members/inviteRequest:{  "email":"organizer@example.com",  "role":"ORGANIZER",  "permissions":{    "events":["VIEW","EDIT"],    "guests":["VIEW","CREATE"],    "tasks":["VIEW","CREATE","EDIT"]  }}Response 201: {"success":true,"message":"Member invitation sent","data":{"membershipId":"..."}}

PATCH /weddings/:weddingId/members/:memberIdRequest: {"permissions":{"budget":["VIEW"]}}Response 200: {"success":true,"message":"Membership updated","data":{"membership":{...}}}DELETE /weddings/:weddingId/members/:memberIdResponse 204.

Protected membership operations generate AuditLog entries and immediately affect authorization.

9. Event APIs

POST /weddings/:weddingId/eventsRequest:{  "name":"Mehendi",  "date":"2027-02-12",  "time":{"start":"17:00","end":"20:00"},  "venue":{"name":"Home"},  "address":"...",  "mapData":{"lat":0,"lng":0,"directionsUrl":"..."},  "description":"...",  "schedule":[{"time":"17:00","title":"Welcome"}]}Response 201: {"success":true,"message":"Event created successfully","data":{"event":{...}}}

GET/PATCH/DELETE use the eventId. Deletion is soft delete. Event-scoped guest invitations/RSVPs remain historically traceable.

10. Guest, Invitation &amp; RSVP APIs

POST /weddings/:weddingId/guestsRequest:{  "name":"Anita",  "contact":{"email":"anita@example.com","phone":"+91..."},  "group":"Family",  "foodPreference":"VEG",  "notes":"..."}Response 201: {"success":true,"message":"Guest created successfully","data":{"guest":{...}}}

POST /weddings/:weddingId/invitationsRequest:{  "guestId":"...",  "eventIds":["..."],  "templateId":"...",  "customization":{"theme":"Floral","font":"...","colors":{}}}Response 201:{"success":true,"message":"Invitation created successfully","data":{"invitation":{...}}}

POST /weddings/:weddingId/invitations/:id/sendResponse 202:{"success":true,"message":"Invitation queued for delivery","data":{"status":"SENT"}}

GET /invite/:tokenResponse 200:{ "success":true, "message":"Invitation fetched", "data":{   "invitation":{...safe fields...},   "wedding":{...public-safe...},   "events":[...],   "rsvp":{...current guest-scoped RSVP state...} }}

POST /invite/:token/rsvpRequest:{  "status":"ATTENDING",  "attendeeCount":3,  "adults":2,  "children":1,  "foodPreference":"VEG",  "answers":{"meal":"North Indian"}}Response 201:{"success":true,"message":"RSVP submitted successfully","data":{"rsvp":{...}}}

PATCH /invite/:token/rsvpRequest: {"status":"MAYBE","attendeeCount":2}Response 200:{"success":true,"message":"RSVP updated successfully","data":{"rsvp":{...}}}

Guest identity is derived only from the secure invitation token. Arbitrary guestId values are never accepted as a public authorization mechanism. Invitation and RSVP statuses remain separate.

RSVP stores current state plus history. Public response must never expose other guests' data.

11. Task APIs

POST /weddings/:weddingId/tasksRequest:{ "title":"Book decorator", "eventId":"...", "assigneeId":"...", "priority":"HIGH", "deadline":"2027-01-15T18:00:00Z", "status":"PENDING", "notes":"...", "dependencyIds":[]}Response 201: {"success":true,"message":"Task created successfully","data":{"task":{...}}}

Task list supports filtering by eventId, assigneeId, status, priority, overdue=true and sorting by deadline.

Statuses: PENDING, IN_PROGRESS, COMPLETED.

12. Vendor &amp; Budget APIs

POST /weddings/:weddingId/vendorsRequest:{"category":"DECORATION","name":"ABC Decor","contact":{"phone":"+91..."},"service":"Stage decor","agreedAmount":50000,"paidAmount":10000,"notes":"..."}Response 201: {"success":true,"message":"Vendor created successfully","data":{"vendor":{...}}}

POST /weddings/:weddingId/budgetRequest:{"category":"VENUE","name":"Hall","plannedAmount":100000,"spentAmount":25000,"notes":"..."}Response 201: {"success":true,"message":"Budget item created successfully","data":{"budgetItem":{...}}}

Budget remaining is calculated dynamically as plannedAmount - spentAmount. Vendors are wedding-specific records; V1 has no marketplace or online vendor payment.

13. Gallery APIs

POST /weddings/:weddingId/gallery/albumsRequest: {"name":"Wedding Ceremony","eventId":"...","visibility":"PUBLIC"}Response 201: {"success":true,"message":"Album created successfully","data":{"album":{...}}}

POST /weddings/:weddingId/gallery/albums/:albumId/photosContent-Type: multipart/form-dataFields: files[]Optional: metadata JSONResponse 201:{"success":true,"message":"Photos uploaded successfully","data":{"photos":[...]}}

Only Owner/Partner can upload photos in V1. Organizer defaults to view-only unless an explicitly granted gallery upload permission is later enabled; Guest upload is never allowed.

MongoDB stores metadata only. Actual bytes go through a storage adapter. Local filesystem is used in development; object/cloud storage in production. Private assets require authorization and are not publicly enumerable.

14. Live Stream &amp; Website APIs

POST /weddings/:weddingId/livestreamRequest:{ "eventId":"...", "provider":"YOUTUBE", "streamUrl":"https://youtube.com/...", "accessMode":"PUBLIC", "recordingEnabled":true}Response 201: {"success":true,"message":"Live stream configured","data":{"liveStream":{...}}}

Provider-specific logic is isolated behind an adapter. YouTube Live is the initial provider.

PATCH /weddings/:weddingId/websiteRequest:{ "visibility":"PUBLIC", "theme":"Royal", "sections":{"story":true,"events":true,"venue":true,"rsvp":true,"liveStream":true,"photos":true}}Response 200: {"success":true,"message":"Website updated","data":{"websiteSettings":{...}}}

GET /w/:slugResponse 200:{"success":true,"message":"Wedding website fetched","data":{"wedding":{...safe projection...},"events":[...],"venue":{...},"publicPhotos":[...],"liveStream":{...},"rsvp":{"enabled":true}}}

Public website projection must exclude guest contacts, RSVP records, organizer permissions, budget, tasks, audit logs, account data, and other private fields.

15. Notification APIs

GET /notifications?unread=true&amp;limit=20&amp;cursor=...Response 200:{"success":true,"message":"Notifications fetched","data":{"items":[...],"nextCursor":"..."}}

PATCH /notifications/:id/readResponse 200:{"success":true,"message":"Notification marked as read","data":{"notification":{...}}}PATCH /notifications/read-allResponse 204

Notification history is persisted. Initial channels are in-app and email. User notification preferences are respected where applicable.

16. Public APIs

Endpoint

Security rule

GET /invite/:token

Cryptographically random token; rate limited; safe projection only

POST /invite/:token/rsvp

Token is sole guest identity; validate event scope; rate limited; idempotency supported

PATCH /invite/:token/rsvp

Token + invitation scope; rate limited

GET /w/:slug

Public website projection only; no private wedding-management data

Invitation tokens should be stored hashed when feasible. If raw tokens must be retrievable for delivery links, never expose internal guest IDs or membership IDs. Token values must be high entropy and unguessable.

17. File Uploads

Content-Type: multipart/form-data.

Validate MIME type, extension, maximum size, dimensions where applicable, and maximum file count.

Generate safe storage keys; never trust user-supplied filenames as storage paths.

Use a storage adapter interface so local development and cloud production use the same service contract.

Persist Photo metadata in MongoDB: storageKey, thumbnailKey, fileName, mimeType, size, metadata, visibility, uploadedBy.

Private media requires authorization before signed/private retrieval.

Reject unsupported or suspicious files and enforce rate/size limits.

18. Real-Time Socket.IO

Event

Direction

Purpose

notification:new

Server → user

New notification

task:updated

Server → wedding room

Task changed

rsvp:received

Server → wedding room

New/updated RSVP

event:updated

Server → wedding room

Event changed

member:updated

Server → wedding room

Organizer/partner permission change

Socket connections authenticate the user and join only authorized wedding rooms. Never broadcast private data to unauthorized clients.

socket.on("connection", authenticateSocket)socket.on("wedding:join", authorizeMembership)io.to(`wedding:${weddingId}`).emit("rsvp:received", safeRsvpPayload)

19. Background Jobs

Job

Trigger

Purpose

email.send

Invitation/verification/reset

Send transactional email

invitation.reminder

Scheduled/manual

Remind invited guests

rsvp.reminder

Scheduled/manual

Remind pending RSVP

task.deadline

Scheduled

Upcoming/overdue task alerts

event.upcoming

Scheduled

Upcoming event notifications

wedding.countdown

Scheduled/derived

Countdown-related notifications if enabled

cleanup.expiredOtp

Scheduled

Remove expired OTP material

media.cleanup

Scheduled

Clean abandoned upload artifacts

BullMQ + Redis provides queueing, retries, backoff, and scheduled processing. Jobs must be idempotent where practical.

20. Validation, Errors &amp; Status Codes

All request bodies, query parameters and route parameters are validated before controllers. Zod schemas should be colocated with route/feature validators.

Status

Meaning

Typical code

200

Successful read/update

OK

201

Resource created

RESOURCE_CREATED

202

Accepted/queued

OPERATION_QUEUED

204

Successful no-content

NO_CONTENT

400

Malformed/invalid request

BAD_REQUEST

401

Missing/invalid authentication

UNAUTHENTICATED

403

Authenticated but not allowed

FORBIDDEN

404

Resource not found or hidden

NOT_FOUND

409

Conflict/duplicate/state conflict

CONFLICT

422

Semantically invalid data

VALIDATION_ERROR

429

Rate limit exceeded

RATE_LIMITED

500

Unexpected server error

INTERNAL_ERROR

{  "success": false,  "message": "Wedding not found",  "error": {    "code": "WEDDING_NOT_FOUND",    "details": {}  }}

Centralized error middleware converts known application errors into stable public error codes. Internal stack traces are not returned to clients.

21. Security, Rate Limits &amp; Logging

Helmet for secure HTTP headers.

CORS allowlist for approved frontend origins.

Rate limiting on login, registration, OTP, password reset, public invitation and RSVP endpoints.

JWT authentication middleware and wedding authorization middleware.

Input validation with Zod.

Request logging with requestId, route, method, status, response time, authenticated userId and weddingId when available.

Never log passwords, access tokens, refresh tokens, OTPs, private invitation tokens, payment secrets, or sensitive guest data.

MongoDB Atlas authentication, TLS, least-privilege DB user, network restrictions, backups and secret management.

Private object storage and signed access where required.

AuditLog for important membership, wedding, invitation, RSVP, permission and destructive operations.

Soft delete operational entities; use controlled/hybrid deletion for wedding/account deletion.

22. Transactions &amp; Idempotency

MongoDB transactions should be used when multiple related writes must succeed or fail together.

Wedding creation + Owner membership creation.

Organizer/Partner membership state changes when multiple audit/related records must remain consistent.

Invitation creation when invitation + related event/guest linkage changes must be atomic.

RSVP write + RSVP history append when both are persisted in separate structures.

Controlled wedding deletion/archive workflows when multiple dependent records are changed together.

Other multi-document workflows should use transactions only when atomicity is required; avoid unnecessary transaction overhead.

Idempotency is required for important retriable operations. Use an Idempotency-Key header with a bounded retention window for invitation sending, RSVP submission/update, and future payment-like operations. Store request fingerprint + result so retries return the same logical result.

23. API ↔ Database Mapping

API area

Primary collections

Important relationships

Auth

User

User credentials/profile

Wedding

Wedding, WeddingMembership

ownerId; membership userId + weddingId

Events

Event

weddingId

Guests

Guest, GuestEvent

guestId + eventId

Invitations

Invitation, InvitationTemplate

guestId, eventIds, templateId

RSVP

RSVP, Invitation

invitationId + eventId; current + history

Tasks

Task

weddingId, eventId, assigneeId, dependencyIds

Vendors

Vendor

weddingId

Budget

BudgetItem

weddingId; remaining derived

Gallery

GalleryAlbum, Photo

albumId; storage adapter

Live stream

LiveStream

weddingId, eventId

Website

Wedding

websiteSettings + public projection

Notifications

Notification

userId + weddingId

Audit

AuditLog

actorId + weddingId + target

24. Testing Strategy

Test type

Coverage

Unit

Services, validators, permission helpers, token utilities, calculations

Integration/API

Routes + controllers + services + test DB

Authentication

Register/login/refresh/logout/email verification/reset

Authorization

Owner/Partner/Organizer permissions; removed membership; archived wedding

Validation

Invalid body/query/params; boundary values; enum errors

Public security

Invitation token guessing, scope isolation, RSVP access, rate limits

RSVP

Create/update/history/idempotency/event scope

Organizer permissions

VIEW/CREATE/EDIT/DELETE by area

Uploads

MIME/size/count/dimensions/storage errors

Real-time

Socket authentication and wedding-room authorization

Jobs

Retry/idempotency/scheduled execution

E2E critical flows

Create wedding → invite organizer → add event/guest → invitation → RSVP → dashboard

25. Swagger/OpenAPI Structure

openapi: 3.0.xinfo:  title: MakeMyMarriage API  version: 1.0.0servers:  - url: https://api.makemymarriage.com/api/v1tags:  - Auth  - Weddings  - Members  - Events  - Guests  - Invitations  - RSVP  - Tasks  - Vendors  - Budget  - Gallery  - LiveStream  - Website  - Notificationspaths:  /auth/login: ...components:  securitySchemes:    bearerAuth:      type: http      scheme: bearer      bearerFormat: JWT  schemas:    User: ...    Wedding: ...    Event: ...    Guest: ...    Invitation: ...    RSVP: ...    Task: ...    Vendor: ...    BudgetItem: ...security:  - bearerAuth: []

Every protected endpoint must identify its security requirement and permission in the OpenAPI description. Public endpoints must explicitly omit bearer security and document token/rate-limit behavior.

26. Postman Structure

MakeMyMarriage├── 01 Auth│   ├── Register│   ├── Verify Email│   ├── Login│   ├── Refresh│   ├── Logout│   ├── Forgot Password│   └── Reset Password├── 02 Weddings├── 03 Members├── 04 Events├── 05 Guests├── 06 Invitations├── 07 RSVP├── 08 Tasks├── 09 Vendors├── 10 Budget├── 11 Gallery├── 12 Live Stream├── 13 Website├── 14 Notifications└── 15 PublicEnvironment:  baseUrl  accessToken  weddingId  invitationToken  guestId  eventId

Postman tests should automatically capture accessToken, weddingId and public invitation token from responses where appropriate.

27. Backend API Folder Structure

backend/├── config/├── controllers/│   ├── auth.controller.js│   ├── wedding.controller.js│   ├── event.controller.js│   ├── guest.controller.js│   ├── invitation.controller.js│   ├── rsvp.controller.js│   ├── task.controller.js│   ├── vendor.controller.js│   ├── budget.controller.js│   ├── gallery.controller.js│   ├── livestream.controller.js│   ├── website.controller.js│   └── notification.controller.js├── models/├── routes/├── services/├── validators/├── middleware/│   ├── auth.js│   ├── authorize.js│   ├── validate.js│   ├── rateLimit.js│   ├── upload.js│   └── errorHandler.js├── jobs/├── sockets/├── utils/├── constants/├── uploads/├── app.js└── server.js

28. API Flows

28.1 Authentication

Register → verification email → verify → login → access JWT + refresh cookie → API calls → refresh when access token expires → logout revokes refresh session

28.2 Organizer

Owner/authorized user → invite organizer → email/link → organizer accepts/registers → WeddingMembership ACTIVE → permissions applied → every request re-checks membership/permission → removal immediately blocks access

28.3 Guest Invitation

Guest created → events selected → invitation generated → secure token created → invitation sent → guest opens /invite/:token → safe invitation projection → RSVP create/update → dashboard receives RSVP event → notification/history updated

28.4 RSVP

Token → validate token + invitation → resolve guest/event scope → validate payload → transaction: update current RSVP + append history → emit rsvp:received → return guest-scoped RSVP

28.5 Wedding archive/delete

Owner requests archive → authorization → status ARCHIVED → writes become read-only → Owner restore allowed. Permanent deletion requires explicit confirmation + verification and follows controlled/hybrid deletion policy.

29. V1 Completion Checklist

REST /api/v1 implemented.

Standard success/error envelope implemented.

JWT access token + rotating HTTP-only refresh token implemented.

Logout revokes refresh session.

Email verification and password reset OTP implemented securely.

Wedding-scoped authorization implemented.

Owner/Partner/Organizer permissions implemented.

Cursor pagination, filtering, sorting and search implemented where applicable.

Zod validation implemented before controllers.

Centralized error middleware and stable error catalogue implemented.

Rate limits and security middleware enabled.

Idempotency supported for critical retriable operations.

Public invitation/RSVP and website projection endpoints isolated.

Multipart upload validation + storage adapter implemented.

Socket.IO authorization and events implemented.

BullMQ/Redis jobs implemented.

MongoDB transaction points documented and tested.

Audit logging implemented without secrets.

Swagger/OpenAPI generated from the API contract.

Postman collection created and tested.

Unit/API/security/authorization/RSVP/E2E tests implemented.

API ↔ DB mapping verified against the approved database design.

Appendix A — Recommended Common Query Parameters

GET /resource?limit=20&amp;cursor=&lt;cursor&gt;&amp;sort=createdAt&amp;order=descGET /resource?status=ACTIVE&amp;eventId=&lt;id&gt;&amp;assigneeId=&lt;id&gt;GET /resource?search=decoratorGET /resource?from=2027-01-01&amp;to=2027-02-01GET /tasks?overdue=trueGET /notifications?unread=true

Limit must be bounded server-side. Do not allow unbounded list requests.

Appendix B — Core Error Codes

Code

Meaning

VALIDATION_ERROR

Request data failed schema validation

UNAUTHENTICATED

Authentication missing/invalid

FORBIDDEN

Permission denied

WEDDING_NOT_FOUND

Wedding unavailable

WEDDING_ARCHIVED

Write operation blocked because wedding is archived

MEMBERSHIP_NOT_FOUND

User is not a wedding member

MEMBERSHIP_REMOVED

Membership has been revoked

INVITATION_NOT_FOUND

Invitation unavailable

INVITATION_TOKEN_INVALID

Invalid/expired invitation token

RSVP_NOT_ALLOWED

RSVP outside invitation/event scope

DUPLICATE_RESOURCE

Unique resource already exists

IDEMPOTENCY_CONFLICT

Same key used with a different request

RATE_LIMITED

Too many requests

FILE_TOO_LARGE

Upload exceeds configured limit

UNSUPPORTED_FILE_TYPE

File type not allowed

INTERNAL_ERROR

Unexpected server failure

Appendix C — Design Principles

Security first: public tokens are capabilities, not user IDs.

Wedding isolation: every private wedding resource is authorized through membership.

Least privilege: organizer permissions are explicit.

Safe projections: public APIs never serialize private models directly.

Service layer ownership: controllers coordinate; services contain business logic.

Stable contracts: clients depend on versioned endpoint contracts and error codes.

Async where appropriate: email/reminders/media cleanup use jobs.

Observable: request IDs, audit logs, metrics and structured logs.

Testable: validators, services, authorization and critical flows are independently testable.

Extensible: provider adapters for storage and live streaming; V2 can evolve without breaking V1.