# Deployment Guide for Barelab on Vercel

## Prerequisites
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A PostgreSQL database (recommended: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Supabase](https://supabase.com))
- Git repository with your code

## Step 1: Prepare Your Database

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Click on "Storage" → "Create Database" → "Postgres"
3. Copy the `DATABASE_URL` connection string

### Option B: Supabase (Free Tier Available)
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use the "connection pooling" URL for better performance)

## Step 2: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Easiest)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your repository
   - Click "Import"

3. **Configure Environment Variables**
   In the Vercel dashboard, add these environment variables:
   
   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=your_random_secret_key_here
   ADMIN_EMAIL=admin@barelab.com
   ADMIN_PASSWORD=your_secure_password
   ```

   **To generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Method 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add ADMIN_EMAIL
   vercel env add ADMIN_PASSWORD
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 3: Initialize Database

After deployment, you need to set up your database schema:

1. **Install Prisma CLI locally** (if not already installed)
   ```bash
   npm install -g prisma
   ```

2. **Set your production DATABASE_URL temporarily**
   ```bash
   export DATABASE_URL="your_postgresql_connection_string"
   ```

3. **Push the schema to your database**
   ```bash
   npx prisma db push
   ```

4. **Seed the database** (optional, creates initial data)
   ```bash
   npm run seed
   ```

## Step 4: Verify Deployment

1. Visit your deployed site: `https://your-app-name.vercel.app`
2. Test the admin login: `https://your-app-name.vercel.app/admin/login`
3. Use the credentials you set in `ADMIN_EMAIL` and `ADMIN_PASSWORD`

## Troubleshooting

### Build Errors
- Check the Vercel build logs in your dashboard
- Ensure all environment variables are set correctly
- Verify your `DATABASE_URL` is accessible from Vercel

### Database Connection Issues
- Make sure your PostgreSQL database allows connections from Vercel's IP ranges
- For Supabase, use the connection pooling URL for better reliability
- Check that `DATABASE_URL` includes `?pgbouncer=true` for connection pooling

### Prisma Issues
- The `postinstall` script in package.json automatically runs `prisma generate`
- If you encounter Prisma errors, try redeploying after clearing the build cache

### Authentication Issues
- Ensure `NEXTAUTH_URL` matches your actual domain (no trailing slash)
- Verify `NEXTAUTH_SECRET` is set and is a secure random string

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?pgbouncer=true` |
| `NEXTAUTH_URL` | Full URL of your deployed app | `https://barelab.vercel.app` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Admin login email | `admin@barelab.com` |
| `ADMIN_PASSWORD` | Admin login password | `SecurePassword123!` |

## Post-Deployment

### Add Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Update `NEXTAUTH_URL` to your custom domain

### Monitor Your App
- Check Vercel Analytics for traffic insights
- Monitor database usage in your PostgreSQL provider dashboard
- Set up error tracking (optional: Sentry, LogRocket, etc.)

## Local Development vs Production

### Local Development (SQLite)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
```

### Production (PostgreSQL)
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
```

**Note:** The schema now uses PostgreSQL by default. For local development with SQLite, you'll need to temporarily change the provider in `prisma/schema.prisma`.

## Continuous Deployment

Once connected to Git, Vercel automatically:
- Deploys on every push to main branch (production)
- Creates preview deployments for pull requests
- Runs the build command automatically

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
