# 📚 Read Later - Personal Bookmarking Platform

A modern, full-stack web application for saving, organizing, and managing your reading list. Built with Next.js, TypeScript, and MongoDB.

## 🌟 Live Demo & Features

### Core Features
- **📖 Smart Bookmarking**: Save articles with automatic metadata extraction (title, description, images, reading time)
- **🔍 Advanced Search**: Full-text search across titles, descriptions, and URLs
- **🏷️ Tagging System**: Organize bookmarks with custom tags and smart collections
- **📊 Reading Management**: Track read/unread status with dedicated sections
- **🎨 Modern UI**: Clean, responsive design with dark/light mode support
- **⚡ Real-time Updates**: Instant bookmark management with optimistic updates
- **🔐 Secure Authentication**: JWT-based auth with bcrypt password hashing

### Technical Highlights
- **Performance**: Optimized database queries with proper indexing
- **Scalability**: MongoDB with connection pooling and caching
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Developer Experience**: Hot reload, comprehensive error handling, and clean architecture
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Metadata Extraction**: Open Graph Scraper
- **Validation**: Zod schemas

### Development Tools
- **Package Manager**: pnpm
- **Bundler**: Turbopack (Next.js)
- **Linting**: ESLint
- **Type Checking**: TypeScript compiler

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/read-later.git
   cd read-later
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/read-later
   # or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/read-later

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here

   ```


4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📱 Usage

### Getting Started
1. **Sign Up**: Create an account with email and password
2. **Add Bookmarks**: Click the "+" button and paste any URL
3. **Auto-Metadata**: The app automatically extracts title, description, and images
4. **Organize**: Add tags and organize bookmarks into collections
5. **Search & Filter**: Use the search bar and filters to find specific bookmarks

### Key Workflows
- **Quick Save**: Paste URL → Auto-extract metadata → Save
- **Bulk Operations**: Select multiple bookmarks for batch delete/organize
- **Reading Tracking**: Mark bookmarks as read/unread
- **Smart Sections**: Navigate between All, Unread, and Read bookmarks

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── bookmarks/    # Bookmark CRUD operations
│   │   ├── collections/  # Collections management
│   │   └── tags/         # Tags management
│   ├── auth/             # Authentication pages
│   └── dashboard/        # Main application dashboard
├── components/            # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   └── ui/              # Base UI components
├── lib/                  # Utilities and configurations
│   ├── hooks/           # Custom React hooks
│   └── validations/     # Zod validation schemas
├── models/              # MongoDB/Mongoose models
└── types/               # TypeScript type definitions
```

## 🔧 API Reference

### Authentication
```typescript
POST /api/auth/register  # Create new account
POST /api/auth/login     # Sign in
POST /api/auth/logout    # Sign out
GET  /api/auth/me        # Get current user
```

### Bookmarks
```typescript
GET    /api/bookmarks           # List bookmarks (with filters)
POST   /api/bookmarks           # Create bookmark
GET    /api/bookmarks/[id]      # Get bookmark details
PUT    /api/bookmarks/[id]      # Update bookmark
DELETE /api/bookmarks/[id]      # Delete bookmark
GET    /api/bookmarks/count     # Get bookmark count
```

### Collections & Tags
```typescript
GET    /api/collections         # List collections
POST   /api/collections         # Create collection
GET    /api/tags               # List tags
POST   /api/tags               # Create tag
```

## 🎯 Performance Features

- **Database Indexing**: Optimized queries with compound indexes
- **Connection Pooling**: Efficient MongoDB connection management
- **Caching**: React Query for client-side caching
- **Lazy Loading**: Dynamic imports for code splitting
- **Debounced Search**: Reduced API calls with input debouncing
- **Optimistic Updates**: Instant UI feedback

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Zod schemas on client and server
- **URL Validation**: Secure bookmark URL parsing
- **CORS Protection**: Proper API security headers

## 🧪 Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript type checking
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with Next.js recommended rules
- **Code Organization**: Clean architecture with separation of concerns
- **Error Handling**: Comprehensive error boundaries and API error handling

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
```bash
pnpm build
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub**: [Repository](https://github.com/yourusername/read-later)
- **Live Demo**: [https://read-later-demo.vercel.app](https://read-later-demo.vercel.app)
- **Documentation**: [Full API Docs](https://read-later-demo.vercel.app/docs)

---

Built with ❤️ using Next.js, TypeScript, and MongoDB
