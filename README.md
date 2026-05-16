# MERN Notes App (Minimal Full Stack)

A simple full-stack Notes app using MongoDB · Express · React · Node.js

## Stack
| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | React 18                    |
| Backend  | Express 4 (Node.js)         |
| Database | MongoDB (local / offline)   |
| ODM      | Mongoose 7                  |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed locally

---

## 1 — Start MongoDB (offline / local)

```bash
# macOS / Linux
mongod --dbpath ~/data/db

# Windows (run as Admin)
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

> MongoDB runs on **port 27017** by default. No account needed for local use.

---

## 2 — Install dependencies

```bash
# From the project root
cd server && npm install
cd ../client && npm install
```

---

## 3 — Run the app

**Terminal 1 — Backend (port 5000):**
```bash
cd server
npm start
```

**Terminal 2 — Frontend (port 3000):**
```bash
cd client
npm start
```

Then open **http://localhost:3000** in your browser.

---

## API Endpoints

| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| GET    | /api/notes        | Get all notes     |
| POST   | /api/notes        | Create a note     |
| PUT    | /api/notes/:id    | Update a note     |
| DELETE | /api/notes/:id    | Delete a note     |
| GET    | /api/health       | Server health     |

### Example POST body
```json
{
  "title": "My first note",
  "content": "Hello MERN!"
}
```

---

## Project Structure

```
mern-app/
├── server/
│   ├── index.js        ← Express app + Mongoose models + routes
│   ├── .env            ← PORT & MONGO_URI config
│   └── package.json
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js      ← Full CRUD UI
│   │   └── index.js
│   └── package.json    ← "proxy": "http://localhost:5000"
└── README.md
```

---

## Environment Variables (server/.env)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mernapp
```
