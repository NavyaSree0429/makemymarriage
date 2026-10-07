# MakeMyMarriage_Database_Design_Document_v1

MakeMyMarriage – Database Design Document

Version 1.0 | Approved Database Architecture

Purpose: Implementation-ready MongoDB/Mongoose database design for the MakeMyMarriage wedding-management platform. It defines collections, relationships, validation, indexes, security, lifecycle rules, sample documents, and API-to-database mapping.

Status: Approved. This document reflects the database decisions confirmed before creation.

1. Document Control

Item

Value

Product

MakeMyMarriage

Database

MongoDB

ODM

Mongoose

Architecture

MERN / Modular Monolith

Database style

Separate collections with ObjectId references

Version

1.0

Primary users

Wedding Owner, Partner, Organizer, Guest

Guest account

Not required

Primary hosting

MongoDB Atlas

2. Database Goals

Support multiple weddings per registered user.

Allow the same user to have different roles in different weddings.

Isolate wedding-scoped data using weddingId.

Store wedding-specific organizer roles and permissions in WeddingMembership.

Keep guests accountless and token-based.

Keep invitation status separate from RSVP status.

Support guests attending multiple events.

Preserve historical work when organizers are removed.

Keep public website data separate from private management data.

Use validation and indexes suitable for production.

Keep media binaries outside MongoDB while storing metadata in MongoDB.

Provide extension points for future marketplace, payments, messaging, analytics, and providers.

3. Approved Decisions

Area

Decision

Database

MongoDB + Mongoose

Structure

Separate collections

Users

One users collection

Membership

WeddingMembership stores wedding-specific role/permissions

Multiple weddings

Supported

Guests

No account required

Guest events

Separate GuestEvent relationship

Invitations

Unique secure token

RSVP

Separate collection

RSVP changes

Current RSVP + history

Tasks

Dependency IDs

Vendors

Wedding-specific records

Budget

Store planned/spent; calculate remaining

Gallery

Wedding → Album → Photo

Media

Metadata in MongoDB; files through storage adapter

Public website

Safe public projection

Archive

Read-only

Deletion

Controlled/hybrid

Audit

AuditLog

Validation

Mongoose validation

Indexes

Unique/compound/operational

Relationships

ObjectId references

4. Collection Overview

Collection

Purpose

users

Registered accounts

weddings

Core wedding workspace

weddingMemberships

Wedding role/permissions

events

Wedding functions

guests

Wedding guest records

guestEvents

Guest ↔ event relationship

invitationTemplates

Versioned invitation templates

invitations

Invitation instances

rsvps

RSVP responses/history

tasks

Wedding work items

vendors

Wedding-specific vendors

budgetItems

Budget entries

galleryAlbums

Photo albums

photos

Photo metadata

liveStreams

External streaming configuration

notifications

Persisted notifications

auditLogs

Security/business audit trail

5. Relationship Model

User  |  +--&lt; WeddingMembership &gt;-- Wedding                              |      +--------+--------------+------------------+      |        |              |                  |    Event    Guest          Task              Vendor      |        |      |     GuestEvent      |        |      +--------+          |     Invitation          |         RSVPWedding -&gt; BudgetItemWedding -&gt; GalleryAlbum -&gt; PhotoWedding -&gt; LiveStreamWedding -&gt; NotificationWedding -&gt; AuditLog

Major entities are referenced rather than embedded as large arrays in the Wedding document. This improves independent querying, indexing, pagination, and future scaling.

6. users Collection

Field

Type

Rules

_id

ObjectId

Primary key

name

String

Required

email

String

Required, normalized, unique

passwordHash

String

Required; never plaintext

emailVerified

Boolean

Default false

profile

Object

Optional profile/phone/photo

notificationPreferences

Object

Optional

isDeleted

Boolean

Soft-delete marker

deletedAt

Date

Optional

createdAt/updatedAt

Date

