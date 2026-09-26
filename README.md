# DevSoc — Developer Community Platform

<p align="center">
  <strong>Build • Learn • Collaborate • Ship</strong>
</p>

<p align="center">
  A full-stack platform built for a student developer community to manage events, projects, certificates, recruitment, teams, mentors, blogs, and collaboration — all from one place.
</p>

<p align="center">
  <a href="https://devsoc-three.vercel.app">Live Website</a> •
  <a href="https://github.com/kalyansushma-06/DevSoc">Repository</a>
</p>

---

## 🚀 Overview

**DevSoc** is a full-stack developer community platform designed to connect students with technical events, projects, mentors, teammates, and opportunities.

Instead of functioning as a static college-club website, DevSoc provides a complete **public platform + protected administration system**.

Administrators can manage the platform through a centralized dashboard while students interact with the public website to discover events, projects, certificates, blogs, mentors, and collaboration opportunities.

The application is built with **Next.js, React, Tailwind CSS, PostgreSQL, and Supabase**, and is deployed on **Vercel**.

---

## ✨ Highlights

* 🌌 Modern developer-focused interface
* 🔐 Protected admin dashboard
* 🗄️ PostgreSQL database powered by Supabase
* 🎓 Public certificate verification
* 📜 Certificate generation and management
* 📅 Event management and RSVP system
* 🚀 Student project showcase
* 🤝 Team Up board for finding project/hackathon teammates
* 👥 Core team and mentor management
* 📝 Blog publishing system
* 💬 Project comments and upvotes
* ⭐ Testimonials and success stories
* 📩 Contact, feedback and newsletter management
* 📊 Admin dashboard with platform statistics
* ⚡ Deployed on Vercel

---

# 🌐 Public Platform

## Home

A space-inspired landing page designed around the DevSoc visual identity.

Features include:

* Animated starfield
* Developer-focused visual design
* Responsive navigation
* Community-focused sections
* Featured content

---

## 🎓 Certificate Verification

Anyone can verify a DevSoc certificate using its unique certificate ID.

```text
Certificate ID
      ↓
Verification API
      ↓
PostgreSQL
      ↓
Certificate Details
      ↓
Verified / Revoked Status
```

Administrators can:

* Issue certificates
* View certificates
* Revoke certificates
* Reinstate certificates
* Delete certificates

---

## 📅 Events

The event system supports:

* Upcoming events
* Past events
* Event descriptions
* RSVP functionality
* Event recaps
* Recording links
* Administrative event management

---

## 🚀 Project Showcase

Students can submit their projects to the platform.

The system supports:

* Project submissions
* Domain/tag filtering
* Project descriptions
* GitHub/project links
* Upvotes
* Comments
* Admin moderation

Submitted projects can remain pending until reviewed by an administrator.

---

## 🤝 Team Up

The Team Up board allows students to find collaborators for:

* Hackathons
* Side projects
* Open-source projects
* Technical competitions
* Startup ideas

Students can browse existing listings and discover potential teammates.

---

## 👥 Core Team & Mentors

The platform includes dedicated pages for:

* Core team members
* Team roles
* Subteams
* Member biographies
* LinkedIn profiles
* GitHub profiles
* Mentors

The Core Team is managed directly from the admin dashboard.

---

# 🛠️ Admin Dashboard

DevSoc includes a protected administration platform at:

```text
/admin
```

The dashboard provides centralized management for the entire platform.

### Available Modules

| Module       | Capabilities                                 |
| ------------ | -------------------------------------------- |
| Dashboard    | Platform statistics & pending items          |
| Events       | Create, edit and delete                      |
| Projects     | Review, approve, reject and delete           |
| Members      | Manage recruitment applications              |
| Team         | Add, edit and remove members                 |
| Mentors      | Add, approve and remove                      |
| Certificates | Issue, revoke, reinstate and delete          |
| Blog         | Draft, publish, edit and delete              |
| Testimonials | Approve, unpublish and delete                |
| FAQ          | Add, edit and delete                         |
| Inbox        | Contact, feedback and newsletter submissions |

---

# 🧩 Core Team Management

The Team module provides complete CRUD functionality.

Administrators can:

```text
Add Member
    ↓
Assign Role
    ↓
Assign Subteam
    ↓
Add Bio + Social Links
    ↓
Save to PostgreSQL
    ↓
Display on Public Team Page
```

Supported fields include:

* Name
* Role
* Subteam
* Biography
* GitHub
* LinkedIn

Changes made through the dashboard are persisted in PostgreSQL and reflected on the public website.

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     DevSoc Users    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Next.js        │
                    │   React Frontend    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
     ┌──────────────────┐             ┌──────────────────┐
     │   Public Pages   │             │  Admin Dashboard │
     │                  │             │                  │
     │ Events           │             │ Events           │
     │ Projects         │             │ Projects         │
     │ Team             │             │ Team             │
     │ Certificates     │             │ Certificates     │
     │ Blog             │             │ Blog             │
     │ Team Up          │             │ Mentors          │
     └────────┬─────────┘             └────────┬─────────┘
              │                                │
              └──────────────┬─────────────────┘
                             ▼
                    ┌─────────────────────┐
                    │    Next.js API      │
                    │   CRUD + Custom     │
                    │     Endpoints      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ PostgreSQL /        │
                    │      Supabase       │
                    └─────────────────────┘
