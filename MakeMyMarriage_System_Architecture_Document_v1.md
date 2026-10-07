# MakeMyMarriage_System_Architecture_Document_v1

MAKE MY MARRIAGE

System Architecture Document

Version 1.0 | Approved Architecture Blueprint

MERN-based Wedding Management Platform

Document Control

Item

Value

Product

MakeMyMarriage

Document

System Architecture Document

Version

1.0

Architecture

Modular Monolith

Frontend

React + Vite

Backend

Node.js + Express.js

Database

MongoDB Atlas

Real-time

Socket.IO

Jobs/Cache

BullMQ + Redis

Initial deployment

Vercel + Render/Railway + MongoDB Atlas

Status

Approved for implementation

This document converts the approved MakeMyMarriage product requirements and architecture decisions into an implementation-oriented technical design.

1. Architecture Goals

Simple enough for V1 development, while remaining production-minded.

Strong server-side authorization for wedding-scoped data.

One user can participate in multiple weddings with different roles.

Guests can RSVP without creating accounts.

Support multiple events and event-specific guest relationships.

Reliable notifications, scheduled jobs, and real-time updates.

Replaceable providers for email, maps, live streaming, and media storage.

English-first with a translation-ready architecture for Indian languages.

Moderate future scalability without premature microservices.

Clear module boundaries so individual modules can be extracted later if necessary.

2. High-Level System Architecture

MAKE MY MARRIAGE                                |                    +-----------+-----------+                    |                       |               Public Users          Registered Users          Website / Invitation     Owner/Partner/Organizer          Guest RSVP                         |                    +-----------+-----------+                                |                         React + Vite                                |                    REST API + Socket.IO                                |                       Node.js + Express                                |       +------------------------+-------------------------+       |                        |                         |  Authorization             Services                 Background Jobs  JWT + permissions        Business logic             BullMQ + Redis       |                        |                         |       +------------------------+-----------+-------------+                                            |                                       MongoDB Atlas                                            |        Events | Guests | Invitations | RSVP | Tasks | Vendors        Budget | Gallery | LiveStream | Website | NotificationsExternal: Email Provider | Google Maps | YouTube Live | Cloud/Object Storage

3. Technology Stack

Layer

Technology / Decision

Frontend

React + Vite

State

React Context + useState/useReducer

HTTP

Fetch API

Backend

Node.js + Express.js

API

REST, versioned under /api/v1

Database

MongoDB Atlas + Mongoose

Authentication

JWT access/refresh-token approach

Real-time

Socket.IO

Queue

BullMQ

Cache

Redis

Media

Local development; cloud/object storage in production

Maps

Google Maps

Live stream

YouTube Live initially

Email

Transactional provider behind an abstraction

Containers

Docker

CI/CD

GitHub Actions

Deployment

Vercel + Render/Railway + MongoDB Atlas

API docs

OpenAPI/Swagger + Postman

4. Repository Structure

makemymarriage/├── frontend/├── backend/├── docs/├── docker/├── .github/workflows/├── .gitignore├── README.md└── docker-compose.yml

5. Frontend Architecture

frontend/src/├── assets/├── components/├── layouts/├── pages/├── features/│   ├── auth/ wedding/ partner/ organizers/│   ├── events/ guests/ invitations/ rsvp/│   ├── tasks/ vendors/ budget/ gallery/│   ├── livestream/ website/ notifications/├── services/├── hooks/├── context/├── routes/├── utils/├── i18n/└── main.jsx

Feature-based organization keeps domain logic close together.

Context/useReducer is sufficient for V1 application state.

Protected React routes improve UX but are never treated as security boundaries.

Localization strings are separated from components.

6. Backend Architecture

backend/├── config/├── controllers/├── models/├── routes/├── services/├── middleware/├── validators/├── utils/├── jobs/├── sockets/├── uploads/├── constants/├── app.js└── server.js

Request -&gt; Route -&gt; Auth -&gt; Membership -&gt; Permission -&gt; Validation        -&gt; Controller -&gt; Service -&gt; Mongoose Model -&gt; MongoDB -&gt; Response

7. User, Role and Membership Model

Roles are wedding-scoped, not global User properties.

User | +-- WeddingMembership -- Wedding A (Owner) | +-- WeddingMembership -- Wedding B (Partner) | +-- WeddingMembership -- Wedding C (Organizer)

Role

Account

Access

Owner

Yes

Full wedding management; protected destructive actions

