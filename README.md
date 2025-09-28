# Next.js Dashboard with MySQL Integration

A modern dashboard application built with Next.js that displays paket pengadaan (tender) data from MySQL database.

## Features

- 📊 **Data Table**: Interactive table with sorting, filtering, and pagination
- 🗄️ **MySQL Integration**: Direct connection to MySQL database
- 🎨 **Modern UI**: Built with shadcn/ui components
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔍 **Search & Filter**: Real-time search functionality
- 📈 **Charts**: Interactive data visualization

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Database**: MySQL
- **Charts**: Recharts
- **Icons**: Tabler Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE data_crud_v1;
```

2. Import the database structure (if you have the SQL file)

### Environment Setup

1. Copy the environment template:
```bash
cp env.example .env.local
```

2. Update `.env.local` with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=data_crud_v1
DB_PORT=3306
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### Health & System
- `GET /api/health` - Health check

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `DELETE /api/users/account` - Delete user account

### Paket Pengadaan (Tenders)
- `GET /api/paket` - Get all paket data (with search & pagination)
- `GET /api/paket/[id]` - Get specific paket
- `POST /api/paket` - Create new paket
- `PUT /api/paket/[id]` - Update paket
- `DELETE /api/paket/[id]` - Delete paket

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites` - Clear all favorites
- `DELETE /api/favorites/[md5_hash]` - Remove from favorites
- `GET /api/favorites/check/[md5_hash]` - Check favorite status
- `GET /api/favorites/stats` - Get favorites statistics

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
