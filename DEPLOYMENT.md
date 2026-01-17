# Vercel Deployment Guide for WeThinkWeConnect

This guide will help you deploy your WeThinkWeConnect application to Vercel.

## ⚠️ Recommended: Deploy Client and Server Separately

For a monorepo like this, it's **highly recommended** to deploy the client and server as two separate Vercel projects. This gives you better control and is easier to manage.

---

## Option 1: Separate Deployments (Recommended) ⭐

### Step 1: Deploy Backend (Server)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Project Name**: `wethinkweconnect-api` (or your choice)
   - **Root Directory**: `server`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty or `echo "No build needed"`
   - **Output Directory**: `.`
   - **Install Command**: `npm install`

5. **Add Environment Variables** (Project Settings → Environment Variables):

```
# Database (Neon DB)
PGHOST=ep-purple-mode-a12e8tra-pooler.ap-southeast-1.aws.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=npg_NjLgJvWO2MV1
PGSSLMODE=require
PGPORT=5432

# Application
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secure-jwt-secret-here
GEMINI_API_KEY=your-gemini-api-key

# CORS (will be set after frontend deployment)
CLIENT_URL=https://your-frontend.vercel.app
```

**Important**: 
- Generate JWT_SECRET: Run `openssl rand -base64 32` in terminal
- Get your Gemini API key from Google AI Studio if needed
- CLIENT_URL will be updated after frontend deployment

6. **Important**: You need to create a Vercel serverless function wrapper:

   Create `server/api/index.js`:
   ```javascript
   // This file will be auto-detected by Vercel as a serverless function
   const app = require('../server');
   
   module.exports = app;
   ```

   OR update `server/package.json` to set main:
   ```json
   {
     "main": "server.js"
   }
   ```

7. **Deploy** - Vercel will automatically deploy

8. **Note your backend URL**: e.g., `https://wethinkweconnect-api.vercel.app`

### Step 2: Deploy Frontend (Client)

1. **Create another project** in Vercel Dashboard
2. **Import the same GitHub repository**
3. **Configure:**
   - **Project Name**: `wethinkweconnect` (or your choice)
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables**:

```
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_SOCKET_URL=https://your-backend-url.vercel.app
```

**Replace `your-backend-url` with your actual backend Vercel URL from Step 1**

5. **Deploy**

6. **Update Backend CORS**:
   - Go back to your backend project
   - Update `CLIENT_URL` environment variable to your frontend URL
   - Redeploy backend if needed

---

## Option 2: Single Deployment (Advanced)

If you want to deploy everything in one project, you'll need to restructure:

1. Move server code to `api/` folder (Vercel expects serverless functions here)
2. Configure `vercel.json` for routing
3. This is more complex and less recommended

---

## Environment Variables Summary

### Backend (Server) Environment Variables:

```
# Required - Database
PGHOST=ep-purple-mode-a12e8tra-pooler.ap-southeast-1.aws.neon.tech
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=npg_NjLgJvWO2MV1
PGSSLMODE=require
PGPORT=5432

# Required - Security
JWT_SECRET=<generate-secure-random-string>
NODE_ENV=production

# Optional - Features
GEMINI_API_KEY=<your-gemini-key>

# Required after frontend deployment
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (Client) Environment Variables:

```
VITE_API_URL=https://your-backend.vercel.app/api
VITE_SOCKET_URL=https://your-backend.vercel.app
```

---

## Post-Deployment Steps

### 1. Test Your Deployment

- [ ] Visit your frontend URL
- [ ] Test registration/login
- [ ] Check API endpoints are working
- [ ] Test Socket.io connections (EchoSwap/Conflict features)
- [ ] Verify database connections

### 2. Update CORS Settings

After both are deployed, make sure your backend's `CLIENT_URL` environment variable matches your frontend URL exactly.

### 3. Database Setup

Make sure your database tables are created. You can:
- Run the SQL from `server/database.sql` in your Neon database console
- Or create an API endpoint to initialize the database

---

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection locally first:
# Create .env in server/ folder with your PG* variables
# Then test: node -e "require('./config/db').query('SELECT NOW()', (err, res) => console.log(err || res.rows))"
```

**Common Issues:**
- SSL mode must be `require` for Neon
- Verify all PG* environment variables are set correctly
- Check database allows connections from anywhere (Vercel IPs)

### CORS Errors

- Ensure `CLIENT_URL` in backend matches frontend URL exactly
- Include protocol (`https://`)
- No trailing slashes

### Socket.io Issues

- Both client and server must use HTTPS in production
- Verify `VITE_SOCKET_URL` points to your backend
- Check CORS settings allow your frontend origin

### API 404 Errors

- Verify `VITE_API_URL` ends with `/api`
- Check backend routes are prefixed with `/api`
- Ensure backend is deployed and accessible

---

## Quick Command Reference

```bash
# Generate JWT Secret
openssl rand -base64 32

# Test database connection locally
cd server
node -e "require('./config/db').query('SELECT 1', (err, res) => console.log(err || res.rows))"

# Deploy via Vercel CLI (optional)
vercel --prod
```

---

## Important Notes

- ✅ Never commit `.env` files to Git
- ✅ Keep database credentials secure
- ✅ Use strong JWT_SECRET (at least 32 characters)
- ✅ Both environments use HTTPS automatically
- ✅ Monitor Neon database connection limits
- ✅ Update environment variables in Vercel Dashboard, not in code

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test database connection separately
4. Check CORS and Socket.io configurations

