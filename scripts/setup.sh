#!/bin/bash

echo "🧪 Setting up barelab..."
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18 or higher is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one from .env.example"
    exit 1
fi
echo "✅ .env file found"
echo ""

# Initialize database
echo "🗄️  Initializing database..."
npm run prisma:push
if [ $? -ne 0 ]; then
    echo "❌ Failed to initialize database"
    exit 1
fi
echo "✅ Database initialized"
echo ""

# Seed data
echo "🌱 Seeding database with sample data..."
npm run seed
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi
echo "✅ Database seeded"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Start the development server: npm run dev"
echo "   2. Open http://localhost:3000 in your browser"
echo "   3. Access admin panel at http://localhost:3000/admin"
echo "   4. Login with: admin@barelab.com / admin123"
echo ""
echo "📖 Read SETUP.md for detailed documentation"
echo ""
