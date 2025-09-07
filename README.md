# 811 Ticket Management System

A comprehensive full-stack Next.js application for managing 811 utility tickets with role-based authentication, real-time alerts, and Supabase integration.

## Features

- 🔐 **Authentication**: Role-based access (Admin/Contractor) with Supabase Auth
- 🎫 **Ticket Management**: Full CRUD operations with status tracking
- ⚠️ **Alert System**: Real-time notifications for expired and expiring tickets
- 📊 **Dashboard**: Statistics and analytics with interactive charts
- 🔍 **Advanced Filtering**: Search and filter tickets by multiple criteria
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🗄️ **Database**: PostgreSQL with Supabase and Row Level Security


## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account


## Installation & Setup

### 1. Clone and Install Dependencies

```shellscript
# Clone the repository
git clone https://github.com/azeemyaqoob/ticket-management-system.git
cd 811-ticket-system

# Install dependencies
npm install
# or
yarn install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Copy `.env.example` to `.env.local`:


```shellscript
cp .env.example .env.local
```

4. Fill in your Supabase credentials in `.env.local`:


```plaintext
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup

Run the SQL schema in your Supabase SQL editor:

1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste the contents of `scripts/supabase-schema.sql`
3. Click "Run" to create all tables, policies, and functions


### 4. Run the Application

```shellscript
# Development mode
npm run dev
# or
yarn dev

# Production build
npm run build
npm start
# or
yarn build
yarn start
```

The application will be available at `http://localhost:3000`

## Default Login Credentials

For testing purposes, you can create accounts through the registration form or use Supabase Auth to create test users.

## Project Structure

```plaintext
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── contexts/             # React Context providers
├── lib/                  # Utility functions and Supabase clients
├── scripts/              # Database scripts
├── types/                # TypeScript type definitions
└── middleware.ts         # Supabase auth middleware
```

## Environment Variables

| Variable | Description | Required
|-----|-----|-----
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Redirect URL for development | Yes


## Deployment

This application can be deployed to Vercel, Netlify, or any platform that supports Next.js.

For Vercel deployment:

1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request


## License

MIT License - see LICENSE file for details

The README provides comprehensive setup instructions including Supabase configuration, environment variables, and deployment guidance. Follow the step-by-step installation process to get your 811 ticket management system running locally with full database functionality.
