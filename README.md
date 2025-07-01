# JobPortal Frontend

A modern job portal application built with Next.js 15, supporting internationalization, authentication, and multiple user roles.

## 🚀 Features

- **Multi-language Support**: English and Vietnamese with Next-intl
- **User Authentication**: Login, registration, and role-based access control
- **User Roles**:
  - Candidate: Search jobs, apply for positions, manage profile
  - Recruiter: Post jobs, manage applications, review candidates
  - Admin: System administration
- **Job Management**: Browse, search, filter, and apply for jobs
- **Company Profiles**: View company details, ratings, and reviews
- **Category-based Job Browsing**: Find jobs by industry categories
- **Saved Jobs**: Bookmark jobs for later review
- **Application Tracking**: Track job application status
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **UI Libraries**:
  - Tailwind CSS
  - Material Tailwind
  - Radix UI components
  - Flowbite React
  - Lucide React icons
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Internationalization**: next-intl
- **Authentication**: NextAuth.js
- **HTTP Client**: Axios
- **Development**:
  - TypeScript
  - ESLint
  - Turbopack (in dev mode)

## 📋 Prerequisites

- Node.js (latest LTS version recommended)
- npm, yarn, pnpm, or bun

## 🚦 Getting Started

1. **Clone the repository**

```bash
git clone [repository-url]
cd jobportal-fe
```

2. **Install dependencies**

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

3. **Environment Variables**

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🏗️ Project Structure

```
jobportal-fe/
├── public/            # Static assets and fonts
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── [locale]/  # Localized routes
│   │   │   ├── candidate/  # Candidate pages
│   │   │   ├── recruiter/  # Recruiter pages
│   │   │   └── admin/      # Admin pages
│   ├── components/    # React components
│   │   ├── candidate/   # Candidate-specific components
│   │   ├── category/    # Category-related components
│   │   ├── common/      # Shared components
│   │   ├── company/     # Company-related components
│   │   ├── job/         # Job-related components
│   │   ├── layouts/     # Layout components
│   │   └── ui/          # UI components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom React hooks
│   ├── i18n/          # Internationalization setup
│   ├── lib/           # Utilities and API clients
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── messages/          # Internationalization messages
└── middleware.ts      # Next.js middleware for routing and auth
```

## 👥 User Roles

The application supports three user roles:

1. **Candidate**:

   - Browse and search for jobs
   - Apply for jobs
   - Save favorite jobs
   - Track application status
   - Manage personal profile

2. **Recruiter**:

   - Post job listings
   - Manage company profile
   - Review applications
   - Contact candidates
   - View application statistics

3. **Admin**:
   - Manage all users
   - Moderate job listings
   - Configure system settings

## 📚 Available Scripts

- `npm run dev`: Start the development server with Turbopack
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint for code quality checks

## 🌐 Internationalization

The application supports multiple languages with URL-based locale switching:

- English: `/en/...`
- Vietnamese: `/vi/...`

To add a new language:

1. Add the locale to `routing.ts`
2. Create a new message file in the `messages` directory

## 🔐 Authentication

The application uses NextAuth.js for authentication with JWT tokens. User sessions are maintained through localStorage and API requests are automatically authenticated using Axios interceptors.

## 🔄 API Integration

Backend API calls are handled through Axios with a centralized instance configuration and automatic token handling. The application expects a RESTful API with JWT authentication.

## 📱 Responsive Design

The application is fully responsive and optimized for both desktop and mobile devices using Tailwind CSS.

## 🚀 Deployment

The application can be deployed on any platform that supports Next.js applications, such as Vercel, Netlify, or a custom server.

```bash
npm run build
npm run start
```

For more information on deployment options, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