Mongoose timestamps

{  "_id": "ObjectId",  "name": "Rahul Kumar",  "email": "rahul@example.com",  "passwordHash": "&lt;secure-hash&gt;",  "emailVerified": true,  "profile": {"phone": "+91XXXXXXXXXX"},  "isDeleted": false,  "createdAt": "ISODate(...)",  "updatedAt": "ISODate(...)"}

7. weddings Collection

Field

Type

Rules

_id

ObjectId

Primary key

ownerId

ObjectId → User

Required

names.partner1 / partner2

String

Required

weddingDate

Date

Required

venue

Object

Name/address required; map data optional

couplePhoto

Object

Optional

description

String

Optional

theme

String

Theme key

slug

String

Required, unique

visibility

String

PUBLIC or PRIVATE

status

String

ACTIVE/ARCHIVED/DELETION_PENDING/DELETED

websiteSettings

Object

Public website configuration

archivedAt

Date

Optional

createdAt/updatedAt

Date

Timestamps

{  "_id": "ObjectId",  "ownerId": "ObjectId(User)",  "names": {"partner1":"Rahul","partner2":"Priya"},  "weddingDate":"2027-02-14T00:00:00.000Z",  "venue":{"name":"Example Convention Hall","address":"Tirupati, Andhra Pradesh","mapData":{}},  "theme":"Floral",  "slug":"rahul-priya",  "visibility":"PUBLIC",  "status":"ACTIVE"}

Couple photo is intentionally optional during initial setup.

8. weddingMemberships Collection

Field

Type

Rules

_id

ObjectId

Primary key

userId

ObjectId → User

Required

weddingId

ObjectId → Wedding

Required

role

String

OWNER/PARTNER/ORGANIZER

permissions

Object

Module-level permissions

status

String

INVITED/ACTIVE/REMOVED

invitedAt/joinedAt/removedAt

Date

Lifecycle timestamps

createdAt/updatedAt

Date

Timestamps

{  "userId":"ObjectId(User)",  "weddingId":"ObjectId(Wedding)",  "role":"ORGANIZER",  "permissions":{    "events":["VIEW","CREATE","EDIT"],    "guests":["VIEW"],    "tasks":["VIEW","CREATE","EDIT"],    "budget":[]  },  "status":"ACTIVE"}

Unique index: userId + weddingId. Removing membership revokes access but preserves historical records.

9. events Collection

Field

Type

Rules

_id

ObjectId

Primary key

weddingId

ObjectId → Wedding

Required

name

String

Required

date

Date

Required

time

Object

Optional

venue/address

String

Optional

mapData

Object

Optional

description

String

Optional

schedule

Array

Optional

isDeleted

Boolean

Soft delete

createdAt/updatedAt

Date

Timestamps

10. guests Collection

Field

Type

Rules

_id

ObjectId

Primary key

weddingId

ObjectId → Wedding

Required

name

String

Required

contact

Object

Optional

group

String

Optional

foodPreference

String

Optional

attendeeProfile

Object

Optional

notes

String

Private

isDeleted

Boolean

Soft delete

createdAt/updatedAt

Date

Timestamps

11. guestEvents Collection

Many-to-many relationship between guests and events.

Field

Type

Rules

_id

ObjectId

Primary key

guestId

ObjectId → Guest

Required

eventId

ObjectId → Event

Required

invitationStatus

String

NOT_SENT/SENT/OPENED

rsvpStatus

String

PENDING/ATTENDING/NOT_ATTENDING/MAYBE

createdAt/updatedAt

Date

Timestamps

Unique index: guestId + eventId.

12. invitationTemplates Collection

Field

Type

Purpose

_id

ObjectId

Template ID

name

String

Template name

version

Number

Versioning

theme

String

Theme family

config

Object

Template configuration

isActive

Boolean

Selectable

createdAt/updatedAt

Date

Timestamps

