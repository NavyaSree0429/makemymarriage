# MakeMyMarriage_PRD_v1

💍 MakeMyMarriage

Product Requirements Document (PRD)

Version 1.0 | Approved Product Scope | MERN

Document Item

Value

Product

MakeMyMarriage

Version

1.0

Primary users

Couples and Wedding Organizers

Secondary users

Partners and Guests

Technology

MongoDB + Express.js + React + Node.js

V1 payments

None

V1 admin panel

Not included

1. Executive Summary

MakeMyMarriage is a centralized wedding-management platform for couples and wedding organizers. It brings wedding setup, multiple events, digital invitations, guest management, RSVP, organizer collaboration, tasks, vendors, budget tracking, a wedding website, private photo gallery, live-stream integration, notifications, maps, countdowns, and post-wedding archiving into one workspace.

V1 intentionally excludes a vendor marketplace, online payments, guest accounts, guest photo uploads, a full admin panel, a Canva-style invitation editor, and proprietary video-streaming infrastructure.

2. Product Vision

Make wedding planning simpler by giving the couple and trusted organizers one shared workspace for the entire wedding lifecycle—from setup and invitations to event execution and post-wedding memories.

3. Goals

Provide one wedding workspace for couples and organizers.

Support multiple events under one wedding.

Make invitations and RSVP easy to distribute and track.

Allow guests to RSVP without account creation.

Provide granular organizer permissions.

Centralize tasks, vendors, budget, schedules, gallery, and live streaming.

Provide a shareable wedding website with couple-controlled privacy.

Support archiving after the wedding.

Use a multilingual-ready architecture for Indian languages.

4. Non-Goals for V1

Vendor marketplace or vendor booking marketplace.

Online payments or payment gateway.

Subscription/monetization system.

Guest accounts.

Guest photo uploads.

Admin dashboard.

Full drag-and-drop invitation editor.

Building proprietary live-streaming infrastructure.

5. User Roles

Role

Purpose

Access

Wedding Owner

Creates and owns wedding

Full control; controls permissions

Partner

Second member of couple

Shared wedding management

Organizer

Plans/manages weddings

Only permissions granted by owner; one organizer can manage multiple weddings

Guest

Receives invitation and responds

Invitation + event details + RSVP; no account required

Ownership rule: the account that creates a wedding is the Wedding Owner. A couple account initially manages one wedding. A wedding can have multiple organizers.

6. Functional Modules

Authentication &amp; Accounts

Sign up, login, logout, forgot/reset password, profile, account deletion.

Registered users are owners, partners, or organizers. Guests do not need accounts.

Wedding Setup

Required: partner names, wedding date, venue/location.

Optional: couple photo, description, theme, contact information.

Couple photo must not block wedding creation.

Partner Management

Owner invites the second partner.

Partner accepts and accesses the same wedding.

Multiple Events

Support Engagement, Haldi, Mehendi, Sangeet, Wedding, Reception, and custom events.

Each event can have date, time, venue, address, map, description, schedule, guests, tasks, RSVP, and applicable live-stream details.

Guest invitation and RSVP are event-specific.

Wedding Dashboard

Show couple names, countdown, upcoming events, guests, invitation/RSVP summary, tasks, budget, gallery and live-stream status.

Digital Invitations

Template-based invitation customization.

Customize text, fonts, colors, images, events, venue and theme.

Preview and publish.

Share through WhatsApp, copy link, email, and downloadable image/PDF.

Guest Management

Store name, phone, email, relationship, attendee count, invited events, invitation status, RSVP status, food preference, notes.

Support multiple attendees per RSVP.

RSVP &amp; Reminders

Unique guest link; no guest account required.

RSVP: Yes, No, Maybe.

Guest can specify attendee count and food preference.

Guest can change RSVP later.

Automatic and manual reminders.

Initial channels: in-app and email.

Organizer Management

Invite existing or new organizers.

Multiple organizers per wedding.

Owner controls granular permissions.

Task Planner

Tasks assigned to owner, partner, or organizer.

Fields: title, event, assignee, priority, deadline, status, notes.

Statuses: Pending, In Progress, Completed.

Overdue tasks are identified.

Vendor Management

Multiple vendors per category.

Store name, category, contact, service and notes.

No marketplace or payment processing in V1.

