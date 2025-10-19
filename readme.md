# YouTube Companion Dashboard

A **mini-dashboard** built with the MERN stack to manage YouTube videos. Users can view video details, comment, reply, update video info, and maintain personal notes.

---

## Features

- Fetch details of uploaded YouTube videos using YouTube Data API v3.
- Comment on videos and reply to existing comments.
- Update video title and description.
- Delete your own comments.
- Personal notes section stored in MongoDB.
- Search or tag notes for quick retrieval.
- Event logs stored in MongoDB for auditing actions.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Atlas or local)  
- **Authentication:** Google OAuth 2.0  
- **YouTube API:** YouTube Data API v3  

---

## Getting Started (Local Development)

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- MongoDB URI (Atlas or local)
- Google Cloud Project with YouTube Data API enabled

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/youtube-companion-dashboard.git
cd youtube-companion-dashboard
