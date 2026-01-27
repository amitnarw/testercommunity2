# Tester Community Platform

A modern, scalable web application designed to connect app developers with a global community of testers. Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**, this platform facilitates the entire app testing lifecycle, from project submission to feedback collection, powered by role-based access control and AI integration.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-Genkit-orange?style=for-the-badge&logo=firebase)

## 🚀 Features

### Core Functionality

- **Role-Based Access Control (RBAC)**: Secure and distinct environments for different user types:
  - **Admin**: Comprehensive management dashboard for overseeing users, applications, and platform global settings.
  - **Authenticated User**: Dual-dashboard system:
    - **Main Dashboard**: Manage personal projects, submit new apps for testing, and track project status.
    - **Community Dashboard**: Browse available testing tasks, manage "My Queue", track "Active Tests", and view submission history.
  - **Professional Tester**: Dedicated workspace for professional-grade testing assignments and higher-level tasks.
  - **Public**: informative landing pages, blogs, and documentation accessible to all visitors.

### Advanced Capabilities

- **AI-Powered Integration**: Leveraging **Google Genkit** to enhance testing workflows and provide intelligent insights.
- **Support Chatbot**: Integrated AI assistant to help users navigate the platform and resolve issues.
- **Rich Data Visualization**: Interactive charts and analytics powered by **Recharts** for tracking testing progress and community engagement.

### User Experience (UX)

- **Modern UI Design**: Built with **Radix UI** primitives and **Shadcn/UI** patterns for accessible, high-quality componentry.
- **Dynamic Animations**: Smooth, engaging transitions and micro-interactions using **Framer Motion** and **GSAP**.
- **Responsive Layouts**: Fully optimized for seamless performance across desktop, tablet, and mobile devices.

### Developer Experience

- **Type Safety**: End-to-end type safety with **TypeScript**.
- **Form Management**: Robust form handling and validation using **React Hook Form** and **Zod**.
- **State Management**: Efficient server-state synchronization with **TanStack Query**.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Tailwind Merge](https://github.com/dcastil/tailwind-merge), [CLSX](https://github.com/lukeed/clsx)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
- **Backend & Auth**: [Firebase](https://firebase.google.com/), [Better Auth](https://better-auth.com/), [Jose](https://github.com/panva/jose)
- **AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Utilities**: [Date-fns](https://date-fns.org/), [Axios](https://axios-http.com/)

## 📂 Project Structure

A high-level overview of the application's file structure:

```
├── src
│   ├── app                  # Next.js App Router pages
│   │   ├── (admin)          # Admin dashboard & auth routes
│   │   ├── (authenticated)  # User dashboards (Main, Community, Profile, etc.)
│   │   ├── (professional)   # Professional tester dashboard routes
│   │   ├── (public)         # Public pages (Home, Blog, Auth, Legal)
│   │   └── ...
│   ├── components           # Reusable UI components
│   │   ├── ui               # Base UI components (buttons, inputs, etc.)
│   │   ├── community-dashboard # Components specific to the community dashboard
│   │   ├── blog             # Blog-related components
│   │   ├── profile-setup    # Profile creation flow components
│   │   └── ...
│   ├── context              # React Context providers
│   ├── hooks                # Custom React hooks
│   ├── lib                  # Utility functions and library configurations
│   ├── types                # TypeScript type definitions
│   └── middleware.ts        # Route protection and role validation logic
├── public                   # Static assets (images, icons)
├── .env                     # Environment variables (local)
└── next.config.ts           # Next.js configuration
```

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js**: >= 20.x
- **npm**: >= 10.x

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd testercommunity2
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory. You can use the provided `env-example.txt` as a reference.

```bash
cp env-example.txt .env
```

Open `.env` and configure the following required variables:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000 # Your API URL
BETTER_AUTH_SECRET=your_super_secret_key     # Secret for auth sessions
NEXT_PUBLIC_ENCRYPTION_SECRET=your_key        # Secret for encryption
```

### Running the Application

Start the development server with Turbopack for faster builds:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## 📜 Scripts

| Script              | Description                                                |
| :------------------ | :--------------------------------------------------------- |
| `npm run dev`       | Starts the development server on port 9002 with Turbopack. |
| `npm run build`     | Builds the application for production.                     |
| `npm run start`     | Starts the production server.                              |
| `npm run lint`      | Runs the linter to catch code style issues.                |
| `npm run typecheck` | Runs TypeScript type checking.                             |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