V1 starts with approximately 5–8 templates and uses a data-driven, versionable template system.

13. invitations Collection

Field

Type

Rules

_id

ObjectId

Primary key

weddingId

ObjectId → Wedding

Required

guestId

ObjectId → Guest

Required

eventIds

Array&lt;ObjectId&gt;

Invited events

templateId

ObjectId → InvitationTemplate

Required

tokenHash/token

String

Unique secure token

status

String

NOT_SENT/SENT/OPENED

version

Number

Published invitation version

publishedAt

Date

Optional

createdAt/updatedAt

Date

Timestamps

Recommended production security: store a hash of the invitation token and compare the hash of the incoming token. The token functions as a secret credential.

14. rsvps Collection

Field

Type

Rules

_id

ObjectId

Primary key

invitationId

ObjectId → Invitation

Required

guestId

ObjectId → Guest

Required

eventId

ObjectId → Event

Required

status

String

ATTENDING/NOT_ATTENDING/MAYBE

attendeeCount

Number

Required, non-negative

adults/children

Number

Optional, non-negative

foodPreference

String

Optional

answers

Object/Array

Custom questions

history

Array

Change history

lastUpdatedAt

Date

Required

createdAt/updatedAt

Date

Timestamps

"history": [  {"status":"MAYBE","attendeeCount":2,"changedAt":"ISODate(...)"},  {"status":"ATTENDING","attendeeCount":3,"changedAt":"ISODate(...)"}]

The current RSVP is the operational truth. History preserves previous changes.

15. tasks Collection

Field

Type

Rules

_id

ObjectId

Primary key

weddingId

ObjectId → Wedding

Required

eventId

ObjectId → Event

Optional

title

String

Required

assigneeId

ObjectId → User

Owner/Partner/Organizer

priority

String

LOW/MEDIUM/HIGH

deadline

Date

Optional

status

String

PENDING/IN_PROGRESS/COMPLETED

notes

String

Optional

dependencyIds

Array&lt;ObjectId&gt;

Task dependencies

isDeleted

Boolean

Soft delete

createdAt/updatedAt

Date

Timestamps

16. vendors Collection

V1 uses wedding-specific vendor records; there is no global vendor marketplace.

Field

Type

Rules

_id

ObjectId

Primary key

weddingId

ObjectId → Wedding

Required

category

String

Required

name

String

Required

contact

Object

Optional

service

String

Optional

agreedAmount

Number

Non-negative

paidAmount

Number

Non-negative

notes

String

Optional

isDeleted

Boolean

Soft delete

createdAt/updatedAt

Date

Timestamps

Remaining vendor amount is calculated as agreedAmount - paidAmount.

17. budgetItems Collection

Field

Type

Rules

_id

ObjectId

Primary key

weddingId

ObjectId → Wedding

Required

category

String

Required

name

String

Required

plannedAmount

Number

Non-negative

spentAmount

Number

Non-negative

notes

String

Optional

isDeleted

Boolean

Soft delete

createdAt/updatedAt

Date

Timestamps

Remaining amount is calculated dynamically. Wedding totals are derived from budget items to avoid inconsistent duplicated totals.

18. galleryAlbums Collection

Field

Type

Rules

_id

ObjectId

Primary key

weddingId

ObjectId → Wedding

Required

eventId

ObjectId → Event

Optional

name

String

Required

visibility

String

PRIVATE/PUBLIC

isDeleted

Boolean

Soft delete

createdAt/updatedAt

Date

Timestamps

19. photos Collection

MongoDB stores photo metadata only. Binary files use the storage adapter.

Field

Type

Rules

_id

ObjectId

Primary key

albumId

ObjectId → GalleryAlbum

Required

storageKey

String

Required

thumbnailKey

String

Optional

fileName

String

Optional

mimeType

String

Validated image MIME type

size

Number

Required

metadata

Object

Dimensions/safe metadata

visibility

String

