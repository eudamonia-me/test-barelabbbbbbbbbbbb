# barelab Setup Guide

Complete guide to setting up and running the barelab platform.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)

## Quick Start

Follow these steps to get barelab running on your local machine:

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, React, Tailwind CSS, and other dependencies.

### 2. Set Up Environment Variables

A `.env` file has been created with default values. **Important:** Change the admin password before deploying to production!

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
ADMIN_EMAIL="admin@barelab.com"
ADMIN_PASSWORD="admin123"
```

For production, generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Initialize the Database

```bash
npm run prisma:push
```

This creates the SQLite database and all required tables based on the Prisma schema.

### 4. Seed Sample Data

```bash
npm run seed
```

This populates the database with:
- Admin user account
- Complete tag dictionary (50+ tags)
- 4 sample products
- Sample user comments
- Aggregated product insights
- Site settings

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Accessing the Platform

### Public Website
- **Homepage**: http://localhost:3000
- **All Products**: http://localhost:3000/products
- **Categories**: http://localhost:3000/category/foundation
- **About**: http://localhost:3000/about

### Admin Panel
- **URL**: http://localhost:3000/admin
- **Email**: admin@barelab.com
- **Password**: admin123 (change this!)

## Admin Panel Features

Once logged in to the admin panel, you can:

### 1. Dashboard
- View platform statistics
- See most viewed products
- Review recent comments
- Quick actions for common tasks

### 2. Products Management
- **Add products**: Click "Add Product" to create new product entries
- **Edit products**: Update product details, images, pricing, ingredients
- **Delete products**: Remove products (this also deletes all associated comments)
- **Publish/unpublish**: Control visibility on the public website

### 3. Comments Management
- **Add comments**: Manually add user feedback from any source
- **View all comments**: See all comments with extracted tags
- **Delete comments**: Remove inappropriate or duplicate feedback
- **Auto-tagging**: Tags are automatically extracted when you add comments

### 4. Tag Dictionary
- View all available tags organized by category
- Understand how tags are used for insight extraction
- Tag categories: Skin Type, Finish, Coverage, Issues, Properties, Longevity

### 5. Analytics
- Track page views and product popularity
- View most viewed products
- See top pages by traffic
- Filter by time period (7, 30, or 90 days)

### 6. Site Settings
- Edit website text (tagline, disclaimer, about text)
- Customize visible content
- All changes take effect immediately

## How It Works

### Data Flow

1. **User Comments** → Raw feedback is added (manually or from social platforms)
2. **Tag Extraction** → System analyzes comments and extracts structured tags
3. **Aggregation** → Tags are counted and confidence scores calculated
4. **Insights** → Product pages display probability-based insights
5. **Visualization** → Data shown as bars, scales, charts, and percentages

### Tag System

Tags are the core of barelab's insight generation:

- **Automatic extraction**: Keywords in comments trigger tag assignment
- **Categories**: 6 categories (skin type, finish, coverage, issues, properties, longevity)
- **Confidence scores**: Calculated as (mentions / total comments)
- **Thresholds**: Only tags mentioned by >20% of users are shown

### Example

User comment: *"Works great on my oily skin! Stays matte all day without oxidizing. Medium coverage that's buildable."*

Extracted tags:
- `skin_type_oily` (from "oily skin")
- `finish_matte` (from "matte")
- `coverage_medium` (from "medium coverage")
- `property_buildable` (from "buildable")
- `issue_no_oxidation` (from "without oxidizing")
- `longevity_long` (from "all day")

## Project Structure

```
barelab/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── products/      # Product listing and detail pages
│   │   ├── category/      # Category pages with filtering
│   │   └── about/         # About page
│   ├── admin/             # Admin panel (protected)
│   │   ├── products/      # Product management
│   │   ├── comments/      # Comment management
│   │   ├── tags/          # Tag dictionary
│   │   ├── analytics/     # Analytics dashboard
│   │   └── settings/      # Site settings
│   └── api/               # API routes
│       ├── auth/          # NextAuth authentication
│       ├── products/      # Product CRUD operations
│       ├── comments/      # Comment CRUD operations
│       ├── tags/          # Tag operations
│       └── analytics/     # Analytics endpoints
├── components/
│   ├── ui/                # Reusable UI components
│   ├── product/           # Product-specific components
│   ├── visualizations/    # Data visualization components
│   └── admin/             # Admin-specific components
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── tags.ts            # Tag extraction logic
│   ├── analytics.ts       # Analytics utilities
│   └── auth.ts            # Authentication helpers
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Seed data script
└── public/                # Static assets
```

## Adding Content

### Adding a New Product

1. Go to **Admin → Products → Add Product**
2. Fill in required fields:
   - Product Name
   - Brand
   - Category
3. Optional fields:
   - Image URL (use Unsplash or product image)
   - Price and currency
   - Ingredients list
   - SPF information
   - Alcohol presence
4. Click **Create Product**

### Adding User Feedback

1. Go to **Admin → Comments → Add Comment**
2. Select the product
3. Enter the comment text (copy-paste from social media or user feedback)
4. Optionally specify the user's skin type
5. Click **Add Comment**
6. Tags will be automatically extracted and product insights updated

### Understanding Insights

The system generates insights like:
- **"67% of users mention matte finish"** - High confidence (>50%)
- **"Based on 12 user comments"** - Transparency about data size
- **"Most users with oily skin report positive experiences"** - Probability-based language
- **Never**: "This product is good for oily skin" (absolute claims)

## Database Management

### View Database
```bash
npm run prisma:studio
```

This opens Prisma Studio, a visual database editor at http://localhost:5555

### Reset Database
```bash
rm prisma/dev.db
npm run prisma:push
npm run seed
```

### Backup Database
```bash
cp prisma/dev.db prisma/dev.db.backup
```

## Production Deployment

### 1. Update Environment Variables

Create a production `.env` file:

```env
DATABASE_URL="postgresql://user:password@host:5432/barelab"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secure-secret-key"
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="secure-password"
```

**Note**: For production, use PostgreSQL instead of SQLite. Update the `datasource` in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Build for Production

```bash
npm run build
```

### 3. Start Production Server

```bash
npm start
```

### 4. Deployment Platforms

barelab can be deployed to:

- **Vercel** (recommended for Next.js)
  - Connect your GitHub repo
  - Add environment variables
  - Deploy automatically

- **Railway** / **Render**
  - Built-in PostgreSQL support
  - Easy environment configuration

- **AWS** / **Google Cloud** / **Azure**
  - Full control over infrastructure
  - More complex setup

## Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

**Solution**: 
```bash
npm run prisma:push
```

### Authentication Issues

**Error**: `NextAuth configuration error`

**Solution**: Check that `NEXTAUTH_SECRET` is set in `.env`

### Tags Not Extracting

**Problem**: Comments added but no tags appear

**Solution**: 
- Check that comment text contains keywords from tag dictionary
- View tag dictionary in admin panel to see available keywords
- Tags require specific phrases (e.g., "oily skin", "matte finish")

### Build Errors

**Error**: `Module not found`

**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

Planned features for future versions:

- **User-submitted reviews**: Allow public users to submit feedback
- **Advanced search**: Full-text search across products and comments
- **Product comparison**: Side-by-side comparison of products
- **Recommendation engine**: Personalized suggestions based on skin type
- **Multi-language support**: Internationalization
- **Mobile app**: Native iOS/Android apps
- **API access**: Public API for developers
- **Advanced analytics**: Conversion tracking, user flows
- **Image upload**: Direct image upload instead of URLs
- **Comment moderation**: Flag and review system

## Support

### Documentation
- README.md - Project overview
- SETUP.md - This setup guide
- Prisma schema comments - Database structure documentation

### Community
- GitHub Issues - Report bugs or request features
- Discussions - Ask questions and share ideas

### Contact
For questions or support, please open an issue on GitHub.

---

## License

MIT License - see LICENSE file for details

## Credits

Built with:
- Next.js 14 - React framework
- Prisma - Database ORM
- Tailwind CSS - Styling
- Recharts - Data visualization
- NextAuth - Authentication
- SQLite - Database (development)

---

**Happy reviewing! 🧪✨**
