const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Sample products data
const sampleProducts = [
  {
    name: 'Natural Matte Foundation',
    brand: 'Studio Fix',
    category: 'foundation',
    imageUrl: 'https://images.unsplash.com/photo-1631214524020-7e18db4a8c67?w=400',
    price: 32.00,
    currency: 'USD',
    ingredients: 'Water, Cyclopentasiloxane, Dimethicone, Titanium Dioxide, Iron Oxides',
    hasSPF: true,
    spfValue: 15,
    hasAlcohol: false,
  },
  {
    name: 'Luminous Silk Foundation',
    brand: 'Beauty Co',
    category: 'foundation',
    imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fe31?w=400',
    price: 64.00,
    currency: 'USD',
    ingredients: 'Aqua, Glycerin, Dimethicone, Titanium Dioxide, Mica',
    hasSPF: false,
    hasAlcohol: false,
  },
  {
    name: 'Radiant Creamy Concealer',
    brand: 'Cover Pro',
    category: 'concealer',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
    price: 30.00,
    currency: 'USD',
    ingredients: 'Water, Dimethicone, Glycerin, Mineral Pigments',
    hasSPF: false,
    hasAlcohol: false,
  },
  {
    name: 'HD Loose Powder',
    brand: 'Studio Fix',
    category: 'powder',
    imageUrl: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400',
    price: 28.00,
    currency: 'USD',
    ingredients: 'Silica, Nylon-12, Polymethyl Methacrylate',
    hasSPF: false,
    hasAlcohol: false,
  },
]

