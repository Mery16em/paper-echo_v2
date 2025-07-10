<<<<<<< HEAD
# paper-echo_v2
App to Save quotes from books efficiently
=======
# Paper Echo

A minimalist fullstack web application for saving and organizing book quotes. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **User Authentication** - Secure signup and login with Supabase Auth
- 📚 **Book Management** - Add books with title, author, and cover images
- 💭 **Quote Organization** - Save quotes with optional tags for easy categorization
- 🔍 **Advanced Search** - Search quotes by text, book, or tags
- 🌐 **Open Library Integration** - Auto-fill book data using Open Library API
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ✨ **Clean UI** - Minimalist design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (Database + Authentication + Storage)
- **Deployment**: Vercel
- **APIs**: Open Library API for book data

## Getting Started

### Prerequisites


- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd paper-echo
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the SQL scripts in the \`scripts/\` folder in your Supabase SQL editor:
     - First run \`01-create-tables.sql\`
     - Optionally run \`02-seed-data.sql\` for sample data (after creating a user account)

4. **Environment Variables**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

### Books Table
- \`id\` (UUID, Primary Key)
- \`title\` (Text, Required)
- \`author\` (Text, Required) 
- \`cover_url\` (Text, Optional)
- \`user_id\` (UUID, Foreign Key to auth.users)
- \`created_at\` (Timestamp)

### Quotes Table
- \`id\` (UUID, Primary Key)
- \`book_id\` (UUID, Foreign Key to books)
- \`text\` (Text, Required)
- \`tags\` (Text Array, Optional)
- \`user_id\` (UUID, Foreign Key to auth.users)
- \`created_at\` (Timestamp)

## Usage

### Adding Books
1. Navigate to "Add Book" from the dashboard
2. Enter book title and search using Open Library integration
3. Select from search results or manually enter author and cover URL
4. Save the book to your collection

### Saving Quotes
1. Click "Add Quote" from the dashboard
2. Select a book from your collection
3. Enter the quote text
4. Add optional tags for organization
5. Use the "Suggest Tags" feature for automatic tag generation

### Searching Quotes
1. Go to the Search page
2. Use text search to find quotes containing specific words
3. Filter by book or tag
4. Combine multiple filters for precise results

## Project Structure

\`\`\`
paper-echo/
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── add-book/
│   │   └── page.tsx
│   ├── add-quote/
│   │   └── page.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   └── [shadcn components]
│   ├── navigation.tsx
│   └── protected-route.tsx
├── contexts/
│   └── auth-context.tsx
├── lib/
│   └── supabase.ts
├── scripts/
│   ├── 01-create-tables.sql
│   └── 02-seed-data.sql
└── README.md
\`\`\`

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Update Supabase Settings**
   - Add your Vercel domain to Supabase Auth settings
   - Update redirect URLs if needed

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Your Supabase project URL | Yes |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Your Supabase anonymous key | Yes |

## Optional Integrations

### OpenAI API (for tag suggestions)
Add to your \`.env.local\`:
\`\`\`env
OPENAI_API_KEY=your_openai_api_key
\`\`\`

### Cloudinary (for image storage)
Add to your \`.env.local\`:
\`\`\`env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

>>>>>>> master