Partner

Yes

Broad/full management; protected ownership/destructive actions excluded

Organizer

Yes

Only granted module/action permissions

Guest

No

Invitation + event information + RSVP through secure token

Future Super Admin

Yes

Reserved platform-level role; no V1 dashboard

8. Authentication and Authorization

Email/password registration with required email verification.

JWT access/refresh-token authentication.

Forgot-password through email OTP.

Server-side membership and permission checks on every private wedding operation.

Organizer permissions support View/Create/Edit/Delete where applicable.

Permission changes take effect immediately.

Removing an organizer immediately revokes access but preserves historical work.

Sensitive destructive operations require OTP/email confirmation.

Request -&gt; JWT valid? -&gt; Identify User -&gt; Identify Wedding -&gt; WeddingMembership exists? -&gt; Role/Permission check -&gt; Wedding state check -&gt; Allow / Deny

9. Wedding Lifecycle

DRAFT -&gt; ACTIVE -&gt; COMPLETED -&gt; ARCHIVED                         ARCHIVED = READ ONLY                         RESTORE -&gt; ACTIVE                         DELETE = PERMANENT / CONFIRMED

Users may create multiple weddings.

My Weddings workspace provides wedding switching and Create New Wedding.

Archive preserves historical information and blocks ordinary writes.

Owner can restore an archived wedding.

Permanent deletion removes related V1 wedding data according to the deletion policy.

10. Core Modules

Module

Responsibilities

Auth

Registration, verification, login, reset, logout

Users

Profile and account deletion

Wedding

Setup, settings, status, slug, theme

Membership

Owner/Partner/Organizer roles and permissions

Events

Multiple events, schedules, venue/map

Guests

Guest records, groups, event assignments

Invitations

Templates, customization, publishing, tracking

RSVP

Guest responses, attendee counts, custom questions

Tasks

Assignments, deadlines, dependencies, reminders

Vendors

Vendor records and payment tracking

Budget

Planned/spent/remaining calculations

Gallery

Albums, photos, visibility, storage

Live Stream

External provider configuration

Website

Public/private wedding website

Notifications

In-app/email notification history

Audit

Security and important business actions

11. MongoDB Data Model

Collection

Purpose / Main Keys

users

Registered accounts; unique email

weddings

Wedding root; ownerId, unique slug

weddingMemberships

userId + weddingId, role, permissions

events

weddingId, date/time, venue

guests

weddingId, guest/contact/group data

guestEvents

guestId + eventId unique

invitationTemplates

Template definitions/version

invitations

weddingId, guestId, secure token

rsvps

invitation/guest/event response data

tasks

weddingId, assignee, event, deadline

vendors

weddingId, category, financial record

budgetItems

weddingId, planned/spent amounts

galleryAlbums

weddingId, eventId, visibility

photos

albumId, storage key, uploader

liveStreams

weddingId/eventId, provider data

notifications

userId, weddingId, read status

auditLogs

actorId, weddingId, target, action, timestamp

12. Domain Relationships

User  |  +--&lt; WeddingMembership &gt;-- Wedding                                |        +-----------------------+-----------------------+        |       |       |       |       |       |       |      Events  Guests  Tasks   Vendors  Budget  Albums  LiveStream        |       |        |     GuestEvent        |       |        +-------+        |    Invitations        |       RSVPWedding -&gt; WebsiteSettings / Notifications / AuditLogs

13. Events and Guests

A wedding supports Engagement, Haldi, Mehendi, Sangeet, Wedding, Reception, and custom events.

A guest can be assigned to multiple events.

GuestEvent is the relationship collection that prevents duplicating guest records.

Guest groups are supported.

Duplicate guest creation is blocked/warned according to configured duplicate rules.

Guest records can contain name, contact, relationship/group, attendee information, food preference, and notes.

14. Invitation and RSVP Architecture

Create -&gt; Customize -&gt; Preview -&gt; Publish -&gt; Share                              |                         Unique token                              |                       Guest opens link                              |                        Submit / update RSVP

V1 begins with approximately 5–8 templates; architecture supports more.

Customization includes text, fonts, colors, images, background, events, venue/map and theme.

Invitation can be shared by link and downloaded as image/PDF.

Invitation status: Not Sent, Sent, Opened.

RSVP status: Pending, Attending, Not Attending, Maybe.

Guests can update RSVP later using the same valid invitation.

Custom RSVP questions are supported.

Invitation tokens are not transferable; create a new invitation instead.

