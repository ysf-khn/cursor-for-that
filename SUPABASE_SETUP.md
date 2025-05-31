# Supabase Setup Guide

This guide will help you set up Supabase for your CursorForThat application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "cursorforthat")
5. Enter a database password (save this securely)
6. Choose a region close to your users
7. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon public key** (under "Project API keys")

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase credentials.

## Step 4: Run the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase-schema.sql` from your project root
3. Paste it into the SQL Editor and click "Run"

This will create:

- `categories` table with 20 predefined categories
- `products` table for approved products
- `submissions` table for product submissions
- Proper indexes and Row Level Security policies

## Step 5: Verify Setup

1. Start your development server: `npm run dev`
2. Visit the submit page and try submitting a product
3. Check your Supabase dashboard to see if the submission appears in the `submissions` table

## Database Structure

### Categories Table

- Stores all available categories
- Pre-populated with 20 common categories
- New categories can be added through the submission form

### Products Table

- Stores approved products that appear in the directory
- Links to categories via `category_id` and `category_name`
- Includes featured flag for highlighting products

### Submissions Table

- Stores all product submissions for review
- Email field is optional
- Status tracking (pending, approved, rejected)
- Can include custom categories

## Row Level Security

The database uses Row Level Security (RLS) with the following policies:

- Public read access to active products
- Public read access to all categories
- Public insert access to submissions
- No public access to edit or delete data

## Next Steps

1. Test the submission form
2. Add some sample products to the `products` table
3. Customize categories as needed
4. Set up admin access for managing submissions (optional)

## Troubleshooting

### Common Issues

1. **Environment variables not loading**: Make sure `.env.local` is in your project root and restart your dev server
2. **Database connection errors**: Verify your Supabase URL and API key are correct
3. **RLS policy errors**: Ensure you've run the complete schema including the policies

### Getting Help

- Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Review the console for error messages
- Ensure your Supabase project is active and not paused
