#!/bin/bash

echo "⚠️  This will delete all data and reset the database!"
read -p "Are you sure? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Cancelled"
    exit 0
fi

echo "🗑️  Removing database..."
rm -f prisma/dev.db prisma/dev.db-journal
echo "✅ Database removed"
echo ""

echo "🗄️  Recreating database..."
npm run prisma:push
echo "✅ Database created"
echo ""

echo "🌱 Seeding with fresh data..."
npm run seed
echo "✅ Database seeded"
echo ""

echo "🎉 Database reset complete!"
echo ""
