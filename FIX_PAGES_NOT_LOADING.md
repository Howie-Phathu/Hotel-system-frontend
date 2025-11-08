# 🔧 Fix: Pages Not Loading

## Common Issues and Fixes

### 1. Check Browser Console
Open browser DevTools (F12) → Console tab and look for errors:
- **CORS errors** → Backend CORS not configured
- **Network errors** → API URL not set or backend down
- **Component errors** → Missing imports or syntax errors

### 2. Verify .env File Exists
Make sure `frontend/.env` file exists with:
```env
VITE_API_URL=https://hotelease-backend-usuo.onrender.com/api
```

**Check:**
```bash
cd frontend
cat .env  # or type .env on Windows
```

**If missing, create it:**
```powershell
cd frontend
"VITE_API_URL=https://hotelease-backend-usuo.onrender.com/api" | Out-File -FilePath .env -Encoding utf8
```

### 3. Restart Dev Server
After creating/updating `.env`:
```bash
# Stop server (Ctrl+C)
cd frontend
npm run dev
```

### 4. Check API Connection
Test if backend is accessible:
```
https://hotelease-backend-usuo.onrender.com/api/health
```

Should return:
```json
{
  "status": "success",
  "message": "HotelEase API is running"
}
```

### 5. Clear Browser Cache
- **Chrome/Edge:** Ctrl+Shift+Delete → Clear cache
- **Or:** Hard refresh: Ctrl+F5 or Ctrl+Shift+R

### 6. Check Network Tab
1. Open DevTools (F12) → Network tab
2. Try to navigate to a page
3. Look for failed requests (red)
4. Check what URL is being called

## What I Fixed

✅ **Added Error Boundaries** - Pages won't crash the entire app
✅ **Improved Error Handling** - Better error messages
✅ **API Response Handling** - Handles different response formats
✅ **Fallback Data** - Pages show sample data if API fails

## Debugging Steps

### Step 1: Check Console Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to a page
4. Look for red error messages

### Step 2: Check Network Requests
1. DevTools → Network tab
2. Navigate to a page
3. Look for API requests
4. Check if they're going to the right URL

### Step 3: Verify Environment Variables
1. Check `.env` file exists
2. Verify `VITE_API_URL` is set correctly
3. Restart dev server

### Step 4: Test Backend
1. Open: `https://hotelease-backend-usuo.onrender.com/api/health`
2. Should return success message
3. If not, backend might be down

## Common Error Messages

### "Network Error"
- **Cause:** API URL not set or backend down
- **Fix:** Check `.env` file and backend status

### "CORS Error"
- **Cause:** Backend not allowing frontend origin
- **Fix:** Update backend `CORS_ORIGIN` environment variable

### "Cannot read property of undefined"
- **Cause:** API response format different than expected
- **Fix:** Already handled with improved error handling

### "Page not found" or blank page
- **Cause:** Routing issue or component error
- **Fix:** Check browser console for specific errors

## Quick Fix Checklist

- [ ] `.env` file exists in `frontend` directory
- [ ] `VITE_API_URL` is set correctly
- [ ] Dev server restarted after creating `.env`
- [ ] Backend is running (test `/api/health`)
- [ ] Browser console checked for errors
- [ ] Network tab checked for failed requests
- [ ] Browser cache cleared

## After Fixes

1. **Restart dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Test pages:**
   - `/` - Landing page
   - `/hotels` - Hotels list
   - `/login` - Login page
   - `/register` - Register page

4. **Check console:**
   - Should see no errors
   - API calls should succeed

## Still Not Working?

1. **Share the error message** from browser console
2. **Check backend logs** in Render dashboard
3. **Verify API URL** is correct in `.env`
4. **Test backend directly** in browser

The error boundaries will now catch and display errors instead of crashing the entire app!

