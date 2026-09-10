# JobPortal Frontend

### Next.js Recruitment Experience

The JobPortal frontend provides localized web experiences for candidates, recruiters, and administrators. It is built with Next.js App Router and uses a server-side BFF route to connect the browser to the canonical ASP.NET Core backend.

The canonical runtime path is:

~~~text
Browser → Next.js UI → Next.js BFF → ASP.NET Core 8 API → SQL Server
~~~

The frontend is responsible for presentation, navigation, localized content, session UX, and request orchestration. Business authorization, workflow transitions, payment confirmation, credit accounting, concurrency checks, and sensitive-file access remain backend responsibilities.

## Canonical Backend Boundary

~~~mermaid
flowchart LR
    Browser[Browser]
    UI[Next.js App Router UI]
    BFF[Next.js Route Handler /api/backend/*]
    API[ASP.NET Core 8 API]
    DB[(SQL Server)]
    Auth[NextAuth session]

    Browser --> UI
    UI --> BFF
    BFF --> API
    API --> DB
    UI --> Auth
    Auth --> BFF
~~~

In the browser, Axios uses <code>/api/backend</code> so backend URLs and bearer-token handling stay server-side. On the server, the Axios instance uses <code>BACKEND_API_URL</code>. The BFF forwards supported methods and selected headers including <code>If-Match</code> and <code>X-Correlation-ID</code>, attaches the backend bearer token from the NextAuth JWT, and propagates response metadata such as <code>ETag</code>, <code>Content-Type</code>, and <code>X-Correlation-ID</code>.

The canonical backend is [ASP.NET Core 8 with SQL Server](https://github.com/hataba123/JobPortalApi). The older NestJS/PostgreSQL implementation is historical/reference material and is not the active frontend target.

## Product Areas

### Candidates

- Localized home page, job search, filtering, job details, companies, categories, blogs, and reviews.
- Registration, credentials login, OAuth entry points, password reset, and session management.
- Profile, skills, certificates, education, experience, preferences, private CV, saved jobs, and applications.
- Application status tracking, interview information, notifications, and explainable job matching.
- Recruiter communication boundaries and payment/credit experiences backed by server-side API contracts.

### Recruiters

- Recruiter dashboard, analytics, company profile, job posts, plans, notifications, candidates, and applications.
- Candidate search and matching views.
- Interview scheduling and workflow screens that use backend validation and concurrency responses.

### Administrators

- Dashboard, users, companies, job posts, applications, reviews, notifications, plans, transactions, reports, and settings.
- Moderation and verification screens that respect backend authorization and ETag-based updates.

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15.5, App Router, React Server/Client Components |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, Radix UI, Flowbite, Heroicons/Lucide |
| Authentication | NextAuth with JWT sessions, credentials, Google, Facebook, and GitHub providers |
| HTTP | Axios and the Next.js <code>/api/backend/*</code> BFF |
| Localization | <code>next-intl</code>, locale routes for <code>en</code> and <code>vi</code> |
| Client state/forms | Zustand and React Hook Form |
| Tooling | npm, ESLint, TypeScript, Next.js production build |
| Contract verification | Checked OpenAPI contract file and custom validation script |

## Routing Model

Routes under <code>src/app/[locale]</code> are rendered for both supported locales:

| Area | Example routes |
| --- | --- |
| Public/candidate | <code>/vi/candidate</code>, <code>/vi/candidate/job</code>, <code>/vi/candidate/company</code>, <code>/vi/candidate/blog</code> |
| Candidate account | <code>/vi/candidate/userprofiles/profile</code>, <code>/vi/candidate/userprofiles/applications</code>, <code>/vi/candidate/userprofiles/matches</code> |
| Recruiter | <code>/vi/recruiter/dashboard</code>, <code>/vi/recruiter/jobs</code>, <code>/vi/recruiter/applications</code>, <code>/vi/recruiter/candidates</code> |
| Admin | <code>/vi/admin/dashboard</code>, <code>/vi/admin/company</code>, <code>/vi/admin/job-post</code>, <code>/vi/admin/reports</code> |
| Auth | <code>/vi/candidate/auth/login</code>, <code>/vi/candidate/auth/register</code>, <code>/vi/candidate/auth/reset-password</code> |
| Next.js server routes | <code>/api/auth/[...nextauth]</code>, <code>/api/backend/[...path]</code>, <code>/api/media/[...path]</code> |

The same route shape is available under <code>/en</code>. Locale-aware navigation should use the existing routing and middleware conventions rather than hard-coding a second route tree.

## Project Structure

~~~text
src/
├── app/
│   ├── [locale]/          localized public, candidate, recruiter, and admin routes
│   ├── api/
│   │   ├── auth/           NextAuth route handler
│   │   ├── backend/        BFF proxy to the ASP.NET Core API
│   │   └── media/          media proxy route
│   └── globals.css
├── components/             shared and domain-specific UI
├── contexts/               application/auth contexts
├── hooks/                  data-fetching and interaction hooks
├── i18n/                   next-intl configuration
├── lib/                    Axios, auth, and API client helpers
├── types/                  TypeScript API/domain types
└── utils/                  reusable utilities
messages/
├── en.json
└── vi.json
contracts/                  OpenAPI contract material
scripts/                    repository verification scripts
public/                     static assets
~~~

## Local Development

### Requirements

- Node.js 20 or newer.
- npm 10 or newer.
- Git.
- A running canonical backend and SQL Server database when a page needs live API data.

### Install and configure

~~~bash
git clone https://github.com/hataba123/jobportal-fe.git
cd jobportal-fe
npm ci
~~~

Create <code>.env.local</code> from the example file:

~~~powershell
Copy-Item .env.example .env.local
~~~

| Variable | Required | Purpose |
| --- | --- | --- |
| <code>BACKEND_API_URL</code> | Yes | Server-side URL of the canonical API, for example <code>http://localhost:5042/api</code> |
| <code>NEXTAUTH_URL</code> | Yes | Frontend origin, normally <code>http://localhost:3000</code> |
| <code>NEXTAUTH_SECRET</code> | Yes | Local secret used by NextAuth to protect sessions |
| <code>OAUTH_EXCHANGE_SECRET</code> | Yes for OAuth exchange | Must match the backend exchange secret |

Use random local values for secrets. Do not use <code>NEXT_PUBLIC_</code> for server-only secrets, and never commit <code>.env.local</code>.

### Start the development server

~~~powershell
npm run dev
~~~

Open:

- <http://localhost:3000/en>
- <http://localhost:3000/vi>

The repository's current <code>next-intl</code> configuration supports <code>en</code> and <code>vi</code>. For full data flows, start the backend with matching local configuration and CORS settings.

### Start the production build

~~~powershell
npm run build
npm run start
~~~

The production server listens on port <code>3000</code> by default.

## Docker

The canonical full-stack Compose file lives in the backend repository because it starts SQL Server, ASP.NET Core, and the frontend together:

~~~powershell
cd ..\JobPortalApi
Copy-Item .env.example .env
# Replace every placeholder with local values.
docker compose up --build
~~~

In the canonical Compose network, the frontend calls <code>http://aspnet-api:8080/api</code>, while the browser reaches the frontend at <code>http://localhost:3000</code>. The backend calls SQL Server through the <code>sqlserver</code> service name. The backend Compose file also owns the named <code>sqlserver-data</code> and private <code>cv-data</code> volumes.

This repository also contains a standalone frontend <code>docker-compose.yml</code>. It is useful only when <code>BACKEND_API_URL</code> points to an API address reachable from that container; it does not invent a <code>localhost</code> or <code>host.docker.internal</code> backend default.

## Available Commands

| Command | Purpose |
| --- | --- |
| <code>npm run dev</code> | Start Next.js development mode with Turbopack |
| <code>npm run build</code> | Compile and prerender the production application |
| <code>npm run start</code> | Serve the current production build |
| <code>npm run lint</code> | Run the repository ESLint check |
| <code>npm run contract:test</code> | Validate the checked-in frontend/backend OpenAPI contract |

Before opening a pull request, run the checks relevant to the change:

~~~powershell
npm run lint
npm run contract:test
npm run build
~~~

## API and Session Behavior

The frontend does not treat client-side state as an authorization boundary:

- Credentials login calls the backend <code>/auth/login</code> endpoint through the shared Axios path.
- OAuth provider callbacks exchange verified provider data with the backend <code>/auth/oauth-login</code> endpoint.
- NextAuth stores the session as a JWT and the BFF forwards the backend access token for API calls.
- Backend status, payment, credit, ownership, and concurrency responses are rendered by the frontend but enforced by the API.
- <code>ETag</code>/<code>If-Match</code> metadata is preserved for update flows so stale edits can be shown as conflicts instead of overwritten.

The matching experience presents the backend's deterministic, explainable matching result. It should not be described as an AI/ML model merely because an older UI label uses the word “AI”.

## Localization Guidelines

- Translation files are <code>messages/en.json</code> and <code>messages/vi.json</code>.
- Route components live under <code>src/app/[locale]</code>.
- New user-visible text should be added to both locale files.
- Keep API field names and backend enums separate from translated display labels.
- Test both <code>/en</code> and <code>/vi</code> for navigation and server/client rendering after localization changes.

## Security and Privacy

- Keep <code>NEXTAUTH_SECRET</code>, <code>OAUTH_EXCHANGE_SECRET</code>, access tokens, cookies, and provider credentials server-side.
- The browser calls the BFF rather than receiving the internal backend URL as its normal API base.
- Do not upload CVs, tokens, cookies, or user data into source control or issue trackers.
- Configure <code>BACKEND_API_URL</code> according to the actual local, container, or deployment network.
- Add a matching backend CORS origin when using a new frontend origin.
- The frontend does not grant payment credits, bypass authorization, or decide application transitions.

## Verification Status

The latest local verification pass reported:

| Check | Result |
| --- | --- |
| Production build | Pass; 87 pages generated |
| Lint | Pass with existing unused-import and hook-dependency warnings |
| Contract validation | Pass; 39 paths and 38 schemas |
| Backend connectivity | Verified when the local ASP.NET Core API is running at <code>http://localhost:5042</code> |
| Docker runtime | Configuration can be inspected, but full Docker startup depends on Docker Desktop |
| OAuth runtime | Provider credentials are environment-dependent |

GitHub Actions runs lint, contract validation, build, and a high-severity production dependency audit through [.github/workflows/ci.yml](.github/workflows/ci.yml). No status badge is included so the README does not imply a green external run without verification.

## Related Documentation

- [Canonical backend README](https://github.com/hataba123/JobPortalApi/blob/main/README.md)
- [Backend architecture guide](https://github.com/hataba123/JobPortalApi/blob/main/docs/ARCHITECTURE.md)
- [Backend interview notes](https://github.com/hataba123/JobPortalApi/blob/main/docs/INTERVIEW_NOTES.md)
- [Frontend repository](https://github.com/hataba123/jobportal-fe)

## Contributing

1. Keep route, component, API client, and translation changes in their existing areas.
2. Preserve the BFF boundary and do not expose server-only secrets to client bundles.
3. Keep backend business rules on the backend; the frontend should render and submit contracts.
4. Run build, lint, and contract validation before opening a pull request.
5. Use focused commits such as feat:, fix:, docs:, test:, or chore:.
