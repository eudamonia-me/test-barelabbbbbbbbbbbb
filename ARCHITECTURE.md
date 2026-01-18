# barelab - Technical Architecture

Detailed technical documentation for developers.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js 14)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  Public Pages    │      │  Admin Panel     │            │
│  │  - Homepage      │      │  - Dashboard     │            │
│  │  - Products      │      │  - Products CRUD │            │
│  │  - Categories    │      │  - Comments      │            │
│  │  - About         │      │  - Analytics     │            │
│  └──────────────────┘      └──────────────────┘            │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                         API Layer (Next.js API Routes)       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  /api/products      /api/comments      /api/tags            │
│  /api/analytics     /api/auth          /api/admin/settings  │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                         Business Logic                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Tag Extraction  │  │  Aggregation     │                │
│  │  - Keyword match │  │  - Count tags    │                │
│  │  - Auto-assign   │  │  - Confidence    │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Analytics       │  │  Authentication  │                │
│  │  - Track views   │  │  - NextAuth.js   │                │
│  │  - Aggregate     │  │  - JWT sessions  │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    Database Layer (Prisma ORM)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│     SQLite (Development) / PostgreSQL (Production)           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Adding a Comment

```
1. Admin adds comment via UI
   ↓
2. POST /api/comments
   ↓
3. Comment saved to database
   ↓
4. Tag extraction runs (lib/tags.ts)
   ↓
5. Tags assigned to comment
   ↓
6. Product tags re-aggregated
   ↓
7. Confidence scores recalculated
   ↓
8. Product page auto-updates
```

### Viewing a Product

```
1. User visits /products/[id]
   ↓
2. Server-side data fetch
   ↓
3. Load product + comments + tags
   ↓
4. Calculate insights
   ↓
5. Generate visualizations
   ↓
6. Track page view (analytics)
   ↓
7. Render HTML (SSR)
   ↓
8. Send to browser
```

## Key Technologies

### Frontend
- **Next.js 14**: App Router, Server Components, API Routes
- **React 18**: UI components, Client Components for interactivity
- **TypeScript**: Type safety throughout
- **Tailwind CSS**: Utility-first styling

### Backend
- **Next.js API Routes**: RESTful API endpoints
- **Prisma**: Type-safe database queries
- **NextAuth.js**: Authentication and sessions
- **bcryptjs**: Password hashing

### Database
- **SQLite**: Development (file-based, zero config)
- **PostgreSQL**: Production (recommended)
- **Prisma Migrate**: Schema management

### Visualization
- **Recharts**: Chart library for data visualization
- **Custom Components**: Bars, scales, indicators

## Database Schema

### Tables

```
Product
├── id (primary key)
├── name, brand, category
├── description (auto-generated)
├── imageUrl, price, currency
├── ingredients, hasSPF, spfValue, hasAlcohol
├── published, viewCount
└── timestamps

Comment
├── id (primary key)
├── productId (foreign key)
├── text, source, sourceUrl
├── skinType (optional)
├── processed, sentiment
└── timestamps

Tag
├── id (primary key)
├── key (unique)
├── category, label, description
└── timestamps

ProductTag (aggregated)
├── id (primary key)
├── productId, tagId (foreign keys)
├── count, confidence
└── timestamps

CommentTag
├── id (primary key)
├── commentId, tagId (foreign keys)
└── timestamp

PageView (analytics)
├── id (primary key)
├── path, productId, referrer, userAgent
└── timestamp

User (admin)
├── id (primary key)
├── email (unique), password (hashed)
├── role
└── timestamps

SiteSetting
├── id (primary key)
├── key (unique), value, description
└── timestamps
```

### Relationships

```
Product 1──N Comment
Product 1──N ProductTag
Comment 1──N CommentTag
Tag 1──N ProductTag
Tag 1──N CommentTag
```

## Tag Extraction Algorithm

```typescript
function extractTags(commentText: string): string[] {
  const tags = []
  const lowerText = commentText.toLowerCase()
  
  for (const tagDef of TAG_DICTIONARY) {
    for (const keyword of tagDef.keywords) {
      if (lowerText.includes(keyword)) {
        tags.push(tagDef.key)
        break // Only add each tag once
      }
    }
  }
  
  return tags
}
```

### Example

Input: "Works great on my oily skin! Stays matte all day."

Keywords matched:
- "oily skin" → `skin_type_oily`
- "matte" → `finish_matte`
- "all day" → `longevity_long`

Output: `['skin_type_oily', 'finish_matte', 'longevity_long']`

## Aggregation Algorithm

```typescript
function aggregateProductTags(comments): Map<string, TagData> {
  const tagCounts = new Map()
  const total = comments.length
  
  // Count occurrences
  for (const comment of comments) {
    for (const tag of comment.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    }
  }
  
  // Calculate confidence
  const result = new Map()
  for (const [tag, count] of tagCounts) {
    result.set(tag, {
      count,
      confidence: count / total // 0.0 to 1.0
    })
  }
  
  return result
}
```

## API Endpoints

### Public Endpoints

```
GET  /api/products              # List products (with filters)
GET  /api/products/[id]         # Get single product
GET  /api/comments?productId=X  # Get product comments
GET  /api/tags                  # Get tag dictionary
```

### Protected Endpoints (Admin Only)

```
POST   /api/products            # Create product
PATCH  /api/products/[id]       # Update product
DELETE /api/products/[id]       # Delete product

POST   /api/comments            # Create comment
PATCH  /api/comments/[id]       # Update comment
DELETE /api/comments/[id]       # Delete comment

GET    /api/analytics           # Get analytics
GET    /api/admin/settings      # Get settings
PATCH  /api/admin/settings      # Update setting
```

## Authentication Flow

```
1. User visits /admin
   ↓
2. Redirected to /admin/login
   ↓
3. Submit credentials
   ↓
4. POST /api/auth/credentials
   ↓
5. Verify with database
   ↓
6. Generate JWT session
   ↓
7. Set secure cookie
   ↓
8. Redirect to /admin
   ↓
9. Middleware checks session
   ↓
10. Grant access
```

## Performance Optimizations

### Implemented
- Server-side rendering (SSR)
- Static asset optimization
- Database indexing (productId, category, tags)
- Efficient queries with Prisma

### Ready to Implement
- React Server Components caching
- API route caching
- Image CDN
- Database connection pooling

## Security Measures

### Current
- Password hashing (bcrypt, 10 rounds)
- JWT session tokens
- SQL injection prevention (Prisma)
- XSS prevention (React escaping)
- CSRF protection (NextAuth)

### Recommended (Production)
- Rate limiting
- HTTPS only
- Secure cookie flags
- Content Security Policy
- Regular security audits

## Deployment

### Development
```bash
npm run dev  # http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables

Required:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your domain
- `NEXTAUTH_SECRET`: Random secret (32+ chars)
- `ADMIN_EMAIL`: Admin email
- `ADMIN_PASSWORD`: Admin password

## Monitoring

### Built-in
- Page view tracking
- Product view counts
- Analytics dashboard

### Recommended (Production)
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Database monitoring
- Uptime monitoring

## Testing Strategy

### Manual Testing
- All CRUD operations
- Tag extraction accuracy
- Filter functionality
- Analytics tracking

### Automated Testing (Future)
- Unit tests: Tag extraction logic
- Integration tests: API endpoints
- E2E tests: Critical user flows

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT - See [LICENSE](./LICENSE)
