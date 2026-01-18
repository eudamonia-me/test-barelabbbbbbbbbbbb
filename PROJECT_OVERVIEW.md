# barelab - Project Overview

## 🎯 Project Vision

barelab is a **transparent, data-driven cosmetics review platform** that shows products from the inside out, based on how they actually behave on real people's skin. Unlike traditional beauty blogs or influencer platforms, barelab generates all insights from aggregated user feedback, never from marketing claims or sponsored content.

## ✨ Key Features

### Public Website

#### 1. **Product Pages (3 Views)**
- **Overview**: Product info, key properties, skin type suitability scale
- **User Feedback**: Raw comments, pros/cons, ingredient insights
- **Data & Insights**: Charts, statistics, data transparency

#### 2. **Category Pages**
- Advanced filtering by skin type, finish, coverage, issues
- Formula-based filters (SPF, alcohol-free)
- All filters generated from user data, not manual labels

#### 3. **Data Visualization**
- Skin type suitability scale (dry to oily)
- Confidence bars showing % of users mentioning attributes
- Property indicators for finish, coverage, longevity
- Interactive charts for tag distribution

#### 4. **Transparency**
- Probability-based language ("67% of users report...")
- Never absolute claims ("this is good for dry skin")
- Clear disclaimers on every product page
- Show raw comment count and data sources

### Admin Panel

#### 5. **Dashboard**
- Platform statistics (products, comments, views)
- Most viewed products
- Recent activity
- Quick actions

#### 6. **Product Management**
- Add/edit/delete products
- Manage images, pricing, ingredients
- Publish/unpublish control
- No coding required

#### 7. **Comment Management**
- Add user feedback from any source
- Automatic tag extraction
- View comments with extracted tags
- Delete inappropriate content

#### 8. **Tag Dictionary**
- 50+ pre-defined tags across 6 categories
- View tags by category
- Understand keyword matching
- Tags auto-update as comments are added

#### 9. **Analytics**
- Page view tracking
- Product popularity metrics
- Top pages and trends
- Time-period filtering (7/30/90 days)

#### 10. **Site Settings**
- Edit all website text
- Customize disclaimer and about page
- Changes take effect immediately
- No coding required

## 🏗️ Technical Architecture

### Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: SQLite (development), PostgreSQL (production)
- **ORM**: Prisma (type-safe database access)
- **Styling**: Tailwind CSS (minimal, editorial design)
- **Charts**: Recharts (data visualization)
- **Auth**: NextAuth.js (admin authentication)

### Database Schema

#### Core Models
- **Product**: name, brand, category, ingredients, formula details
- **Comment**: raw user feedback, skin type, source
- **Tag**: dictionary of attributes (finish, coverage, issues, etc.)
- **ProductTag**: aggregated tags with confidence scores
- **CommentTag**: tags extracted from individual comments
- **PageView**: analytics tracking
- **ProductPairing**: products mentioned together
- **SiteSetting**: editable website content
- **User**: admin authentication

### Tag System

The heart of barelab's insight generation:

1. **Comment Input**: User writes "Works great on my oily skin! Matte finish lasts all day."
2. **Extraction**: System finds keywords → tags: `skin_type_oily`, `finish_matte`, `longevity_long`
3. **Assignment**: Tags linked to comment
4. **Aggregation**: Count tags across all comments for product
5. **Confidence**: Calculate percentage (mentions / total comments)
6. **Display**: Show "67% of users mention matte finish"

#### Tag Categories
- **Skin Type**: dry, oily, combination, normal, sensitive
- **Finish**: matte, dewy, satin, natural
- **Coverage**: sheer, light, medium, full
- **Issues**: oxidation, caking, drying, pore visibility, breakouts
- **Properties**: oil control, hydrating, lightweight, blendable, buildable
- **Longevity**: short wear, medium wear, long wear

## 📁 Project Structure

```
barelab/
├── app/                          # Next.js 14 app directory
│   ├── (public)/                # Public pages (no auth required)
│   │   ├── page.tsx             # Homepage
│   │   ├── products/            # Product listing and details
│   │   │   ├── page.tsx         # All products
│   │   │   └── [id]/page.tsx   # Single product (3 views)
│   │   ├── category/            # Category pages
│   │   │   └── [slug]/page.tsx # Category with filters
│   │   ├── about/page.tsx       # About page
│   │   └── layout.tsx           # Public layout (Header + Footer)
│   │
│   ├── admin/                   # Admin panel (auth required)
│   │   ├── page.tsx            # Dashboard
│   │   ├── products/           # Product CRUD
│   │   │   ├── page.tsx        # Product list
│   │   │   ├── new/page.tsx    # Add product
│   │   │   └── [id]/page.tsx   # Edit product
│   │   ├── comments/page.tsx   # Comment management
│   │   ├── tags/page.tsx       # Tag dictionary
│   │   ├── analytics/page.tsx  # Analytics dashboard
│   │   ├── settings/page.tsx   # Site settings
│   │   ├── login/page.tsx      # Login page
│   │   └── layout.tsx          # Admin layout
│   │
│   ├── api/                     # API routes
│   │   ├── auth/               # NextAuth endpoints
│   │   ├── products/           # Product CRUD endpoints
│   │   ├── comments/           # Comment CRUD endpoints
│   │   ├── tags/               # Tag endpoints
│   │   ├── analytics/          # Analytics endpoints
│   │   └── admin/settings/     # Settings endpoints
│   │
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
│
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Disclaimer.tsx
│   │
│   ├── product/                 # Product-specific components
│   │   ├── ProductCard.tsx     # Product grid item
│   │   └── CommentCard.tsx     # User comment display
│   │
│   ├── visualizations/          # Data visualization components
│   │   ├── ConfidenceBar.tsx   # Percentage bar
│   │   ├── SkinTypeScale.tsx   # Dry-to-oily scale
│   │   ├── PropertyIndicator.tsx # Dot indicator
│   │   └── TagChart.tsx        # Bar charts
│   │
│   └── admin/                   # Admin components
│       ├── AdminHeader.tsx
│       └── AdminSidebar.tsx
│
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── tags.ts                 # Tag extraction & aggregation logic
│   ├── analytics.ts            # Analytics utilities
│   └── auth.ts                 # Auth helpers
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.js                 # Seed data script
│
├── scripts/
│   ├── setup.sh                # Initial setup script
│   └── reset.sh                # Database reset script
│
├── public/                      # Static assets
│
├── .env                         # Environment variables
├── .env.example                # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
├── README.md                   # Project overview
├── SETUP.md                    # Setup instructions
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
└── PROJECT_OVERVIEW.md         # This file
```

