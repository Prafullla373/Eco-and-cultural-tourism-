# Debugging Report Generation Issues

## Quick Checklist

### 1. Check Backend is Running
Open a terminal and verify the backend server is running:
```bash
cd backend
npm run dev
```

You should see: `Server running on http://localhost:5000`

### 2. Check Frontend is Running
In another terminal:
```bash
cd frontend
npm run dev
```

You should see: `Local: http://localhost:5173/`

### 3. Open Browser Console
1. Press **F12** to open Developer Tools
2. Go to the **Console** tab
3. Clear it (🚫 icon)
4. Try to generate a report
5. Look for error messages

### 4. Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Try to generate a report
3. Look for the `/api/admin/reports/hotels` request
4. Click on it to see the response

## Common Errors and Solutions

### Error: "Network Error" or "ERR_CONNECTION_REFUSED"
**Cause:** Backend server is not running

**Solution:**
```bash
cd backend
npm run dev
```

### Error: "401 Unauthorized"
**Cause:** Not logged in or session expired

**Solution:**
- Log out and log back in to admin panel
- Check if cookies are enabled

### Error: "500 Internal Server Error"
**Cause:** Backend error, check backend terminal

**Solution:**
- Look at backend terminal for error messages
- Common issues:
  - MongoDB not running
  - Database connection failed
  - Missing dependencies

### Error: "CORS Error"
**Cause:** CORS configuration issue

**Solution:**
Check `backend/src/server.js` has:
```javascript
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
```

### Error: Blank file downloads
**Cause:** Wrong MIME type or empty data

**Solution:**
- Check browser console for errors
- Verify database has data to export

## Detailed Debugging Steps

### Step 1: Test Backend Endpoint Directly
Open http://localhost:5000/api/admin/reports/hotels?format=csv in your browser while logged in.

### Step 2: Check Browser Console
After adding detailed logging, you should see:
```
Starting export with params: {format: "csv", ...}
Request URL: http://localhost:5000/api/admin/reports/hotels?...
Response received: 200 {...}
```

If you see errors, the console will show detailed information.

### Step 3: Verify MongoDB is Running
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 4: Check Database Has Data
If using MongoDB Compass, connect to `mongodb://localhost:27017` and verify the `jharkhand-tourism` database has collections with data.

## Still Having Issues?

1. **Restart everything:**
   - Stop both servers (Ctrl+C)
   - Close all terminals
   - Restart backend first, then frontend

2. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear cached files
   - Refresh page

3. **Check the error in console:**
   - The updated code now shows detailed error information
   - Share the console error message for specific help

## Expected Console Output (Success)

```
Starting export with params: {format: "csv", startDate: "", endDate: "", status: "all"}
Request URL: http://localhost:5000/api/admin/reports/hotels?format=csv&startDate=&endDate=&status=all
Response received: 200 {content-type: "text/csv", ...}
```

## Expected Console Output (Failure)

```
Export error details: {
  message: "Network Error",
  response: undefined,
  status: undefined,
  error: Error: Network Error at ...
}
```

This tells you the backend is not reachable.
