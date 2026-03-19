# CodeDev Network 🚀

A unified competitive programming platform that aggregates coding profiles, computes rankings, enables in-browser code execution, and supports problem-solving with a discussion forum.

---

## 🔥 Features

- 🔗 **Profile Aggregation**
  - LeetCode (GraphQL API)
  - Codeforces (Official REST API)
  - GeeksforGeeks & CodeChef (Web Scraping via Puppeteer)
  - On-demand sync via background worker queue

- 🏆 **Unified Ranking & Leaderboard**
  - Platform-wise rankings (LeetCode, Codeforces, GFG, CodeChef)
  - Overall global ranking
  - University leaderboard (Jamia Millia Islamia)
  - Weighted scoring based on platform importance

- 👨‍💻 **Code Execution**
  - Integrated in-browser code editor (CodeEditor component)
  - Judge0 CE for multi-language code execution
  - Custom memory and time limits

- 📝 **Problems**
  - Problem listing and filtering
  - Submission tracking and history
  - Per-problem difficulty and tags

- 💬 **Discuss**
  - Community discussion forum page

- 📖 **Learn**
  - Learning resources section

- 🏅 **Contests**
  - Contest page (in development)

- 🔐 **Authentication**
  - User registration & login
  - JWT-based auth middleware
  - Protected routes

- 🛠 **Admin Panel**
  - Separate React/Vite admin dashboard
  - Manage platform data and users

- 🌐 **Scalable Deployment**
  - Dockerized backend (with headless Chrome for Puppeteer)
  - Deployed on Render

---

## 🛠 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-Frontend-blue)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-purple)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-Runtime-green)
![Express](https://img.shields.io/badge/Express.js-Framework-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![GraphQL](https://img.shields.io/badge/GraphQL-LeetCode%20API-pink)
![Puppeteer](https://img.shields.io/badge/Puppeteer-Web%20Scraping-orange)
![Judge0](https://img.shields.io/badge/Judge0-Code%20Execution-lightgrey)
![Docker](https://img.shields.io/badge/Docker-Containerization-blue)

---

## 📁 Project Structure

```
CodeDev_Network/
├── frontend/              # React + Vite user-facing app
│   └── src/
│       ├── Pages/
│       │   ├── Auth/      # Login & Registration
│       │   ├── Contest/   # Contests page
│       │   ├── Discuss/   # Community discussions
│       │   ├── Home/      # Landing / Dashboard
│       │   ├── LeaderBoard/ # Rankings & leaderboard
│       │   ├── Learn/     # Learning resources
│       │   ├── Problems/  # Problem set & submissions
│       │   └── Profile/   # User profile page
│       ├── components/
│       │   ├── CodeEditor/ # In-browser code editor
│       │   ├── Footer/
│       │   ├── Navbar/
│       │   └── Spinner/
│       ├── api/           # Axios API layer
│       └── context/       # React context (auth, state)
│
├── backend/               # Node.js + Express API server
│   ├── routes/            # auth, leaderboard, problem, profile, submission, sync
│   ├── controllers/       # Route handler logic
│   ├── services/
│   │   ├── leaderboard/   # Ranking computation
│   │   └── platformSync/  # LeetCode, Codeforces, GFG, CodeChef scrapers
│   ├── models/            # Mongoose models (User, Problem, Submission, Contest, ExternalStats)
│   ├── workers/           # Background sync worker & queue
│   ├── middleware/        # Auth middleware
│   ├── config/            # DB & environment config
│   ├── utils/             # Helper utilities
│   └── Dockerfile
│
└── admin/                 # React + Vite admin dashboard
```

---

## 🧠 System Design Overview

- **Stateless REST API** with JWT authentication
- **Worker-based data ingestion** — profile sync runs in background via a queue (`sync.queue.js` / `sync.worker.js`)
- **Normalized scoring engine** aggregates multi-platform stats into weighted rankings
- **Concurrent request handling** with async/await throughout
- **Decoupled frontend & backend** — frontend communicates via a typed API layer (`src/api/`)

---

## 📊 Ranking Logic

- Weighted scores assigned per platform
- Aggregated scores generate:
  - Per-platform rankings
  - Global rankings
  - University-specific leaderboards (Jamia Millia Islamia)

---

## 🚀 Deployment

- Docker container (backend) with:
  - Node.js runtime
  - Headless Chrome (for Puppeteer scraping)
- Backend hosted on **Render**
- Frontend & Admin built with **Vite** (deployable on Vercel / Netlify / Render)

---

## ⚠️ Current Status

| Feature | Status |
|---|---|
| Profile aggregation (LeetCode, Codeforces, GFG, CodeChef) | ✅ Working |
| Unified leaderboard & ranking system | ✅ Working |
| Authentication (register/login/JWT) | ✅ Working |
| Problem listing & submission tracking | ✅ Working |
| In-browser code editor (Judge0) | ✅ Integrated (local) |
| Background sync worker | ✅ Working |
| Admin panel | ✅ Working |
| Contest system | 🔜 In Development |
| Judge0 cloud deployment | ⏳ Pending |
| Discussion forum | 🔜 In Development |

---

## 📌 Future Improvements

- Deploy Judge0 CE on cloud for production code execution
- Complete contest system with real-time scoring
- Expand discussion forum features
- Add analytics dashboard
- Improve ranking algorithms with more platforms
- Add notifications for contest reminders

---

## 👤 Author

**Mohd Mudassir Khan**

- GitHub: [Mudassar123khan](https://github.com/Mudassar123khan)
- LinkedIn: [mohdmudassirkhan](https://www.linkedin.com/in/mohdmudassirkhan/)

---

## ⭐ Show Your Support

If you find this project useful, give it a ⭐ on GitHub!