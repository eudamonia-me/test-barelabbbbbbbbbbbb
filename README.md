# barelab

<p align="center">
  <strong>Transparent, data-driven cosmetics review platform</strong>
</p>

<p align="center">
  Real products. Real data. Real transparent.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-license">License</a>
</p>

---

## 🎯 What is barelab?

barelab is a cosmetics review platform that shows products **from the inside out**, based on how they actually behave on real people's skin. All product insights are generated from real user feedback, never from marketing claims or sponsored content.

### Core Principles

- ✅ **Data-driven**: All insights based on aggregated user feedback
- ✅ **Transparent**: Probability-based insights, never absolute claims  
- ✅ **Neutral**: No expert opinions, no influencer reviews, no brand marketing
- ✅ **Real**: Shows how products actually perform on real people

### What We Don't Do

- ❌ No sponsored content or paid reviews
- ❌ No absolute claims about products
- ❌ No brand prioritization
- ❌ No affiliate links or commissions
- ❌ No "expert" opinions

---

## ⚡ Quick Start

Get barelab running in **5 minutes**:

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run prisma:push

# 3. Add sample data
npm run seed

# 4. Start server
npm run dev
```

**Or use the setup script:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Visit:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Login**: admin@barelab.com / admin123

📖 **Detailed guide**: See [QUICKSTART.md](./QUICKSTART.md)

---

## ✨ Features

### 🌐 Public Website

#### **Product Pages (3 Views)**
1. **Overview** - Product info, key properties, skin type suitability scale
2. **User Feedback** - Raw comments, pros/cons, ingredient insights  
3. **Data & Insights** - Charts, statistics, full transparency

#### **Category Pages**
- Advanced filtering by skin type, finish, coverage, issues
- Formula-based filters (SPF, alcohol-free)
- All filters generated from user data automatically

#### **Data Visualization**
- Skin type suitability scale (dry → oily)
- Confidence bars showing percentage of user mentions
- Property indicators for finish, coverage, longevity
- Interactive charts for tag distribution

### 🔐 Admin Panel

#### **Dashboard**
- Platform statistics (products, comments, views)
- Most viewed products
- Recent activity and quick actions

#### **Product Management**
- Add/edit/delete products
- Manage images, pricing, ingredients
- Publish/unpublish control
- **No coding required**

#### **Comment Management**
- Add user feedback from any source
- **Automatic tag extraction** from text
- View comments with extracted tags
- Manage and moderate content

#### **Tag Dictionary**
- 50+ pre-defined tags across 6 categories
- View and understand tag system
- Automatic keyword matching

#### **Analytics**
- Page view tracking
- Product popularity metrics
- Time-period filtering
- Privacy-first (no third-party tracking)

#### **Site Settings**
- Edit all website text
- Customize disclaimer and about page
- Changes take effect immediately

---

## 📚 Documentation

- 📖 **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes
- 🔧 **[SETUP.md](./SETUP.md)** - Complete setup guide
- 🏗️ **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Project architecture
- 💻 **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical details
- 🤝 **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI components and interactivity
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - RESTful API
- **Prisma** - Type-safe database ORM
- **NextAuth.js** - Authentication
- **SQLite/PostgreSQL** - Database

### Key Features
- Server-side rendering (SSR)
- Automatic tag extraction
- Real-time analytics
- Admin panel with no-code management

---

## 📊 How It Works

### The Tag System

1. **User writes**: "Works great on my oily skin! Matte finish lasts all day."
2. **System extracts**: `skin_type_oily`, `finish_matte`, `longevity_long`
3. **Aggregation**: Count tags across all comments
4. **Confidence**: Calculate percentage (mentions / total)
5. **Display**: "67% of users mention matte finish"

### 6 Tag Categories

- **Skin Type**: dry, oily, combination, normal, sensitive
- **Finish**: matte, dewy, satin, natural
- **Coverage**: sheer, light, medium, full
- **Issues**: oxidation, caking, drying, pore visibility
- **Properties**: oil control, hydrating, lightweight, blendable
- **Longevity**: short, medium, long wear

---

## 📁 Project Structure

```
barelab/
├── app/
│   ├── (public)/          # Public pages (Homepage, Products, Categories)
│   ├── admin/             # Admin panel (Dashboard, CRUD, Analytics)
│   └── api/               # API routes (Products, Comments, Analytics)
├── components/
│   ├── ui/                # Reusable components (Card, Badge, etc.)
│   ├── product/           # Product-specific components
│   ├── visualizations/    # Charts and data viz
│   └── admin/             # Admin components
├── lib/
│   ├── prisma.ts          # Database client
│   ├── tags.ts            # Tag extraction logic (50+ tags)
│   ├── analytics.ts       # Analytics utilities
│   └── auth.ts            # Authentication helpers
├── prisma/
│   ├── schema.prisma      # Database schema (10 tables)
│   └── seed.js            # Sample data script
└── scripts/
    ├── setup.sh           # Automatic setup
    └── reset.sh           # Database reset
```

**Stats**: 42 TypeScript files • 8 API routes • 15+ components

---

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production

1. **Update database** to PostgreSQL in `prisma/schema.prisma`
2. **Set environment variables** (see `.env.example`)
3. **Build**: `npm run build`
4. **Start**: `npm start`

### Recommended Platforms
- **Vercel** (Next.js optimized)
- **Railway** / **Render** (with PostgreSQL)
- **AWS** / **GCP** / **Azure**

---

## 🔮 Future Roadmap

### Phase 2 (Next)
- User-submitted reviews
- Advanced search
- Product comparison
- Data export (CSV/PDF)

### Phase 3 (Future)
- Mobile apps
- Recommendation engine
- Multi-language support
- Public API

### Phase 4 (Long-term)
- Machine learning for tag extraction
- Sentiment analysis
- Image recognition
- Community features

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Ways to Contribute
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 🏷️ Expand tag dictionary

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

Free to use, modify, and distribute.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Recharts](https://recharts.org/) - Visualization
- [NextAuth.js](https://next-auth.js.org/) - Authentication

---

## 📞 Support

- 📖 **Documentation**: See links above
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/barelab/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/barelab/discussions)
- 📧 **Contact**: Open an issue for questions

---

<p align="center">
  <strong>barelab</strong> - No hype. Just data. 🧪✨
</p>

<p align="center">
  Made with ❤️ for honest beauty reviews
</p>
