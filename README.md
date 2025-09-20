This Social media managing prototype is designed to convert user raw text  to an ai generated caption specically for X(twitter).
It also uploads user media content and automates the whole process based on users scheduled time.

🛠️ Prerequisites

Before starting, ensure you have the following installed on your system:

Python 3.9+

pip (Python package manager)

Git

VS Code
 with the Python extension

SQLite
 (default DB) or PostgreSQL (optional for production)

📂 Project Structure
backend/
│── app/
│   ├── main.py                # Entry point
│   ├── content_router.py      # Routes for content (create, post, schedule, drafts, history)
│   ├── authentication.py      # User authentication
│   ├── database/
│   │   ├── db.py              # DB connection & ORM setup
│   │   ├── models.py          # SQLAlchemy models
│   │   |            # DB helper functions
│   ├── schemas.py             # Pydantic schemas
│   ├── scheduler.py           # APScheduler job handling
│   ├── TwitterX.py            # Twitter posting logic
│   ├   		         
│── requirements.txt           # Python dependencies
│── README.md                  # Setup guide (this file)

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/your-username/social-media-backend.git
cd social-media-backend

2️⃣ Create & Activate a Virtual Environment

On Windows (Command Prompt):

python -m venv venv
venv\Scripts\activate


On Mac/Linux (bash/zsh):

python3 -m venv venv
source venv/bin/activate

3️⃣ Install Dependencies

Ensure you’re inside the project folder and the virtual environment is active, then run:

pip install -r requirements.txt

4️⃣ Create .env File

In the project root, create a .env file for your environment variables:

DATABASE_URL=sqlite:///./app.db
JWT_SECRET=your-secret-key
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id

5️⃣ Run Database Migrations (if using Alembic)
alembic upgrade head


(Skip if using plain SQLite without migrations.)

6️⃣ Start the Server

Run FastAPI using uvicorn:

uvicorn app.main:app --reload --port 8000

🖥️ Running Inside VS Code

Open VS Code → File > Open Folder → Select backend/.

Open a terminal inside VS Code (`Ctrl + ``).

Make sure your virtual environment is activated.

Run:

uvicorn app.main:app --reload --port 8000


Open http://127.0.0.1:8000/docs
 to view the interactive API docs.

✅ Available Endpoints

POST /create-business-profile → Create/Update business profile

POST /Create-content → Generate caption & save content

GET /generated-content → Fetch last generated content

POST /post-to-socials → Post to Twitter/WhatsApp

POST /schedule-post → Schedule future posts

GET /pending-content → View pending drafts (not yet posted)

GET /content-history → Fetch all past content

⚡ Notes

Twitter API requires a valid OAuth token for posting.
