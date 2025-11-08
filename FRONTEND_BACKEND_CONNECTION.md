# 🔗 Connect Frontend to Render Backend

## ✅ Configuration Complete

The frontend is already configured to use the `VITE_API_URL` environment variable. You just need to set it!

## 🚀 Quick Setup

### Option 1: Create .env file (For Local Development)

Create a file named `.env` in the `frontend` directory with:

```env
VITE_API_URL=https://hotelease-backend-usuo.onrender.com/api
```

### Option 2: Set Environment Variable (For Production/Deployment)

If deploying the frontend (e.g., on Vercel, Netlify, or Render):

1. Go to your frontend deployment platform
2. Add environment variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://hotelease-backend-usuo.onrender.com/api`

## 📝 Current Configuration

The frontend API service (`frontend/src/services/api.ts`) is already set up to use:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

This means:
- ✅ If `VITE_API_URL` is set → Uses that URL
- ✅ If not set → Falls back to `http://localhost:5000/api` (for local dev)

## 🔧 Steps to Connect

### For Local Development:

1. **Create `.env` file in `frontend` directory:**
   ```bash
   cd frontend
   echo "VITE_API_URL=https://hotelease-backend-usuo.onrender.com/api" > .env
   ```

2. **Restart your dev server:**
   ```bash
   npm run dev
   ```

3. **Test the connection:**
   - Open browser console
   - Check network tab for API calls
   - They should go to: `https://hotelease-backend-usuo.onrender.com/api/...`

### For Production Deployment:

#### If deploying on Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://hotelease-backend-usuo.onrender.com/api`
3. Redeploy

#### If deploying on Netlify:
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://hotelease-backend-usuo.onrender.com/api`
3. Redeploy

#### If deploying on Render:
1. Go to Render Dashboard → Your Frontend Service → Environment
2. Add: `VITE_API_URL` = `https://hotelease-backend-usuo.onrender.com/api`
3. Redeploy

## ✅ Verify Connection

After setting the environment variable:

1. **Start your frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open browser console** and check:
   - Network requests should go to `https://hotelease-backend-usuo.onrender.com/api/...`
   - No CORS errors
   - API calls return data

3. **Test an API call:**
   - Visit: `http://localhost:3000` (or your frontend URL)
   - Try to load hotels or login
   - Check browser DevTools → Network tab

## 🔒 CORS Configuration

Make sure your backend CORS is configured to allow your frontend URL:

**Backend Environment Variables (Render):**
- `CORS_ORIGIN` = Your frontend URL (e.g., `http://localhost:3000` for local, or your deployed frontend URL)
- `FRONTEND_URL` = Same as CORS_ORIGIN

## 🐛 Troubleshooting

### Issue: CORS Errors
**Solution:** Update backend `CORS_ORIGIN` environment variable to include your frontend URL

### Issue: API calls still going to localhost
**Solution:** 
- Make sure `.env` file is in `frontend` directory (not root)
- Restart dev server after creating `.env`
- Check that variable name is exactly `VITE_API_URL` (Vite requires `VITE_` prefix)

### Issue: 404 Not Found
**Solution:** 
- Verify backend URL is correct: `https://hotelease-backend-usuo.onrender.com`
- Check backend is running and accessible
- Test backend directly: `https://hotelease-backend-usuo.onrender.com/api/health`

### Issue: Network Error
**Solution:**
- Check backend is deployed and running
- Verify backend URL is accessible in browser
- Check backend logs in Render dashboard

## 📋 Checklist

- [ ] Created `.env` file with `VITE_API_URL` (for local dev)
- [ ] Set `VITE_API_URL` in deployment platform (for production)
- [ ] Backend `CORS_ORIGIN` includes frontend URL
- [ ] Restarted dev server (if local)
- [ ] Tested API connection in browser console
- [ ] Verified network requests go to Render backend
- [ ] No CORS errors in console

## 🎉 Success!

Once connected, your frontend will:
- ✅ Make API calls to Render backend
- ✅ Handle authentication
- ✅ Load hotels, bookings, etc.
- ✅ Work in both development and production

