# CursorForThat.com Product Requirements Document (PRD)

## 1. Overview

**Product Name**: CursorForThat.com  
**Purpose**: A directory website to discover and explore SaaS products similar to Cursor IDE, leveraging prompt-based workflows to automate and enhance tasks for developers, creators, and productivity enthusiasts.  
**Objective**: Launch an MVP that provides a searchable, curated list of prompt-powered SaaS tools, enabling users to find relevant solutions and developers to submit their products.  
**Target Audience**: Developers, creators, and professionals seeking prompt-driven tools for coding, content creation, or task automation.  
**Tech Stack**: Next.js (React framework), Shadcn UI (component library), Tailwind CSS (styling), Supabase (backend for database and authentication).  
**MVP Goal**: Deliver a functional, user-friendly directory with minimal features to validate the concept, attract early users, and gather feedback for iteration.

## 2. Key Features

The MVP will include the following core features to ensure usability and scalability:

### 2.1 Searchable Product Listings

- **Description**: A homepage with a search bar and a list of SaaS products, each displaying name, short description (50-100 words), and a link to the product’s website.
- **Functionality**:
  - Keyword-based search to filter products by name or description.
  - Basic category filters (e.g., "AI Writing," "Code Automation," "Task Management").
  - Display 10-20 manually curated products initially.
- **User Interface**:
  - Search bar at the top of the homepage.
  - Grid or list view of products with a thumbnail (e.g., logo), name, and truncated description.
  - Clickable category tags for filtering.
- **Backend**:
  - Store product data (name, description, URL, category, logo URL) in a Supabase table (`products`).
  - Implement a simple text search query using Supabase’s full-text search.

### 2.2 Product Pages

- **Description**: Dedicated pages for each SaaS product with detailed information.
- **Functionality**:
  - Display product name, logo, full description (100-200 words), pricing (free/paid/freemium), target audience, and external website link.
  - Static rendering for SEO and performance.
- **User Interface**:
  - Clean layout with sections for description, pricing, and a “Visit Website” button.
  - Responsive design for desktop and mobile.
- **Backend**:
  - Fetch product details from the `products` table in Supabase using a dynamic route (e.g., `/products/[id]`).
  - Use Next.js dynamic routes for product pages.

### 2.3 Category-Based Navigation

- **Description**: A navigation system to browse products by category.
- **Functionality**:
  - Support 3-5 predefined categories (e.g., "AI Writing," "Code Automation," "Task Management").
  - Filter products by clicking category tags or a sidebar menu.
- **User Interface**:
  - Sidebar or top navigation bar with category links.
  - Highlight active category during browsing.
- **Backend**:
  - Store category as a field in the `products` table.
  - Query products by category using Supabase filters.

### 2.4 Developer Submission Form

- **Description**: A form for SaaS developers to submit their prompt-based tools for review.
- **Functionality**:
  - Fields: Product name, description, website URL, category, pricing, contact email.
  - Submissions are stored for manual review by the site admin.
- **User Interface**:
  - Simple form accessible via a “Submit Your Product” link in the header/footer.
  - Success message after submission.
- **Backend**:
  - Store submissions in a Supabase table (`submissions`).
  - Optional: Send admin an email notification for new submissions using Supabase Edge Functions.

### 2.5 Responsive Design

- **Description**: A clean, modern UI optimized for desktop and mobile.
- **Functionality**:
  - Use Shadcn UI components (e.g., Input, Button, Card) for consistency.
  - Apply Tailwind CSS for responsive layouts and styling.
  - Ensure fast load times with Next.js image optimization and static generation.
- **User Interface**:
  - Homepage: Hero section with tagline (“Find the perfect prompt-powered tool”), search bar, and product grid.
  - Consistent typography and color scheme (e.g., tech-inspired blues and whites).
- **Backend**:
  - Use Next.js Static Site Generation (SSG) for product pages and Incremental Static Regeneration (ISR) for dynamic updates.