PRIVATE/PUBLIC

uploadedBy

ObjectId → User

Authorized couple uploader

isDeleted

Boolean

Soft delete

createdAt/updatedAt

Date

Timestamps

Development uses local storage; production uses cloud/object storage. Private objects must not be publicly enumerable.

20. liveStreams Collection

Field

Type

Rules

_id

ObjectId

Primary key

weddingId

ObjectId → Wedding

Required

eventId

ObjectId → Event

Optional

provider

String

YOUTUBE initially

streamUrl

String

Provider URL

accessMode

String

PUBLIC/RESTRICTED

recordingEnabled

Boolean

Recording availability

status

String

CONFIGURED/LIVE/ENDED/ERROR

providerData

Object

Provider-specific

createdAt/updatedAt

Date

Timestamps

21. notifications Collection

Field

Type

Rules

_id

ObjectId

Primary key

userId

ObjectId → User

Required

weddingId

ObjectId → Wedding

Optional

type

String

Notification code

title

String

Required

message

String

Required

channel

String

IN_APP/EMAIL

readAt

Date

Optional

metadata

Object

Optional

createdAt

Date

Required

22. auditLogs Collection

Field

Type

Rules

_id

ObjectId

Primary key

actorId

ObjectId → User

Optional

weddingId

ObjectId → Wedding

Optional

action

String

Required

targetType

String

Optional

targetId

ObjectId

Optional

metadata

Object

Safe context only

createdAt

Date

Required

Examples: ORGANIZER_ADDED, PERMISSION_CHANGED, GUEST_DELETED, WEDDING_ARCHIVED, WEDDING_RESTORED, BUDGET_UPDATED.

Never store passwords, raw tokens, or unnecessary secrets in audit metadata.

23. Soft Delete Strategy

Use isDeleted=false and deletedAt=null for operational entities where history matters.

Normal queries exclude deleted records.

Administrative/audit queries may explicitly include deleted records.

Soft delete does not replace authorization.

Wedding permanent deletion follows its controlled deletion workflow.

24. Wedding Lifecycle

ACTIVE  |  +--&gt; ARCHIVED --&gt; RESTORE --&gt; ACTIVE  |  +--&gt; DELETION_PENDING --&gt; controlled permanent deletionARCHIVED:- Read allowed- Normal writes blocked- Owner can restore

25. Validation Rules

Normalize and uniquely index active user emails.

Store only secure password hashes.

Require partner names, wedding date, and venue during wedding setup.

Couple photo is optional.

Amounts must be numeric and non-negative.

Use controlled enums for roles, permissions, statuses, themes, and visibility.

Validate ObjectId references and cross-entity ownership.

Invitation tokens must be cryptographically random and unique.

Attendee counts must be non-negative and internally consistent.

Validate uploaded image type and size.

Archived weddings reject normal writes.

Public APIs use explicit safe projections.

26. Recommended MongoDB Indexes

Collection

Index

Reason

users

email

Unique login identity

users

isDeleted + email

Account lookup

weddings

slug

Unique public URL

weddings

ownerId + status

Owner dashboard

weddingMemberships

userId + weddingId

Unique membership

weddingMemberships

weddingId + status

Member listing

events

weddingId + date

Upcoming events

guests

weddingId

Guest listing

guestEvents

guestId + eventId

Unique guest/event

guestEvents

eventId + rsvpStatus

RSVP reporting

invitations

tokenHash/token

Unique invitation credential

invitations

weddingId + guestId

Invitation lookup

rsvps

invitationId + eventId

RSVP lookup

tasks

weddingId + deadline

Deadline queries

tasks

weddingId + status

Task dashboard

vendors

weddingId + category

Vendor listing

budgetItems

weddingId + category

Budget reporting

galleryAlbums

weddingId + eventId

Album lookup

photos

albumId + createdAt

Photo listing

notifications

userId + readAt + createdAt

Notification inbox

