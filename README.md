# SEO Analyzer

A Woorank-like SEO Analyzer built using custom logic and open-source libraries without using Woorank APIs or paid SEO APIs.

---

## Live Demo

### Frontend

https://digi-seo-analyzer.vercel.app/

### Backend

https://seo-analyzer-backend-rvh5.onrender.com/

---

## Features

- Website Crawling
- On-Page SEO Analysis
- Technical SEO Analysis
- Performance Analysis
- Content Analysis
- Lighthouse Integration
- SEO Score Generation
- Recommendation System
- Background Job Processing using BullMQ

---

## Technology Stack

### Frontend

- React.js
- Axios
- CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas

### Queue

- BullMQ
- Upstash Redis

### Website Crawling

- Puppeteer
- Cheerio

### Performance Analysis

- Lighthouse

### Deployment

- Render
- Vercel

---

## Installation

Clone the repository

```bash
git clone https://github.com/Akash01012/seo-analyzer.git
```

Install frontend

```bash
cd frontend
npm install
npm start
```

Install backend

```bash
cd backend
npm install
npm run dev
```

---

## Environment Variables

Backend

```
PORT=
MONGO_URI=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
NODE_ENV=
ENABLE_LIGHTHOUSE=
```

---

## APIs

### Start Analysis

```
POST /api/analyze
```

Request

```json
{
    "url":"https://example.com"
}
```

---

### Get Report

```
GET /api/results/:id
```

---

## Project Structure

```
seo-analyzer

backend
frontend
```

---

## Screenshots

### Home Page

(Add Screenshot)

### Loading Screen

(Add Screenshot)

### SEO Report

(Add Screenshot)

### On Page SEO

(Add Screenshot)

---

## Author

Akash Kumar
