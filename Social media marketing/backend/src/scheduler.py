from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone
from .database.models import Post

scheduler = BackgroundScheduler()
scheduler.start()

def schedule_post_job(post_id, scheduled_time, db, post_to_x):
    def job():
       # Get the scheduled post
        post = db.query(Post).filter(Post.id == post_id).first()
        if post:
            post_to_x(post, db)
            print(f"Scheduled post executed at {datetime.now(timezone.utc)}")
            # Delete the scheduled post after execution
    scheduler.add_job(job, "date", run_date=scheduled_time)