auditLogs

weddingId + createdAt

Audit history

27. Authorization and Isolation

Request  ↓ JWT validationIdentify User  ↓Identify Wedding  ↓Find WeddingMembership  ↓Check Role + Permission  ↓Check Wedding Status  ↓Allow / Deny

Frontend authorization is only a UI convenience; backend authorization is mandatory.

Every wedding-scoped query must constrain the authenticated user's authorized wedding membership.

Permissions in Wedding A never grant access to Wedding B.

Owner-only destructive operations require stronger verification.

Guest access is token-scoped and never based on arbitrary guest IDs.

28. Public Data Projection

Public:- Couple names- Wedding date- Public events- Public venue/map- Public story- Public gallery- Public live-stream informationPrivate:- Guest contacts/groups- RSVP details- Organizer permissions- Budget- Tasks- Audit logs- Account data

Never return complete Wedding, Guest, Membership, or RSVP documents from public endpoints.

29. API ↔ Database Mapping

API/module

Collections

POST /api/v1/auth/register

users

POST /api/v1/auth/login

users

GET /api/v1/users/me

users

POST /api/v1/weddings

weddings, weddingMemberships

GET /api/v1/weddings/:weddingId

weddings + membership

Partner/organizer invite

users, weddingMemberships

Permission update

weddingMemberships, auditLogs

Events

events

Guests

guests

Guest-event assignment

guestEvents

Invitations

invitations

Public/guest invitation flow

invitations, rsvps

Tasks

tasks

Vendors

vendors

Budget

budgetItems

Gallery

galleryAlbums, photos

Live stream

liveStreams

Notifications

notifications

Public /w/:slug

weddings + public-safe related data

Archive/restore/delete

weddings + related data + auditLogs

30. End-to-End Data Flow

Register owner → users document.

Create wedding → weddings document.

Create owner membership → weddingMemberships document.

Invite partner/organizer → membership workflow.

Create events → events documents.

Create guests → guests documents.

Assign guests to events → guestEvents documents.

Publish invitation → invitation document with secure token/version.

Guest opens invitation → invitation status becomes OPENED.

Guest submits RSVP → rsvps current state + history.

Dashboard aggregates actual attendee counts.

31. Security Requirements

Use MongoDB Atlas authentication and least-privilege database users.

Use TLS for database connections.

Restrict production database network access appropriately.

Enable managed backups and point-in-time recovery according to production policy.

Keep secrets out of Git and source code.

Rate-limit authentication, reset, OTP, and token-sensitive endpoints.

Use private storage for private gallery assets.

Never put secrets in audit logs.

Use public-safe projections.

Enforce authorization server-side for every wedding-scoped operation.

32. Performance and Scalability

Index weddingId-based queries.

Avoid unbounded arrays in Wedding.

Paginate guests, notifications, photos, tasks, vendors, and audit logs.

Use aggregation for dashboard totals where appropriate.

Use Redis/BullMQ for asynchronous reminders and email.

Use object storage for media.

Introduce caching only after measuring bottlenecks.

Keep the schema compatible with future selective service extraction.

33. Backup, Recovery and Retention

Use MongoDB Atlas backups in production.

Define recovery objectives before launch.

Test restoration periodically.

Archived weddings preserve historical information.

Permanent deletion follows explicit verification and retention policy.

Account deletion must account for ownership, memberships, historical actions, and applicable retention needs.

34. Transactions

Use MongoDB transactions when multiple related writes must succeed or fail together; do not use transactions for every CRUD operation.

Wedding creation + initial owner membership: recommended transaction.

Membership change + audit record: transaction where consistency requires it.

Multi-record invitation/RSVP workflows: transaction where needed.

Photo metadata creation should happen only after successful storage upload, or be safely rolled back.

35. Mongoose Model Structure