## 📊 File Statistics

- **Total TypeScript/React files**: 42
- **API routes**: 8
- **Public pages**: 5
- **Admin pages**: 7
- **Reusable components**: 15+
- **Database tables**: 10

## 🚀 Getting Started

### Quick Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Initialize database
npm run prisma:push

# 3. Seed sample data
npm run seed

# 4. Start development server
npm run dev
```

Visit:
- **Website**: http://localhost:3000
- **Admin**: http://localhost:3000/admin (login: admin@barelab.com / admin123)

### Or Use Setup Script

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## 🎨 Design Philosophy

### Visual Design
- **Minimal**: Clean, uncluttered interface
- **Editorial**: Typography-focused, magazine-like
- **Calm**: Neutral colors, no aggressive CTAs
- **Trustworthy**: Professional, data-focused

### Color Palette
- **Primary**: Neutral grays (#171717 to #fafafa)
- **Accents**: Used sparingly for data visualization
- **No bright colors**: Maintains calm, professional tone

### Typography
- **Font**: Inter (system fallback)
- **Weights**: Light for headlines, regular for body
- **Scale**: Clear hierarchy without excessive sizes

## 🔐 Security

### Authentication
- **NextAuth.js**: Industry-standard authentication
- **Password hashing**: bcryptjs with salt rounds
- **Session management**: JWT-based sessions
- **Protected routes**: Admin panel requires authentication

### Data Privacy
- **No tracking**: No third-party analytics or trackers
- **Anonymized comments**: No usernames or personal data stored
- **Local analytics**: Page views stored in own database
- **GDPR-friendly**: Minimal data collection

## 📈 Scalability

### Current Setup (Development)
- **SQLite**: Simple, file-based database
- **Single server**: Next.js handles everything
- **Local storage**: Images via URLs only

### Production Ready
- **PostgreSQL**: Change datasource in schema.prisma
- **Vercel/Railway**: One-click deployment
- **CDN**: Next.js automatic image optimization
- **Caching**: API route caching ready to implement

### Future Scaling
- **Image upload**: S3/Cloudinary integration ready
- **Search**: Full-text search with indexes
- **API rate limiting**: Easy to add with middleware
- **Horizontal scaling**: Stateless architecture ready

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Homepage loads with sample products
- [ ] Product pages show all 3 views correctly
- [ ] Category filtering works as expected
- [ ] Admin login succeeds
- [ ] Product CRUD operations work
- [ ] Comment addition triggers tag extraction
- [ ] Analytics track page views
- [ ] Settings changes appear on site

### Automated Testing (Future)
- Unit tests for tag extraction logic
- Integration tests for API endpoints
- E2E tests for critical user flows

## 🌟 Core Differentiators

### What Makes barelab Unique

1. **No Sponsored Content**: 100% user feedback, zero brand influence
2. **Probability-Based**: Never absolute claims, always percentages
3. **Full Transparency**: See raw data behind every insight
4. **Automatic Insights**: No manual product labeling required
5. **Privacy-First**: Anonymized data, no tracking
6. **Open Source**: MIT license, fully customizable
7. **Editorial Design**: Calm, professional, trustworthy
8. **Admin-Friendly**: No coding needed to manage content

## 🔮 Future Roadmap

### Phase 1 (Current) ✅
- Core platform with admin panel
- Tag-based insight generation
- Basic analytics
- Sample data

### Phase 2 (Next)
- User-submitted reviews
- Advanced search functionality
- Product comparison feature
- Export data (CSV/PDF)

### Phase 3 (Future)
- Mobile apps
- Recommendation engine
- Multi-language support
- Public API

### Phase 4 (Long-term)
- Machine learning for tag extraction
- Sentiment analysis
- Image recognition for product matching
- Community features

## 💡 Key Insights

### Design Decisions

**Why SQLite?**
- Easy setup for development
- No additional services needed
- Simple migration to PostgreSQL

**Why tag-based system?**
- Scalable and automatic
- Works across languages
- Reduces manual work

**Why Next.js?**
- Best-in-class React framework
- Built-in API routes
- Excellent SEO support
- Easy deployment

**Why no user accounts (yet)?**
- Focus on admin features first
- Reduces complexity
- Easier to launch

## 📞 Support

- **Documentation**: See README.md and SETUP.md
- **Issues**: Report bugs on GitHub
- **Questions**: Open a discussion
- **Contributions**: See CONTRIBUTING.md

## 📄 License

MIT License - Free to use, modify, and distribute.

---

**barelab** - Real products. Real data. Real transparent.

Built with ❤️ for honest beauty reviews.