RSVP information remains private and is never exposed on public wedding pages.

15. Tasks, Vendors and Budget

Tasks support title, event, assignee, priority, deadline, status, notes and dependencies.

Task statuses are Pending, In Progress and Completed.

Reminders support pre-deadline and overdue notifications.

Vendor categories are predefined plus a custom category.

Vendor records support agreed, paid and remaining amounts; no online vendor payments.

Budget tracks planned, spent and remaining amounts by category/item.

16. Gallery and Media

Development: Application -&gt; Local StorageProduction: Application -&gt; Storage Adapter -&gt; Cloud/Object StorageMetadata -&gt; MongoDB

Multiple photo uploads are supported.

Albums can be associated with events.

Owner and Partner have full gallery management.

Organizer is View-only by default; extra access can be granted.

Guests cannot upload photos.

Gallery can be Private or Public.

Public photos can be viewed without login when enabled.

Server validates authentication, membership, permission, file type and size.

Use safe storage keys and optimized/thumbnail representations.

17. Live Stream, Maps and Website

Live Stream:MakeMyMarriage -&gt; LiveStreamService -&gt; YouTube LiveWebsite:GET /w/:slug -&gt; public-safe wedding projection -&gt; rendered pageMaps:Wedding/Event -&gt; Location Service -&gt; Google Maps

Live streaming is external; no proprietary streaming infrastructure in V1.

Couple controls stream visibility and recording availability.

Wedding website has a unique slug and Public/Private visibility.

Public pages show only safe public data; guest contact/RSVP/budget/tasks remain private.

Website supports couple names, story, photos, date/countdown, events, venue/map, RSVP, invitation and stream information.

18. Notifications, Redis and Background Jobs

Application Event   +--&gt; Notification Service -&gt; MongoDB notification record -&gt; Socket.IO   |   +--&gt; BullMQ Job -&gt; Redis Queue -&gt; Worker -&gt; Email / Scheduled Action

In-app and email are V1 notification channels.

Users have notification preferences.

Notification history is persisted.

Redis is used for queues and selective caching.

Background jobs handle RSVP reminders, task reminders, event reminders and other asynchronous operations.

Jobs should be retryable and idempotent where practical.

19. REST API Architecture

/api/v1/auth/api/v1/users/api/v1/weddings/api/v1/weddings/:weddingId/members/api/v1/weddings/:weddingId/events/api/v1/weddings/:weddingId/guests/api/v1/weddings/:weddingId/invitations/api/v1/weddings/:weddingId/tasks/api/v1/weddings/:weddingId/vendors/api/v1/weddings/:weddingId/budget-items/api/v1/weddings/:weddingId/albums/api/v1/weddings/:weddingId/livestream/api/v1/weddings/:weddingId/website/api/v1/notificationsPublic:GET/POST/PATCH /invite/:tokenGET /w/:slug

All APIs use a consistent success/error envelope. Controllers remain thin and business rules live in services.

20. Security Architecture

HTTPS  -&gt; CORS / Helmet  -&gt; Rate Limiting  -&gt; JWT  -&gt; Wedding Membership  -&gt; Permissions  -&gt; Input Validation  -&gt; Business Rules  -&gt; Database / Storage

Security Area

Requirement

Passwords

Secure hashing; never plaintext

Authentication

JWT access/refresh-token approach

Verification

Email verification and email OTP for reset/sensitive actions

Authorization

WeddingMembership + granular permissions

API protection

CORS, Helmet, rate limiting, validation

Invitation

Random unique tokens; scoped access

Files

Type/size/name validation and authorization

Privacy

Public-safe data projection; private guest/RSVP/budget data

Audit

Important permission, lifecycle and security actions logged

21. Database Index Strategy

Collection

Important Index

users

unique email

weddings

unique slug; ownerId

weddingMemberships

unique userId + weddingId

events

weddingId + date

guests

weddingId

guestEvents

unique guestId + eventId

invitations

unique token

tasks

weddingId + deadline

notifications

userId + read/status

auditLogs

weddingId + timestamp

22. API Response and Error Handling

Success:{  "success": true,  "message": "Wedding created successfully",  "data": {}}Error:{  "success": false,  "message": "Wedding not found",  "error": { "code": "WEDDING_NOT_FOUND" }}

Centralized error middleware handles known and unexpected errors.

Validation errors are returned consistently.

Unexpected errors are logged without exposing secrets or sensitive information.