backend/└── models/    ├── User.js    ├── Wedding.js    ├── WeddingMembership.js    ├── Event.js    ├── Guest.js    ├── GuestEvent.js    ├── InvitationTemplate.js    ├── Invitation.js    ├── RSVP.js    ├── Task.js    ├── Vendor.js    ├── BudgetItem.js    ├── GalleryAlbum.js    ├── Photo.js    ├── LiveStream.js    ├── Notification.js    └── AuditLog.js

36. Naming Conventions

Use camelCase fields.

Use ObjectId for internal references.

Store timestamps in UTC; convert for display.

Use stable enum constants for statuses and roles.

Use machine-readable notification and audit action codes.

Use Mongoose timestamps on core models.

37. Critical Business Rules

One wedding has one owner.

Users may own or participate in multiple weddings.

Membership is unique per user/wedding.

Roles are wedding-specific.

Guests need no account.

Guests can attend multiple events.

Invitation and RSVP states are separate.

RSVP can be changed later.

Guests cannot upload gallery photos in V1.

Organizer access is permission-controlled.

Removing an organizer revokes access but preserves historical work.

Archived weddings are read-only.

Owners can restore archived weddings.

Permanent deletion is controlled and verified.

Public endpoints expose only public-safe data.

38. Future Extension Points

WhatsApp/SMS adapters

Additional live-stream providers

Global vendor marketplace

Online payments

Guest accounts

Calendar integrations

Advanced invitation editor

Analytics

Custom domains

Additional Indian languages

Advanced media processing

Future Super Admin

39. Recommended Implementation Order

Create MongoDB Atlas development database and environment configuration.

Create Mongoose connection/configuration.

Create common schema conventions and validation.

Implement User model.

Implement Wedding and WeddingMembership.

Implement authorization middleware.

Implement Event, Guest, GuestEvent.

Implement InvitationTemplate, Invitation, RSVP.

Implement Task, Vendor, BudgetItem.

Implement GalleryAlbum and Photo with storage adapter.

Implement LiveStream and Notification.

Implement AuditLog.

Add indexes and optimized query patterns.

Add model/API integration tests.

Verify archive, restore, deletion, and public projection rules.

40. Final Architecture Decision

MakeMyMarriage will use MongoDB with Mongoose and a separate-collection, reference-oriented model. Wedding-scoped data is isolated by weddingId and protected by backend membership/permission authorization. The design avoids large embedded Wedding documents so guests, events, invitations, RSVP records, tasks, vendors, budgets, media metadata, notifications, and audit records can scale independently.

The schema is designed for the approved V1 product while preserving clean extension points for future messaging, vendor marketplace, payments, additional streaming providers, analytics, localization, and administration.

Appendix A – Core Relationships

Parent

Child

Relationship

User

Wedding

Owner via ownerId

User

WeddingMembership

One-to-many

Wedding

WeddingMembership

One-to-many

Wedding

Event

One-to-many

Wedding

Guest

One-to-many

Guest

GuestEvent

One-to-many

Event

GuestEvent

One-to-many

Wedding

Invitation

One-to-many

Guest

Invitation

One-to-many

Invitation

RSVP

Event-scoped

Wedding

Task

One-to-many

Wedding

Vendor

One-to-many

Wedding

BudgetItem

One-to-many

Wedding

GalleryAlbum

One-to-many

GalleryAlbum

Photo

One-to-many

Wedding

LiveStream

One-to-many

User

Notification

One-to-many

Wedding

AuditLog

One-to-many

Appendix B – Developer Safety Rules

Never trust weddingId, memberId, guestId, or role values from the frontend.

Never expose complete MongoDB documents from public endpoints.

Never store plaintext passwords.

Never commit secrets.

Never store large image binaries in the main MongoDB documents.

Never authorize invitation access using only a guest ObjectId.

Never permit writes to an archived wedding.

Never delete organizer history merely because membership is removed.

Always validate cross-document ownership before updates.

Always paginate potentially large lists.