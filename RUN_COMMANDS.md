# Run Commands - Shortlist

## Installation

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

---

## Development Mode

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```

Expected output:
```
MongoDB Connected - Shortlist DB
Shortlist Server running on port 5000
```

### Terminal 2 - Frontend Dev Server
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v7.3.1  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

## Testing

### Open Browser
```
http://localhost:5173
```

### Test Theme Toggle
1. Click sun/moon icon in navbar
2. Verify colors change
3. Reload page - theme should persist

### Test Real-time Chat
1. Open 2 browser windows
2. Window 1: Login as candidate
3. Window 2: Login as recruiter
4. Recruiter: Go to Applicants → Click "Chat"
5. Send message from candidate
6. Verify message appears instantly in recruiter window
7. Send message from recruiter
8. Verify message appears instantly in candidate window

---

## Production Build

### Frontend Build
```bash
cd frontend
npm run build
```

Output: `frontend/dist/` folder with optimized build

### Backend Production
```bash
cd backend
npm start
```

---

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/shortlist
JWT_SECRET=your_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local) - Optional
```
REACT_APP_API_URL=http://localhost:5000
```

---

## Troubleshooting Commands

### Clear Node Modules & Reinstall
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Check Port Usage
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Mac/Linux
lsof -i :5000
lsof -i :5173
```

### Kill Process on Port
```bash
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
```

### Check MongoDB Connection
```bash
# Test connection string
mongosh "mongodb+srv://user:password@cluster.mongodb.net/shortlist"
```

---

## Useful npm Scripts

### Backend
```bash
npm run dev      # Development with nodemon
npm start        # Production
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Docker Commands (Optional)

### Build Docker Image
```bash
# Backend
cd backend
docker build -t shortlist-backend .

# Frontend
cd frontend
docker build -t shortlist-frontend .
```

### Run Docker Container
```bash
# Backend
docker run -p 5000:5000 shortlist-backend

# Frontend
docker run -p 5173:5173 shortlist-frontend
```

---

## Database Commands

### MongoDB - Create Indexes
```javascript
// Connect to MongoDB and run:
db.users.createIndex({ email: 1 }, { unique: true })
db.candidateprofiles.createIndex({ userId: 1 }, { unique: true })
db.jobs.createIndex({ recruiterId: 1 })
db.chats.createIndex({ participants: 1 })
db.messages.createIndex({ chatId: 1, createdAt: 1 })
```

### MongoDB - Backup
```bash
mongodump --uri="mongodb+srv://user:password@cluster.mongodb.net/shortlist" --out=./backup
```

### MongoDB - Restore
```bash
mongorestore --uri="mongodb+srv://user:password@cluster.mongodb.net/shortlist" ./backup
```

---

## Monitoring Commands

### Backend Logs
```bash
# Real-time logs
npm run dev

# Check specific port
netstat -ano | findstr :5000
```

### Frontend Logs
```bash
# Browser DevTools
F12 → Console tab

# Check network
F12 → Network tab → Filter by WS (WebSocket)
```

### Socket.io Debug
```javascript
// In browser console
localStorage.debug = 'socket.io-client:*'
```

---

## Performance Testing

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5173/

# Using wrk
wrk -t4 -c100 -d30s http://localhost:5173/
```

### Network Throttling (Browser)
1. Open DevTools (F12)
2. Go to Network tab
3. Click throttling dropdown
4. Select "Slow 3G" or "Fast 3G"
5. Test messaging performance

---

## Deployment Commands

### Heroku
```bash
# Login
heroku login

# Create app
heroku create shortlist-app

# Deploy backend
git push heroku main

# View logs
heroku logs --tail
```

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### AWS
```bash
# Install AWS CLI
pip install awscli

# Configure
aws configure

# Deploy
aws s3 sync frontend/dist s3://shortlist-bucket/
```

---

## Debugging

### Enable Debug Logging
```bash
# Backend
DEBUG=* npm run dev

# Frontend
localStorage.debug = '*'
```

### Check Socket.io Connection
```javascript
// In browser console
io.engine.on('open', () => console.log('Connected'))
io.on('connect', () => console.log('Socket connected'))
io.on('disconnect', () => console.log('Socket disconnected'))
```

### Monitor Messages
```javascript
// In browser console
socket.on('receive_message', (msg) => console.log('Message:', msg))
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm start` | Start production server |
| `npm install` | Install dependencies |
| `npm run build` | Build for production |
| `npm run lint` | Check code quality |
| `npm test` | Run tests |

---

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Socket Connection Failed
```bash
# Check backend is running
curl http://localhost:5000

# Check CORS configuration
# Verify FRONTEND_URL in backend .env
```

### Theme Not Persisting
```javascript
// In browser console
localStorage.clear()
location.reload()
```

---

## Support

For issues:
1. Check console for errors (F12)
2. Check backend logs
3. Verify environment variables
4. Verify MongoDB connection
5. Check network tab for failed requests

