# Blog Editor Application

A full-stack blog editor application built with Next.js App Router, featuring a rich text editor, auto-save functionality, and JWT-based authentication.

## Features

- 📝 Rich text editor with TipTap
- 💾 Auto-save drafts
- 🔐 JWT-based authentication
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🗄️ MongoDB database with Mongoose
- ⚡ Real-time updates

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js with JWT
- **Rich Text Editor:** TipTap
- **Form Handling:** React Hook Form + Zod
- **Date Formatting:** date-fns

## Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blog-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   └── blogs/
│   └── dashboard/
│       ├── editor/
│       └── page.tsx
├── components/
│   └── ui/
├── hooks/
├── lib/
└── models/
```

## API Endpoints

- `POST /api/blogs/save-draft` - Save or update a draft
- `POST /api/blogs/publish` - Save and publish an article
- `GET /api/blogs` - Get all blogs by logged-in user
- `GET /api/blogs/:id` - Get single blog by ID

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
# blogeditor