```

---

# 💻 Tech Stack

### Frontend

* Next.js 14
* React
* Tailwind CSS
* JavaScript
* Responsive UI

### Backend

* Next.js App Router
* Next.js API Routes
* Server-side authentication
* Reusable CRUD API architecture

### Database

* PostgreSQL
* Supabase
* `pg` PostgreSQL client

### Deployment

* Vercel
* GitHub
* Supabase

### Development Tools

* Git
* GitHub
* VS Code
* npm

---

# 📂 Project Structure

```text
DevSoc/
│
├── app/
│   ├── page.js
│   ├── about/
│   ├── verify/
│   ├── team/
│   ├── events/
│   ├── projects/
│   ├── teamup/
│   ├── blog/
│   ├── faq/
│   ├── contact/
│   ├── join/
│   │
│   ├── admin/
│   │   ├── login/
│   │   └── (app)/
│   │       ├── events/
│   │       ├── projects/
│   │       ├── members/
│   │       ├── mentors/
│   │       ├── team/
│   │       ├── certificates/
│   │       ├── testimonials/
│   │       ├── blog/
│   │       ├── faq/
│   │       └── inbox/
│   │
│   └── api/
│       ├── events/
│       ├── projects/
│       ├── team/
│       ├── certificates/
│       ├── members/
│       ├── mentors/
│       ├── blog/
│       └── ...
│
├── components/
│   ├── Navbar
│   ├── Footer
│   ├── AdminSidebar
│   ├── StarField
│   ├── RsvpButton
│   ├── UpvoteButton
│   └── CommentSection
│
├── lib/
│   ├── db.js
│   ├── auth.js
│   ├── crud.js
│   └── adminFetch.js
│
├── public/
│   ├── logo.jpg
│   └── logo-animated.mp4
│
├── middleware.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

# 🔌 API Design

The project uses reusable CRUD handlers for common resources.

### Collection

```http
GET  /api/team
POST /api/team
```

### Individual Resource

```http
GET    /api/team/:id
PATCH  /api/team/:id
DELETE /api/team/:id
```

### Custom APIs

```http
POST /api/events/:id/rsvp
POST /api/projects/:id/upvote
POST /api/projects/:id/comments
GET  /api/certificates/verify
```

This architecture keeps API logic reusable and reduces duplicated backend code.

---

# 🗄️ Database

DevSoc uses **PostgreSQL hosted through Supabase**.

The database layer is centralized in:

```text
lib/db.js
```

Application data is organized into database collections/tables covering areas such as:

* Events
* Projects
* Certificates
* Team
* Mentors
* Recruitment
* Testimonials
* Blog
* FAQ
* Contact
* Feedback
* Newsletter
* Team Up
* Admin data

The frontend and admin dashboard communicate with the database through the application's API layer rather than directly accessing database records from the client.

---

# 🔐 Authentication & Security

The admin dashboard is protected using server-side session authentication.

Important security practices include:

* Protected administrative routes
* Signed session cookies
* Environment-based credentials
* PostgreSQL credentials stored through environment variables
* No production secrets committed to the repository

### Environment Variables

```env
DATABASE_URL=your_postgresql_connection_string
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_strong_session_secret
```

> **Never commit `.env.local`, database passwords, API keys, or production credentials to GitHub.**

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/kalyansushma-06/DevSoc.git
cd DevSoc
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

Update `.env.local` with your PostgreSQL and authentication configuration.

## 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin:

```text
http://localhost:3000/admin/login
```

---

# ☁️ Deployment

The application is deployed on **Vercel** with PostgreSQL hosted by **Supabase**.

```text
GitHub
   │
   ▼
Vercel
   │
   ▼
Next.js Production Build
   │
   ▼
DevSoc Website
   │
   ▼
Supabase PostgreSQL
```

Production deployments can be triggered through updates to the GitHub production branch.

---

# 🎨 Design System

DevSoc uses a futuristic developer-oriented visual identity.

### Visual elements

* Dark space-inspired interface
* Cyan accent system
* Glass-style panels
* Animated starfield
* Responsive layouts
* Developer-focused typography

The primary styling configuration lives in:

```text
tailwind.config.js
app/globals.css
```

---

# 🔮 Future Roadmap

Potential future improvements include:

* [ ] Role-based admin permissions
* [ ] Secure password hashing
* [ ] Admin activity logs
* [ ] Email notifications
* [ ] Event attendance analytics
* [ ] Certificate analytics
* [ ] Image/file storage
* [ ] Advanced search
* [ ] Rate limiting
* [ ] Automated testing
* [ ] CI/CD quality checks
* [ ] Student dashboards
* [ ] Participation history

---

# 🤝 Contributing

Contributions, improvements, and feature suggestions are welcome.

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Make your changes, test locally, then:

```bash
git add .
git commit -m "Add: your feature"
git push origin feature/your-feature
```

Open a pull request with a clear description of your changes.

---

# 📜 License

This project is maintained as part of the **DevSoc student developer community**.

---

<p align="center">
  <strong>DevSoc</strong><br>
  Build. Learn. Collaborate. Ship.
</p>
