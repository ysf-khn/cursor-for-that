# CursorForThat.com

A directory website to discover and explore SaaS products similar to Cursor IDE, leveraging prompt-based workflows to automate and enhance tasks for developers, creators, and productivity enthusiasts.

## 🚀 Features

- **Searchable Product Directory**: Browse and search through curated prompt-powered SaaS tools
- **Dynamic Category System**: Filter products by 20+ categories with support for custom categories
- **Product Detail Pages**: Comprehensive information about each tool with pricing, features, and external links
- **Enhanced Product Submission**: Submit tools with optional email contact and custom category creation
- **Responsive Design**: Modern, mobile-first design using Tailwind CSS and Shadcn UI
- **Real-time Database**: Powered by Supabase with Row Level Security
- **SEO Optimized**: Dynamic meta tags and static generation for better search engine visibility

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Database**: Supabase (PostgreSQL)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/cursorforthat.git
   cd cursorforthat
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase Database**

   Follow the detailed setup guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:

   - Create a Supabase project
   - Set up environment variables
   - Run the database schema
   - Configure Row Level Security

   Quick setup:

   - Create `.env.local` with your Supabase credentials
   - Run the SQL schema from `supabase-schema.sql` in your Supabase dashboard

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
cursorforthat/
├── app/                    # Next.js App Router pages
│   ├── categories/         # Categories page
│   ├── products/[id]/      # Dynamic product pages
│   ├── submit/             # Product submission form
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # Reusable components
│   ├── ui/                 # Shadcn UI components
│   ├── header.tsx          # Site header
│   ├── footer.tsx          # Site footer
│   ├── search-bar.tsx      # Search functionality
│   ├── product-card.tsx    # Product display card
│   └── product-grid.tsx    # Product grid layout
├── lib/                    # Utility functions and configurations
│   ├── supabase.ts         # Supabase client and database functions
│   ├── types.ts            # TypeScript types and schemas
│   └── utils.ts            # Utility functions
├── supabase-schema.sql     # Database schema for setup
├── SUPABASE_SETUP.md       # Detailed setup guide
└── public/                 # Static assets
```

## 🗄️ Database Schema

The application uses three main tables:

### Categories Table

- **Purpose**: Store all available categories
- **Features**: Pre-populated with 20 categories, supports custom additions
- **Key Fields**: `id`, `name`, `description`

### Products Table

- **Purpose**: Store approved products shown in directory
- **Features**: Category linking, featured flag, status management
- **Key Fields**: `id`, `name`, `description`, `url`, `category_id`, `category_name`, `pricing`, `featured`, `status`

### Submissions Table

- **Purpose**: Store product submissions for review
- **Features**: Optional email contact, custom categories, status tracking
- **Key Fields**: `id`, `name`, `description`, `url`, `category_id`, `category_name`, `pricing`, `email`, `status`

## 🎨 Design System

The application uses a consistent design system built with:

- **Colors**: Blue primary (#2563eb), with semantic colors for pricing badges
- **Typography**: Geist Sans for body text, Geist Mono for code
- **Components**: Shadcn UI components for consistency and accessibility
- **Layout**: Container-based responsive design with consistent spacing

## 🔧 Key Features

### Enhanced Category System

- 20 predefined categories covering various tool types
- Dynamic category loading from database
- Custom category creation through submission form
- Automatic category management and deduplication

### Flexible Product Submission

- Optional email contact field
- Logo upload support (ready for file storage integration)
- Custom category creation
- Form validation with Zod schemas
- Real-time submission to Supabase

### Advanced Search & Filtering

- Full-text search across product names and descriptions
- Category-based filtering
- Pricing model filtering
- Real-time results with loading states

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Categories

Categories are now dynamically loaded from the database. To add new default categories, update the `supabase-schema.sql` file and re-run the INSERT statements.

## 🐛 Troubleshooting

### Common Issues

#### "new row violates row-level security policy for table 'submissions'"

This error occurs when the Supabase Row Level Security (RLS) policies are not properly configured. To fix:

1. **Check Environment Variables**: Ensure your `.env.local` file exists with correct values:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Update RLS Policies**: Run this SQL in your Supabase SQL Editor:

   ```sql
   -- Drop existing policies
   DROP POLICY IF EXISTS "Allow public insert to submissions" ON submissions;

   -- Create new policies for anonymous and authenticated users
   CREATE POLICY "Allow anonymous insert to submissions" ON submissions
       FOR INSERT TO anon WITH CHECK (true);

   CREATE POLICY "Allow authenticated insert to submissions" ON submissions
       FOR INSERT TO authenticated WITH CHECK (true);
   ```

3. **Restart Development Server**: After making changes, restart your dev server:
   ```bash
   npm run dev
   ```

#### Environment Variables Not Loading

- Ensure `.env.local` is in your project root (not in a subdirectory)
- Restart your development server after creating/modifying `.env.local`
- Check that variable names start with `NEXT_PUBLIC_` for client-side access

#### Database Connection Issues

- Verify your Supabase project is active (not paused)
- Check that your API keys are correct in the Supabase dashboard
- Ensure your project URL format is correct: `https://your-project-id.supabase.co`

#### Form Submission Errors

- Check browser console for detailed error messages
- Verify all required fields are filled
- Ensure your Supabase project has the correct schema applied

### Getting Help

If you're still experiencing issues:

1. Check the browser console for detailed error messages
2. Review the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) guide
3. Verify your Supabase dashboard shows the correct tables and policies
4. Open an issue on GitHub with error details and your configuration (without sensitive keys)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the icon library

## 📞 Support

If you have any questions or need help with setup, please:

1. Check the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) guide
2. Open an issue on GitHub
3. Contact us at support@cursorforthat.com

---

Built with ❤️ for the developer community