Archived weddings reject ordinary mutations.

23. Deployment Architecture

Internet                    |          +---------+---------+          |                   |       Vercel             Render/Railway      React/Vite           Node/Express                                |               +----------------+----------------+               |                |                |          MongoDB Atlas       Redis          File StorageExternal: Email Provider | Google Maps | YouTube Live

The application remains provider-neutral enough to move between Render and Railway without redesigning its internal architecture.

24. Environments, Docker and CI/CD

Development -&gt; Staging -&gt; ProductionGit Push  -&gt; GitHub Actions  -&gt; Install / Lint / Tests / Build  -&gt; Deploy

Environment-specific secrets are stored outside source control.

Docker supports repeatable local and CI environments.

Production deployment should use protected environments/branches once real users exist.

Worker and API processes can be containerized separately.

25. Testing Strategy

Test Layer

Focus

Unit

Services, utilities, validators and business rules

API/Integration

Authentication, permissions, routes, database interactions

Frontend

Components and critical feature behavior

E2E

Login, wedding creation, invitation, RSVP and critical lifecycle flows

Security-sensitive and business-critical flows should receive priority coverage.

26. Backups, Monitoring and Recovery

Enable MongoDB Atlas automated backups in production.

Maintain a documented database recovery procedure.

Maintain an independent media retention/backup strategy for production storage.

Keep deployment rollback capability.

Use structured application logging with INFO/WARN/ERROR/SECURITY/AUDIT categories.

Add external monitoring as production traffic justifies it.

Background job failures should retry and be observable.

27. Scalability Strategy

V1: Modular Monolith       |       +-- MongoDB Atlas scaling       +-- Redis cache/queues       +-- Object storage       +-- Background workers       +-- Read-heavy caching where safeFuture:Extract only proven bottlenecks into separate services.

Do not start with a large microservices system. Module boundaries are designed so notification, media processing, analytics, search, or other high-load domains can be separated later if real traffic requires it.

28. Failure Handling

Failure

Behavior

Email provider unavailable

Queue/retry; core wedding writes should continue where possible

Redis unavailable

Background jobs may pause/fail safely; core synchronous flows should degrade where practical

Live-stream provider unavailable

Store configuration/error; wedding management continues

Maps unavailable

Show stored address/map link where possible

Upload failure

Do not retain broken photo record; return retryable error

Database unavailable

Controlled service error and incident logging

Job failure

Retry according to job policy; record failed jobs

29. Key User Flows

29.1 Wedding Creation

Register -&gt; Verify Email -&gt; Login -&gt; Create Wedding-&gt; Couple names + date + venue-&gt; Optional photo/theme/description-&gt; Wedding + Owner membership created-&gt; Dashboard

29.2 Organizer

Owner -&gt; Invite Organizer-&gt; Existing organizer accepts OR new user registers-&gt; Membership created-&gt; Owner grants permissions-&gt; Organizer sees wedding in My Weddings

29.3 Guest RSVP

Guest receives unique link-&gt; Opens invitation-&gt; Reviews event information-&gt; Chooses RSVP-&gt; Enters attendee details / custom answers-&gt; Submit-&gt; Dashboard totals update-&gt; Guest may return and update

29.4 Archive/Restore

Owner -&gt; Archive -&gt; Read-onlyOwner -&gt; Restore -&gt; Active -&gt; Editing resumes

30. Backend Business Rules

Wedding photo is optional during initial setup.

Users can own/manage multiple weddings.

Organizers can manage multiple weddings.

One account can have different roles in different weddings.

Guests do not require accounts.

Guests can be assigned to multiple events.

Invitation tokens are unique and non-transferable.

RSVP can be updated through a valid invitation.

RSVP and private guest information are never public.

Guests cannot upload gallery photos.

Organizer access is permission-controlled.

Removing an organizer revokes access but preserves historical work.

Permission changes take effect immediately.

Archived weddings are read-only.

Owner can restore an archived wedding.

Permanent deletion is destructive and requires confirmation/verification.

Public website endpoints expose only a safe public projection.

31. Recommended Implementation Order

Repository, Vite/Express shells, Docker and environment setup.

MongoDB/Mongoose configuration and centralized error handling.

Authentication, email verification, JWT, logout and password reset.

Wedding and WeddingMembership models.

Authorization and organizer permissions.

Wedding creation, dashboard and lifecycle.

Events and schedules.

Guests and GuestEvent relationships.

