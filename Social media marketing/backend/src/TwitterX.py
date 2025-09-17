import os
import tweepy
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
class TwitterX:
    def __init__(self):
        # Initialize Twitter API class
        self.client = self.initialize_twitter()
        auth = tweepy.OAuth1UserHandler(
            os.getenv("TWITTER_API_KEY"),
            os.getenv("TWITTER_API_SECRET"),
            os.getenv("TWITTER_ACCESS_TOKEN"),
            os.getenv("TWITTER_ACCESS_SECRET")
        )
        self.api = tweepy.API(auth)

    def initialize_twitter(self):
        # Initialize Twitter API
        return tweepy.Client(
            consumer_key=os.getenv("TWITTER_API_KEY"),
            consumer_secret=os.getenv("TWITTER_API_SECRET"),
            access_token=os.getenv("TWITTER_ACCESS_TOKEN"),
            access_token_secret=os.getenv("TWITTER_ACCESS_SECRET")
        )

    def post_tweet(self, tweet_text,media_path=None):
        try:
            # Upload media
            media_ids = []
            if media_path:
                upload = self.api.media_upload(media_path)
                media_ids.append(upload.media_id)
            
            if len(tweet_text) > 140:
                print("Tweet is too long. Truncating...")
                tweet_text = tweet_text[:137] + "..."
            # Post tweet
            response = self.client.create_tweet(text=tweet_text,
                                                media_ids=media_ids if media_ids else None
                                                )
            print(f"Tweet posted successfully at {datetime.now()}")
            print(f"Tweet ID: {response.data['id']}")
            return True
        except tweepy.TweepyException as e:
            print(f"Error posting tweet: {e}")
            return False