Budget Management

Track total, planned, spent, and remaining amounts.

Owner controls organizer view/edit access.

No online payment gateway.

Wedding Website

Custom URL such as /w/rahul-priya.

Couple controls public/private visibility.

Can show names, date, countdown, events, schedule, venue/map, RSVP, invitation and live-stream information.

Gallery remains separately private.

Wedding Theme

Themes such as Traditional, Modern, Floral, Royal and Minimal.

Theme can influence invitation and website.

Private Gallery

Only the couple uploads photos.

Albums can be organized by event.

Gallery is private.

Organizer access is permission-controlled.

Live Streaming

Use an external provider.

Couple/authorized organizer configures it.

Couple chooses whether recording is saved.

Notifications

In-app and email.

RSVP reminders, task deadlines, organizer invitations, upcoming events, countdown, etc.

Venue &amp; Maps

Venue name, address, map location, directions link.

Countdown

Automatic days remaining.

Example: Wedding in 72 Days.

Wedding date shows Wedding Today.

Archive

Owner archives wedding.

Archived wedding is read-only while remaining viewable.

Deletion

Owner can permanently delete wedding after confirmation.

Users can delete their own accounts.

Localization

Architecture supports English, Telugu, and additional Indian languages.

7. Organizer Permission Matrix

Area

Owner

Partner

Organizer

Guest

Wedding settings

Full

Manage

If granted

No

Events

Full

Manage

If granted

View invited

Guests

Full

Manage

If granted

Own RSVP

Invitations

Full

Manage

If granted

Own invitation

RSVP management

Full

Manage

If granted

Own RSVP

Tasks

Full

Manage

If granted

No

Vendors

Full

Manage

If granted

No

Budget

Full

Owner controls

If granted

No

Gallery upload

Yes

Yes

If granted

No

Gallery view

Yes

Yes

If granted

No

Live stream

Full

Manage

If granted

Watch if allowed

Notifications

Full

Manage

If granted

Relevant

Archive

Yes

No

No

No

Delete wedding

Yes

No

No

No

8. Core User Flows

Owner onboarding

Register/login.

Create wedding with required details.

Optionally add photo/theme.

Open dashboard.

Invite partner and organizer(s).

Organizer onboarding

Owner invites organizer.

Organizer accepts or creates account.

Owner configures permissions.

Organizer accesses permitted modules only.

Guest RSVP

Owner/authorized organizer creates guest.

Guest is assigned to event(s).

System generates unique invitation link.

Invitation is shared.

Guest opens without account.

Guest submits or later changes RSVP.

Dashboard updates counts and statuses.

Event planning

Create event.

Set date/time/venue.

Assign guests.

Create tasks.

Add schedule.

Configure live stream if needed.

Wedding completion

Wedding date passes.

Owner chooses Archive Wedding.

Wedding becomes read-only.

Historical information remains accessible.

9. Functional Requirements

ID

Area

Requirement

FR-001

Authentication

System shall support registration/login for owners, partners and organizers.

FR-002

Wedding creation

Owner shall create a wedding without uploading a couple photo.

FR-003

Partner

Owner shall invite a partner to the same wedding.

FR-004

Organizers

Owner shall add multiple organizers, including new users.

FR-005

Permissions

System shall enforce organizer permissions server-side.

FR-006

Events

System shall support multiple events per wedding.

FR-007

Event guests

System shall allow event-specific guest invitations.

FR-008

Unique links

System shall generate unique invitation links.

FR-009

RSVP

Guest shall RSVP without creating an account.

FR-010

RSVP update

Guest shall update RSVP through the invitation link.

FR-011

Attendee count

Dashboard shall count submitted attendee numbers.

FR-012

Status tracking

Invitation and RSVP statuses shall be tracked separately.

FR-013

Reminders

System shall support automatic and manual RSVP reminders.

FR-014

Tasks

System shall support assignment, priority, deadline, status and notes.

FR-015

Vendors

System shall support multiple vendors per category without marketplace.

FR-016

Budget

System shall calculate planned, spent and remaining amounts.

FR-017

Website

System shall generate a custom wedding website URL.

FR-018

Website privacy

Owner shall control public/private website visibility.

FR-019

Gallery

Only the couple shall upload photos.

FR-020

Gallery privacy

Gallery shall be private.

