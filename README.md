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
BACKEND_API_URL=your_backend_api_url
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

## �️ Architecture & Design Patterns

This project follows modern frontend architecture principles and implements several design patterns for maintainability, scalability, and code quality.

### 📐 Core Architecture Patterns

#### **1. Layered Architecture**

- **Presentation Layer**: React components and UI
- **Business Logic Layer**: Custom hooks and contexts
- **Data Access Layer**: API client services
- **Type Layer**: TypeScript definitions

```
├── components/     # Presentation Layer
├── hooks/         # Business Logic Layer
├── lib/api/       # Data Access Layer
└── types/         # Type Definitions
```

#### **2. Feature-Based Organization**

Each feature has its own folder with related components, hooks, and types:

```
candidate/
├── components/
├── hooks/
└── types/
```

### 🔧 Design Patterns Implementation

#### **1. Service Pattern**

Encapsulates API calls and business logic in service modules:

```typescript
// lib/api/recruiter-application.ts
export const recruiterApplicationService = {
  updateApplicationStatus,
  updateApplicationStatusByComposite,
  checkBackendSupport,
};
```

#### **2. Factory Pattern**

Dynamic creation of API endpoints and fallback strategies:

```typescript
// Tạo dynamic API endpoints dựa trên context
const createApiEndpoint = (type: string, id: string) =>
  `/api/${type}/${id}/applications`;
```

#### **3. Strategy Pattern**

Multiple strategies for updating application status:

- **Primary Strategy**: Update by JobApplication ID
- **Fallback Strategy**: Update by composite key (candidateId + jobId + appliedAt)
- **Backup Strategy**: Multiple API endpoint attempts

#### **4. Repository Pattern**

Abstraction layer for data access with consistent interface:

```typescript
interface ApplicationRepository {
  findById(id: string): Promise<Application>;
  updateStatus(id: string, status: ApplicationStatus): Promise<void>;
  findByComposite(
    candidateId: string,
    jobId: string,
    appliedAt: string
  ): Promise<Application>;
}
```

#### **5. Observer Pattern**

State management with Zustand for reactive updates:

```typescript
// Global state updates trigger component re-renders
const useApplicationStore = create((set) => ({
  applications: [],
  updateStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status } : app
      ),
    })),
}));
```

#### **6. Command Pattern**

Encapsulates actions with undo/redo capability:

```typescript
const updateStatusCommand = {
  execute: () => updateApplicationStatus(id, status),
  undo: () => updateApplicationStatus(id, previousStatus),
  canExecute: () => hasPermission(user, "UPDATE_APPLICATION"),
};
```

#### **7. Adapter Pattern**

Adapts different API response formats to consistent internal types:

```typescript
// Chuyển đổi response từ backend thành internal format
const adaptJobApplication = (apiResponse: any): JobApplication => ({
  id: apiResponse.id || generateCompositeId(apiResponse),
  status: mapStatusFromApi(apiResponse.status),
  appliedAt: new Date(apiResponse.appliedAt),
});
```

#### **8. Decorator Pattern**

Enhanced API calls with logging, error handling, and caching:

```typescript
const withLogging =
  (apiCall: Function) =>
  async (...args: any[]) => {
    console.log("API Call:", apiCall.name, args);
    try {
      const result = await apiCall(...args);
      console.log("Success:", result);
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
```

### 🛡️ Defensive Programming Patterns

#### **1. Null Object Pattern**

Provides default objects to avoid null/undefined errors:

```typescript
const defaultApplication: JobApplication = {
  id: "",
  status: "pending",
  appliedAt: new Date(),
  candidate: defaultCandidate,
  job: defaultJob,
};
```

#### **2. Circuit Breaker Pattern**

Prevents cascading failures in API calls:

```typescript
const apiCallWithCircuitBreaker = async (apiCall: Function) => {
  if (circuitBreaker.isOpen()) {
    throw new Error("Circuit breaker is open");
  }

  try {
    return await apiCall();
  } catch (error) {
    circuitBreaker.recordFailure();
    throw error;
  }
};
```

#### **3. Retry Pattern**

Automatic retry for failed operations:

```typescript
const retryApiCall = async (fn: Function, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
};
```

### 🔄 State Management Patterns

#### **1. Flux/Redux Pattern (with Zustand)**

Unidirectional data flow for predictable state updates:

```typescript
// Actions → Store → UI → Actions
const useStore = create((set, get) => ({
  // State
  applications: [],

  // Actions
  setApplications: (apps) => set({ applications: apps }),
  updateApplication: (id, updates) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updates } : app
      ),
    })),
}));
```

#### **2. Provider Pattern**

Dependency injection through React Context:

```typescript
const AuthProvider = ({ children }) => {
  const authValue = useAuth();
  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
```

### 🧪 Error Handling Patterns

#### **1. Error Boundary Pattern**

Catches and handles errors at component level:

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

#### **2. Result Pattern**

Explicit error handling without exceptions:

```typescript
type Result<T, E> = { success: true; data: T } | { success: false; error: E };

const updateStatus = async (): Promise<Result<Application, string>> => {
  try {
    const data = await api.updateStatus();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### 📦 Code Organization Best Practices

#### **1. Separation of Concerns**

Each module has a single responsibility:

- Components: UI rendering only
- Hooks: Business logic and state
- Services: API communication
- Utils: Pure functions

#### **2. Dependency Inversion**

High-level modules don't depend on low-level modules:

```typescript
// Interface
interface NotificationService {
  showSuccess(message: string): void;
  showError(message: string): void;
}

// Implementation can be swapped
const toastService: NotificationService = {
  showSuccess: (msg) => toast.success(msg),
  showError: (msg) => toast.error(msg),
};
```

#### **3. Open/Closed Principle**

Components open for extension, closed for modification:

```typescript
// Base component
const BaseButton = ({ variant, ...props }) => (
  <button className={getVariantClass(variant)} {...props} />
);

// Extended without modifying base
const SubmitButton = (props) => (
  <BaseButton variant="primary" type="submit" {...props} />
);
```

### 🔧 Performance Patterns

#### **1. Lazy Loading Pattern**

Components and routes loaded on demand:

```typescript
const LazyRecruiterDashboard = lazy(() => import("./RecruiterDashboard"));
```

#### **2. Memoization Pattern**

Prevents unnecessary re-renders:

```typescript
const MemoizedApplicationList = memo(({ applications }) => (
  // Component implementation
))
```

#### **3. Virtual Scrolling Pattern**

Efficient handling of large lists:

```typescript
const VirtualizedJobList = ({ jobs }) => (
  <VirtualList items={jobs} renderItem={({ item }) => <JobCard job={item} />} />
);
```

These patterns ensure the codebase is maintainable, scalable, and follows industry best practices for modern React/Next.js applications.

## �🌐 Internationalization

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
