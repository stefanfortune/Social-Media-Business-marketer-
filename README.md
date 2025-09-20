# 📱 Social Media Managing Prototype

This Social Media Managing prototype is designed to **convert raw user text into AI-generated captions specifically for X (Twitter)**.  
It also supports uploading user media content and automates the posting process based on the user’s scheduled time.

---

## 🛠️ Prerequisites

Before starting, ensure you have the following installed on your system:

- Python **3.9+**
- **pip** (Python package manager)
- **Git**
- **VS Code** with the Python extension
- **SQLite** (default DB) or **PostgreSQL** (optional for production)

---

## 📂 Project Structure

backend/
│── app/
│ ├── main.py # Entry point
│ ├── content_router.py # Routes for content (create, post, schedule, drafts, history)
│ ├── authentication.py # User authentication
│ ├── database/
│ │ ├── db.py # DB connection & ORM setup
│ │ ├── models.py # SQLAlchemy models
│ │ └── helpers.py # DB helper functions
│ ├── schemas.py # Pydantic schemas
│ ├── scheduler.py # APScheduler job handling
│ ├── TwitterX.py # Twitter posting logic
│
│── requirements.txt # Python dependencies
│── README.md # Setup guide (this file)

yaml
Copy code

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/social-media-backend.git
cd social-media-backend
2️⃣ Create & Activate a Virtual Environment
On Windows (Command Prompt):

bash
Copy code
python -m venv venv
venv\Scripts\activate
On Mac/Linux (bash/zsh):

bash
Copy code
python3 -m venv venv
source venv/bin/activate
3️⃣ Install Dependencies
bash
Copy code
pip install -r requirements.txt
4️⃣ Create .env File
In the project root, create a .env file with the following variables:

ini
Copy code
DATABASE_URL=sqlite:///./app.db
JWT_SECRET=your-secret-key
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
5️⃣ Run Database Migrations (if using Alembic)
bash
Copy code
alembic upgrade head
Skip this step if you’re using plain SQLite without migrations.

6️⃣ Start the Server
bash
Copy code
uvicorn app.main:app --reload --port 8000
🖥️ Running Inside VS Code
Open VS Code → File > Open Folder → Select backend/.

Open a terminal inside VS Code (Ctrl + `).

Make sure your virtual environment is activated.

Run:

bash
Copy code
uvicorn app.main:app --reload --port 8000
Visit http://127.0.0.1:8000/docs to view the interactive API docs.

✅ Available Endpoints
POST /create-business-profile → Create/Update business profile

POST /create-content → Generate caption & save content

GET /generated-content → Fetch last generated content

POST /post-to-socials → Post to Twitter/WhatsApp

POST /schedule-post → Schedule future posts

GET /pending-content → View pending drafts (not yet posted)

GET /content-history → Fetch all past content

⚡ Notes
Twitter API requires a valid OAuth token for posting.

SQLite is set as the default DB, but PostgreSQL is recommended for production.