FR-021

Live stream

System shall integrate an external streaming provider.

FR-022

Notifications

System shall support in-app and email notifications.

FR-023

Maps

System shall store venue/map data and provide directions access.

FR-024

Countdown

System shall calculate days remaining.

FR-025

Archive

Owner shall archive a wedding as read-only.

FR-026

Deletion

Owner shall delete a wedding after confirmation.

FR-027

Localization

Frontend shall use a translation-ready architecture.

10. Initial MongoDB Data Model

Entity

Purpose / key fields

User

userId, name, email, phone, passwordHash, language, timestamps

Wedding

weddingId, ownerId, partnerIds, names, date, venue, privacy, theme, websiteSlug, status

WeddingMembership

weddingId, userId, role, permissions, status, timestamps

Event

eventId, weddingId, name, date, time, venue, address, map, description

Guest

guestId, weddingId, name, phone, email, relationship, notes

GuestEvent

guestId, eventId, invitationStatus, invitationToken, RSVP, attendeeCount, foodPreference

InvitationTemplate

templateId, name, theme data, customization fields

Invitation

invitationId, weddingId, guest/event references, template data, published version

Task

taskId, weddingId, eventId, title, assigneeId, priority, deadline, status, notes

Vendor

vendorId, weddingId, category, name, contact, service, notes

BudgetItem

budgetItemId, weddingId, category, description, plannedAmount, spentAmount

GalleryAlbum

albumId, weddingId, eventId, name, privacy

Photo

photoId, albumId, uploaderId, storageUrl, metadata

LiveStream

streamId, weddingId/eventId, provider, streamUrl, visibility, recordingPreference, status

Notification

notificationId, userId, type, message, readStatus, channel, timestamps

11. Initial REST API Structure

Module

Example endpoints

Auth

POST /api/auth/register | POST /api/auth/login | POST /api/auth/forgot-password

Users

GET/PATCH /api/users/me | DELETE /api/users/me

Weddings

POST /api/weddings | GET/PATCH /api/weddings/:id | DELETE /api/weddings/:id | POST /api/weddings/:id/archive

Members

POST /api/weddings/:id/partners/invite | POST /api/weddings/:id/organizers/invite | PATCH /api/weddings/:id/members/:memberId/permissions

Events

POST/GET /api/weddings/:id/events | PATCH/DELETE /api/events/:eventId

Guests

POST/GET /api/weddings/:id/guests | PATCH/DELETE /api/guests/:guestId

Invitations

POST /api/weddings/:id/invitations | GET /api/invitations/:token | POST /api/invitations/:token/publish

RSVP

POST/PATCH /api/invitations/:token/rsvp | GET /api/weddings/:id/rsvp-summary

Tasks

POST/GET /api/weddings/:id/tasks | PATCH/DELETE /api/tasks/:taskId

Vendors

POST/GET /api/weddings/:id/vendors | PATCH/DELETE /api/vendors/:vendorId

Budget

POST/GET /api/weddings/:id/budget-items | PATCH/DELETE /api/budget-items/:itemId

Gallery

POST /api/weddings/:id/albums | POST /api/albums/:albumId/photos | GET /api/weddings/:id/gallery

Website

GET /w/:slug | PATCH /api/weddings/:id/website-settings

Notifications

GET /api/notifications | PATCH /api/notifications/:id/read

12. Non-Functional Requirements

Area

Requirement

Security

Hash passwords; secure tokens; validate inputs; rate-limit sensitive endpoints.

Authorization

Every protected API checks identity, wedding membership and permission.

Privacy

Private gallery/wedding data must not be exposed through public endpoints.

Performance

Use pagination for guests, tasks, notifications and gallery; keep common pages responsive.

Scalability

Use object/media storage rather than MongoDB for photo binaries.

Reliability

Critical writes return clear success/failure states.

Accessibility

Semantic forms, labels, keyboard-friendly controls and readable contrast.

Localization

All UI strings come from a translation layer.

Auditability

Store actor and timestamps for permission changes, RSVP, archive and deletion.

13. Security &amp; Privacy Rules

Never rely on frontend checks alone for authorization.

Invitation tokens must be random and difficult to guess.

A guest invitation must not expose other guests' private information.

Private gallery assets must not be publicly enumerable.