Invitation templates, secure links and publishing.

RSVP and attendee calculations.

Tasks, reminders and dependencies.

Vendors and budget.

Redis, BullMQ and notification service.

Socket.IO real-time notifications.

Gallery and storage adapter.

Wedding website and public-safe projection.

Google Maps and YouTube Live.

Audit logs, backups, monitoring and hardening.

Automated tests and GitHub Actions CI/CD.

32. Future Extension Points

WhatsApp/SMS notification adapters.

Additional live-stream providers.

Advanced drag-and-drop invitation editor.

Guest accounts.

Vendor marketplace/booking.

Online payments.

Calendar integrations.

Advanced analytics.

Custom domains.

Native mobile applications.

Advanced media processing.

Additional Indian languages.

Platform Super Admin dashboard.

33. Final Architecture Decision Summary

Area

Final Decision

Architecture

Modular monolith

Frontend

React + Vite

Backend

Node.js + Express.js

Database

MongoDB Atlas + Mongoose

API

REST /api/v1

State

React Context + useState/useReducer

Auth

JWT access/refresh-token approach

Authorization

WeddingMembership + granular permissions

Real-time

Socket.IO

Jobs

BullMQ + Redis

Caching

Redis, selectively

Gallery

Local dev; cloud/object storage production

Email

Replaceable transactional provider

Maps

Google Maps

Live stream

YouTube Live first

Deployment

Vercel + Render/Railway + MongoDB Atlas

CI/CD

GitHub Actions

Containers

Docker

Testing

Unit + API + frontend + critical E2E

Archive

Read-only + Owner Restore

Privacy

Strong wedding/guest data privacy

Scalability

Moderate scaling with future module extraction

34. Final Architecture Statement

The approved MakeMyMarriage architecture is a secure, modular MERN application designed to deliver the complete V1 wedding-management experience without premature infrastructure complexity. Wedding-scoped memberships and permissions form the authorization foundation; secure token-based invitations enable account-free guest RSVP; MongoDB Atlas stores persistent domain data; Redis/BullMQ handle asynchronous work; Socket.IO provides real-time updates; and replaceable service adapters isolate email, maps, live streaming, and media storage.

The system starts as a modular monolith. Clear module and service boundaries provide a controlled path to future mobile clients, additional providers, moderate scale, and selective service extraction when real usage demonstrates the need.

This document is the technical baseline for implementation. Changes to roles, privacy, data ownership, invitation behavior, or lifecycle rules should be treated as architecture decisions and reflected here before implementation.

Appendix A — Suggested Core Fields

Model

Core Fields

User

_id, name, email, passwordHash, emailVerified, profile, createdAt, updatedAt

Wedding

_id, ownerId, names, date, venue, description, theme, status, slug, visibility

WeddingMembership

_id, userId, weddingId, role, permissions, status, invitedAt, joinedAt

Event

_id, weddingId, name, date, time, venue, address, mapData, description, schedule

Guest

_id, weddingId, name, contact, group, foodPreference, attendeeProfile, notes

GuestEvent

_id, guestId, eventId, invitationStatus, rsvpStatus

Invitation

_id, weddingId, guestId, eventIds, templateId, token, status, version

RSVP

_id, invitationId, guestId, eventId, status, attendeeCount, adults, children, answers

Task

_id, weddingId, eventId, title, assigneeId, priority, deadline, status, notes, dependencyIds

Vendor

_id, weddingId, category, name, contact, service, agreedAmount, paidAmount, notes

BudgetItem

_id, weddingId, category, name, plannedAmount, spentAmount, notes

GalleryAlbum

_id, weddingId, eventId, name, visibility

Photo

_id, albumId, storageKey, thumbnailKey, metadata, visibility, uploadedBy

LiveStream

_id, weddingId, eventId, provider, streamUrl, accessMode, recordingEnabled

Notification

_id, userId, weddingId, type, title, message, readAt, channel, createdAt

AuditLog

_id, actorId, weddingId, action, targetType, targetId, metadata, createdAt

Appendix B — Critical Security Rules

Never rely on frontend authorization.

Every private wedding request must resolve the user's membership and permission.

Invitation endpoints must derive guest scope from the secure invitation token.

Public pages must use a public-safe data projection.

Private gallery objects must not be enumerable by predictable filenames.

File uploads require server-side type, size, and permission checks.

Destructive operations require explicit confirmation and appropriate verification.

Sensitive credentials and provider keys must never be committed to source control.