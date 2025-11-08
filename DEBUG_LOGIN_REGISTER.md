# 🔍 Debug: Can't Sign In or Register

## Quick Checks

### 1. Check Browser Console
1. Open DevTools (F12)
2. Go to **Console** tab
3. Try to register/login
4. **Look for error messages** - they will tell you what's wrong

### 2. Check Network Tab
1. DevTools → **Network** tab
2. Try to register/login
3. Look for the API request:
   - Should be: `https://hotelease-backend-usuo.onrender.com/api/auth/register` or `/api/auth/login`
4. Check the status:
   - **200/201** = Success (but might have other issues)
   - **400** = Bad request (validation error)
   - **500** = Server error
   - **CORS error** = Backend CORS not configured
   - **Network error** = Backend not reachable

### 3. Common Issues

#### Issue 1: Network Error / CORS Error
**Symptoms:** "Network error" or "CORS policy" in console

**Fix:**
1. Check backend is running: `https://hotelease-backend-usuo.onrender.com/api/health`
2. Update backend CORS in Render:
   - Go to Render Dashboard → Backend Service → Environment
   - Add/Update: `CORS_ORIGIN` = `http://localhost:3000`
   - Redeploy backend

#### Issue 2: 500 Server Error
**Symptoms:** "Request failed with status code 500"

**Fix:**
1. Check backend logs in Render dashboard
2. Most likely: Missing `JWT_SECRET` environment variable
3. Add `JWT_SECRET` to backend environment variables
4. Redeploy backend

#### Issue 3: 400 Bad Request
**Symptoms:** "Validation error" or specific field errors

**Fix:**
- Check the error message - it will tell you what's wrong
- Make sure email is valid format
- Make sure password is at least 6 characters
- Check all required fields are filled

#### Issue 4: Backend Not Responding
**Symptoms:** Request timeout or connection refused

**Fix:**
1. Check backend status in Render dashboard
2. Test backend directly: `https://hotelease-backend-usuo.onrender.com/api/health`
3. If backend is down, restart it in Render

## Step-by-Step Debugging

### Step 1: Test Backend Connection
Open in browser:
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

### Step 2: Check .env File
Make sure `frontend/.env` exists and has:
```env
VITE_API_URL=https://hotelease-backend-usuo.onrender.com/api
```

### Step 3: Restart Frontend
After checking .env:
```bash
# Stop server (Ctrl+C)
cd frontend
npm run dev
```

### Step 4: Check Browser Console
1. Open DevTools (F12)
2. Try to register
3. Look for:
   - API Error logs (shows URL, status, error)
   - Network errors
   - CORS errors

### Step 5: Check Backend Logs
1. Go to Render Dashboard → Backend Service → Logs
2. Try to register/login
3. Look for errors in logs

## Common Error Messages

### "Network error: Cannot connect to..."
- Backend is down or not accessible
- Check backend status in Render
- Test backend URL directly

### "CORS policy: No 'Access-Control-Allow-Origin'"
- Backend CORS not allowing frontend
- Update `CORS_ORIGIN` in backend environment variables

### "Request failed with status code 500"
- Server error
- Check backend logs
- Usually missing `JWT_SECRET`

### "User already exists"
- Email is already registered
- Try different email or login instead

### "Invalid credentials"
- Wrong email/password
- Or user doesn't exist

## Quick Fixes

### Fix 1: Verify Backend is Running
```bash
# Test in browser or PowerShell:
https://hotelease-backend-usuo.onrender.com/api/health
```

### Fix 2: Check Environment Variables
**Backend (Render):**
- `DATABASE_URL` ✅ (should be set)
- `JWT_SECRET` ⚠️ (might be missing - this causes 500 errors)
- `CORS_ORIGIN` = `http://localhost:3000`
- `FRONTEND_URL` = `http://localhost:3000`

**Frontend (.env):**
- `VITE_API_URL` = `https://hotelease-backend-usuo.onrender.com/api`

### Fix 3: Clear Browser Cache
1. Open DevTools (F12)
2. Application tab → Clear Storage
3. Clear site data
4. Refresh page

## Test Registration Manually

### Using PowerShell:
```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
    first_name = "Test"
    last_name = "User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://hotelease-backend-usuo.onrender.com/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

### Using Browser:
Open DevTools → Console tab, then:
```javascript
fetch('https://hotelease-backend-usuo.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123',
    first_name: 'Test',
    last_name: 'User'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## What to Share for Help

If still not working, share:
1. **Browser console errors** (screenshot or copy text)
2. **Network tab** - the failed request details
3. **Backend logs** from Render dashboard
4. **What happens** when you try to register/login

