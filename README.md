# Tester Community Platform

A modern, scalable web application built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. This platform is designed to provide a comprehensive ecosystem for testers, featuring role-based access control, AI integrations, and a rich user interface.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-Genkit-orange?style=for-the-badge&logo=firebase)

## 🚀 Features

- **Role-Based Access Control**: specialized routes for various user roles:
  - `Admin`: Management dashboards.
  - `Authenticated`: User-specific profiles and features.
  - `Professional`: Advanced tools for professional testers.
  - `Public`: Landing pages and general information.
- **Modern UI/UX**: Built with **Radix UI** primitives and **Shadcn/UI** patterns for accessible, high-quality components.
- **Rich Animations**: Smooth transitions and interactions using **Framer Motion** and **GSAP**.
- **Data Visualization**: Integrated **Recharts** for analytics and reporting.
- **AI Powered**: Leveraging **Google Genkit** for AI features.
- **Authentication**: Secure authentication flow using **Better Auth**.
- **Form Management**: Robust form handling with **React Hook Form** and **Zod** validation.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
- **Backend/BaaS**: [Firebase](https://firebase.google.com/), [Better Auth](https://better-auth.com/)

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

Create a `.env` file in the root directory. You can use the `env-example.txt` as a reference.

```bash
cp env-example.txt .env
```

Open `.env` and configure the following variables:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000 # or your api url
BETTER_AUTH_SECRET=your_super_secret_key
NEXT_PUBLIC_ENCRYPTION_SECRET=your_encryption_key
```

### Running the Application

Start the development server with Turbopack:

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

## 📂 Project Structure

```
├── src
│   ├── app              # Next.js App Router pages
│   │   ├── (admin)      # Admin dashboard routes
│   │   ├── (authenticated) # Authenticated user routes
│   │   ├── (professional) # Professional user routes
│   │   ├── (public)     # Publicly accessible routes
│   │   └── ...
│   └── ...
├── public               # Static assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