// Sample comments for each product
const sampleComments = {
  'Natural Matte Foundation': [
    {
      text: 'Works great on my oily skin! Stays matte all day without oxidizing. Medium coverage that\'s buildable.',
      skinType: 'oily',
      source: 'manual',
    },
    {
      text: 'I have dry skin and this foundation made my face look flaky. Too drying for me.',
      skinType: 'dry',
      source: 'manual',
    },
    {
      text: 'Perfect matte finish, controls oil really well. Lasts about 8 hours on me. Full coverage.',
      skinType: 'oily',
      source: 'manual',
    },
    {
      text: 'Love the matte finish but it does emphasize my pores a bit. Good coverage though.',
      skinType: 'combination',
      source: 'manual',
    },
    {
      text: 'Great for my oily t-zone! Doesn\'t oxidize and blends easily. Medium to full coverage.',
      skinType: 'combination',
      source: 'manual',
    },
  ],
  'Luminous Silk Foundation': [
    {
      text: 'Beautiful dewy finish! Perfect for my dry skin. Hydrating and looks like skin. Light to medium coverage.',
      skinType: 'dry',
      source: 'manual',
    },
    {
      text: 'Too glowy for me, I have oily skin and it made me look greasy. Coverage is good though.',
      skinType: 'oily',
      source: 'manual',
    },
    {
      text: 'Gorgeous radiant finish, very lightweight and blendable. Doesn\'t oxidize. Medium coverage.',
      skinType: 'normal',
      source: 'manual',
    },
    {
      text: 'Love the dewy look! Doesn\'t dry me out at all. Light coverage but buildable.',
      skinType: 'dry',
      source: 'manual',
    },
    {
      text: 'Luminous finish is beautiful on my combination skin. Hydrating without being oily. Good packaging too.',
      skinType: 'combination',
      source: 'manual',
    },
  ],
  'Radiant Creamy Concealer': [
    {
      text: 'Full coverage concealer that doesn\'t crease! Stays put all day. Slightly dewy finish.',
      skinType: 'normal',
      source: 'manual',
    },
    {
      text: 'Great coverage but can be drying under the eyes. Creases a bit after a few hours.',
      skinType: 'dry',
      source: 'manual',
    },
    {
      text: 'Covers everything! Full coverage and long lasting. Works well on my oily skin.',
      skinType: 'oily',
      source: 'manual',
    },
    {
      text: 'Creamy texture, easy to blend. Doesn\'t cake. Medium to full coverage.',
      skinType: 'combination',
      source: 'manual',
    },
  ],
  'HD Loose Powder': [
    {
      text: 'Sets makeup beautifully! Doesn\'t look cakey. Controls oil all day.',
      skinType: 'oily',
      source: 'manual',
    },
    {
      text: 'Too drying for my skin. Made my dry patches worse. Flashback in photos.',
      skinType: 'dry',
      source: 'manual',
    },
    {
      text: 'Perfect setting powder for oily skin. Matte finish, no flashback if used lightly.',
      skinType: 'oily',
      source: 'manual',
    },
    {
      text: 'Great for setting t-zone. Doesn\'t dry out my cheeks. Lightweight.',
      skinType: 'combination',
      source: 'manual',
    },
  ],
}

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@barelab.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@barelab.com',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create tag dictionary
  const tagDictionary = require('../lib/tags').TAG_DICTIONARY
  console.log(`📝 Creating ${tagDictionary.length} tags...`)
  
  for (const tagDef of tagDictionary) {
    await prisma.tag.upsert({
      where: { key: tagDef.key },
      update: {
        category: tagDef.category,
        label: tagDef.label,
        description: tagDef.description || '',
      },
      create: {
        key: tagDef.key,
        category: tagDef.category,
        label: tagDef.label,
        description: tagDef.description || '',
      },
    })
  }
  console.log('✅ Created tag dictionary')

  // Create products and comments
  console.log('📦 Creating sample products...')
  
  for (const productData of sampleProducts) {
    const product = await prisma.product.create({
      data: productData,
    })
    console.log(`✅ Created product: ${product.name}`)

    // Add comments for this product
    const comments = sampleComments[product.name] || []
    console.log(`  💬 Adding ${comments.length} comments...`)

    for (const commentData of comments) {
      const comment = await prisma.comment.create({
        data: {
          ...commentData,
          productId: product.id,
        },
      })

      // Extract and assign tags
      const { extractTagsFromText } = require('../lib/tags')
      const tagKeys = extractTagsFromText(comment.text)

      for (const tagKey of tagKeys) {
        const tag = await prisma.tag.findUnique({
          where: { key: tagKey },
        })

        if (tag) {
          await prisma.commentTag.create({
            data: {
              commentId: comment.id,
              tagId: tag.id,
            },
          })
        }
      }

      // Mark comment as processed
      await prisma.comment.update({
        where: { id: comment.id },
        data: { processed: true },
      })
    }

    // Aggregate product tags
    const allComments = await prisma.comment.findMany({
      where: { productId: product.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    const commentsWithTags = allComments.map(c => ({
      tags: c.tags.map(t => t.tag.key),
    }))

    const { aggregateProductTags } = require('../lib/tags')
    const aggregatedTags = aggregateProductTags(commentsWithTags)

    for (const [tagKey, data] of aggregatedTags.entries()) {
      const tag = await prisma.tag.findUnique({
        where: { key: tagKey },
      })

      if (tag) {
        await prisma.productTag.upsert({
          where: {
            productId_tagId: {
              productId: product.id,
              tagId: tag.id,
            },
          },
          update: {
            count: data.count,
            confidence: data.confidence,
          },
          create: {
            productId: product.id,
            tagId: tag.id,
            count: data.count,
            confidence: data.confidence,
          },
        })
      }
    }

    console.log(`  ✅ Aggregated tags for ${product.name}`)
  }

  // Create site settings
  console.log('⚙️  Creating site settings...')
  
  const settings = [
    {
      key: 'site_name',
      value: 'barelab',
      description: 'Website name',
    },
    {
      key: 'site_tagline',
      value: 'Transparent, data-driven cosmetics reviews',
      description: 'Website tagline',
    },
    {
      key: 'disclaimer',
      value: 'All product insights on barelab are based on aggregated user feedback and may vary depending on individual skin type, routine, and environment. This information is not a substitute for professional advice.',
      description: 'Site disclaimer shown on product pages',
    },
    {
      key: 'about_text',
      value: 'barelab shows cosmetic products from the inside out, based on how they actually behave on real people\'s skin. We collect and analyze real user feedback to provide transparent, probability-based insights.',
      description: 'About section text',
    },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  
  console.log('✅ Created site settings')
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
