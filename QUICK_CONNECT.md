# ⚡ Quick Connect: Frontend to Backend

## Your Backend URL
```
https://hotelease-backend-usuo.onrender.com
```

## 🚀 Quick Setup (2 Steps)

### Step 1: Create .env file

Create a file named `.env` in the `frontend` folder with this content:

```env
VITE_API_URL=https://hotelease-backend-usuo.onrender.com/api
```

**Windows (PowerShell):**
```powershell
cd frontend
echo "VITE_API_URL=https://hotelease-backend-usuo.onrender.com/api" > .env
```

**Mac/Linux:**
```bash
cd frontend
echo "VITE_API_URL=https://hotelease-backend-usuo.onrender.com/api" > .env
```

### Step 2: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ Done!

Your frontend will now connect to the Render backend. Test it:
- Open: `http://localhost:3000`
- Check browser console → Network tab
- API calls should go to: `https://hotelease-backend-usuo.onrender.com/api/...`

## 🔍 Verify It's Working

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to load hotels or login
4. You should see requests to: `hotelease-backend-usuo.onrender.com`

## ⚠️ If You Get CORS Errors

Update your backend environment variables in Render:
- `CORS_ORIGIN` = `http://localhost:3000` (for local dev)
- `FRONTEND_URL` = `http://localhost:3000`

Then redeploy the backend.