### 2.6 Basic Analytics

- **Description**: Track user behavior to inform future iterations.
- **Functionality**:
  - Track page views, search queries, and click-throughs to product websites.
  - Use a third-party tool like Google Analytics or Plausible (privacy-focused).
- **User Interface**:
  - No visible UI for users; analytics run in the background.
- **Backend**:
  - Integrate analytics script in Next.js `_app.js` or via a Supabase Edge Function for custom events.

## 3. User Stories

- **As a user**, I want to search for prompt-based SaaS tools by keyword so I can quickly find tools relevant to my needs.
- **As a user**, I want to browse tools by category so I can explore options without a specific tool in mind.
- **As a user**, I want to view a product’s details (description, pricing, link) so I can decide if it’s worth trying.
- **As a developer**, I want to submit my SaaS product to the directory so it can reach a wider audience.
- **As an admin**, I want to review submissions manually to ensure only high-quality, relevant tools are listed.

## 4. Technical Requirements

- **Frontend**:
  - Framework: Next.js 15 (App Router) for server-side rendering, static generation, and dynamic routes.
  - UI Components: Shadcn UI for reusable, accessible components (e.g., Card, Input, Button).
  - Styling: Tailwind CSS v4 for responsive, utility-first styling.
  - Image Optimization: Use Next.js `Image` component for product logos.
- **Backend**:
  - Database: Supabase (PostgreSQL) for storing product data and submissions.
    - `products` table: `id`, `name`, `description`, `url`, `category`, `pricing`, `logo_url`.
    - `submissions` table: `id`, `name`, `description`, `url`, `category`, `pricing`, `email`, `status`.
  - API: Supabase client for querying products and handling form submissions.
  - Optional: Supabase Edge Functions for email notifications on new submissions.
- **Analytics**: Integrate Google Analytics or Plausible via a script in Next.js.
- **Hosting**: Vercel for seamless Next.js deployment and scalability.
- **SEO**: Use Next.js metadata API for dynamic meta tags (title, description) on product pages.

## 5. Non-Functional Requirements

- **Performance**: Page load time < 2 seconds (use Next.js SSG/ISR).
- **Scalability**: Supabase database and Vercel hosting to handle initial traffic (100-1,000 daily users).
- **Accessibility**: Follow WCAG 2.1 guidelines using Shadcn UI’s accessible components.
- **Security**: Use Supabase row-level security to restrict access to submissions. Sanitize form inputs to prevent XSS.

## 6. Success Metrics

- **User Engagement**: 500 unique visitors and 50 product page views within the first month.
- **Submissions**: 5-10 developer submissions within the first month.
- **Retention**: 20% of visitors return within 30 days (tracked via analytics).
- **SEO**: Appear in top 10 Google results for “prompt-based SaaS tools” within 3 months.

## 7. Development Timeline

- **Task 1**: Set up Next.js project, Supabase database, and basic UI with Shadcn UI/Tailwind CSS.
- **Task 2**: Implement homepage, search, category filters, and product pages.
- **Task 3**: Build submission form and admin review process (manual via Supabase dashboard).
- **Task 4**: Add analytics, test responsiveness, and deploy to Vercel. Curate initial 10-20 products.
- **Total**: 4 tasks for MVP launch.

## 8. Future Considerations

- Add user reviews/ratings after validating MVP.
- Introduce advanced filters (e.g., by feature, integration).
- Explore monetization (e.g., premium listings) post-launch.
- Implement admin dashboard for easier submission management.

## 9. Assumptions and Constraints

- **Assumptions**:
  - Initial 10-20 products will be manually curated by the team.
  - Users are familiar with prompt-based tools like Cursor.
  - Vercel and Supabase free tiers are sufficient for MVP traffic.
- **Constraints**:
  - Limited to manual submission review to ensure quality.
  - No user accounts or complex search algorithms in MVP.
  - Budget for development assumes use of free/low-cost tools.
