cat > README.md <<'EOF'
# DevSoc — Developer Community Platform

A full-stack web platform built for **DevSoc**, a student developer community.

DevSoc provides a centralized platform for managing technical events, projects, certificates, recruitment, the core team, mentors, blogs, testimonials, and student collaboration — with a public-facing website and a protected administration dashboard.

**Live Website:** https://devsoc-three.vercel.app

---

## Overview

DevSoc is designed as more than a static club website.

It combines a modern public website with a functional admin platform where authorized administrators can manage the community's content and operations in real time.

The platform is built using **Next.js, React, Tailwind CSS, PostgreSQL, and Supabase**, and is deployed on **Vercel**.

---

## Key Features

### Public Platform

- Modern space-themed landing page
- About and transparency section
- Public certificate verification
- Core team showcase
- Mentor directory
- Event calendar
- Upcoming and past events
- Event RSVP functionality
- Project showcase
- Project filtering by tags/domains
- Project upvotes and comments
- Student project submissions
- Team Up board for finding hackathon/project teammates
- Blog with individual post pages
- Testimonials and success stories
- Public testimonial submission
- Newsletter subscription
- FAQ section
- Contact form
- Feedback widget

### Certificate System

- Admin-issued certificates
- Unique certificate IDs
- Public certificate verification
- Certificate status management
- Revoke and reinstate certificates
- Certificate PDF generation

### Admin Dashboard

The protected `/admin` dashboard provides centralized management for:

- Dashboard statistics
- Events
- Projects
- Recruitment applications
- Mentors
- Core Team
- Certificates
- Testimonials
- Blog posts
- FAQs
- Inbox and submissions

Administrators can perform operations such as:

- Create
- Read
- Update
- Delete
- Approve
- Reject
- Publish
- Unpublish
- Revoke
- Reinstate

---

## Core Team Management

The admin dashboard includes a dedicated **Team Management** system.

Administrators can:

- Add new team members
- Edit existing members
- Remove members
- Assign roles
- Assign subteams
- Add biographies
- Add GitHub profiles
- Add LinkedIn profiles

Changes made through the admin dashboard are persisted in the PostgreSQL database and reflected on the public Team page.

---

## Technology Stack

### Frontend

- **Next.js 14**
- **React**
- **Tailwind CSS**
- JavaScript
- Responsive UI

### Backend

- **Next.js App Router**
- Next.js API Routes
- Server-side authentication
- Generic CRUD API architecture

### Database

- **PostgreSQL**
- **Supabase**
- `pg` PostgreSQL client

### Authentication

- Protected admin routes
- Signed session cookies
- Server-side session validation
- Environment-based admin configuration

### Deployment

- **Vercel**
- GitHub-based deployment workflow
- Supabase PostgreSQL database

---

## Architecture

```text
                    ┌─────────────────────┐
                    │     DevSoc Users    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next.js Frontend  │
                    │  Public + Admin UI  │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │  Public Pages   │        │  Admin Dashboard│
        │                 │        │                 │
        │ Events          │        │ Events          │
        │ Projects        │        │ Projects        │
        │ Team            │        │ Team            │
        │ Certificates    │        │ Certificates    │
        │ Blog            │        │ Blog            │
        │ etc.            │        │ etc.            │
        └────────┬────────┘        └────────┬────────┘
                 │                          │
                 └────────────┬─────────────┘
                              ▼
                    ┌─────────────────────┐
                    │   Next.js API Layer │
                    │                     │
                    │ CRUD + Custom APIs  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ PostgreSQL /        │
                    │ Supabase            │
                    └─────────────────────┘