Organizer access must be revocable by the owner.

Archived weddings reject normal edits.

Passwords must never be stored in plaintext.

Wedding deletion requires explicit confirmation.

14. Notification Matrix

Trigger

Recipient

Channel

Partner invitation

Partner

In-app + Email

Organizer invitation

Organizer

In-app + Email

RSVP submitted

Owner/authorized organizer

In-app + Email

RSVP reminder

Guest

Email; in-app where applicable

Task assigned

Assignee

In-app + Email

Task deadline/overdue

Assignee / manager

In-app + Email

Upcoming event

Relevant users/guests

In-app + Email

Countdown

Couple/authorized users

In-app

15. MVP Acceptance Criteria

☐ Account registration and login work.

☐ Wedding can be created without a couple photo.

☐ Partner can be invited and join the same wedding.

☐ Multiple organizers can be invited.

☐ Owner can configure organizer permissions.

☐ Multiple events can be created.

☐ Guests can be assigned to specific events.

☐ Unique invitation links are generated.

☐ Guests can RSVP without accounts.

☐ Guests can update RSVP.

☐ Attendee totals use the guest-provided attendee count.

☐ Invitation and RSVP status are separate.

☐ Automatic/manual RSVP reminders work through supported channels.

☐ Tasks support assignee, priority, deadline and status.

☐ Multiple vendors per category are supported.

☐ Budget totals calculate correctly.

☐ Custom wedding website slug is generated.

☐ Website visibility is controlled by the couple.

☐ Only the couple can upload gallery photos.

☐ Gallery is private.

☐ External live streaming can be configured.

☐ Countdown is calculated from the wedding date.

☐ Archive makes the wedding read-only.

☐ Wedding deletion requires confirmation.

☐ Account deletion is supported.

☐ UI is localization-ready.

16. V1 vs Future Scope

V1 / MVP

Future

Wedding setup/dashboard

Advanced analytics

Multiple events

Advanced event automation

Guest management + RSVP

Optional guest accounts

Template-based invitations

Advanced drag-and-drop editor

Organizer collaboration

Advanced team/workspace tools

Task planner

Calendar integrations

Vendor records

Vendor marketplace/booking

Budget tracking

Online payments

Private couple gallery

Guest contributions if later approved

External live streaming

More providers/richer video features

Wedding website

Custom domains

In-app + email

WhatsApp/SMS automation

Archive/delete

Long-term memories/social features

Multilingual-ready

Expanded language catalog

17. Suggested MERN Architecture

React frontend with reusable components and route-based pages.

Node.js + Express REST API.

MongoDB + Mongoose.

Authentication middleware and wedding-level authorization middleware.

Service layer for invitations, RSVP, notifications, media, and live-stream integration.

Object/media storage for photos and generated files.

Transactional email provider.

Map provider integration.

External live-stream provider.

18. Product Rules to Preserve

Couple photo is optional during setup.

One couple account initially manages one wedding.

One organizer account can manage multiple weddings.

One wedding can have multiple organizers.

Guests do not need accounts for RSVP.

Invitation links are unique.

RSVP is event-specific.

Attendee count contributes to dashboard totals.

Only the couple uploads photos.

Gallery is private.

Organizer permissions are controlled by the couple.

Budget visibility/edit access is controlled by the couple.

No online payments in V1.

No vendor marketplace in V1.

No admin panel in V1.

Archived weddings are read-only.

Website privacy is controlled by the couple.

Architecture supports multiple Indian languages.

19. Implementation Decisions Still to Choose

Exact email provider and email templates.

Map provider.

Live-stream provider.

Object/media storage provider and image limits.

Initial language list for release.

Invitation template catalog and design system.

Authentication/session strategy.

Data retention, backups, and deletion policy.

Future monetization model.

20. Final Product Definition

MakeMyMarriage V1 is a wedding operating workspace, not a wedding marketplace. Its core value is bringing the couple, partner, organizers, guests, events, invitations, RSVP, planning tasks, vendors, budget, website, private gallery, and live-stream access into one coordinated experience.

The architecture should remain extensible so future versions can add vendor discovery/booking, payments, subscriptions, advanced invitation design, richer integrations, and an admin console without redesigning the core wedding, user, event, guest, and permission models.

— End of MakeMyMarriage PRD v1.0 —