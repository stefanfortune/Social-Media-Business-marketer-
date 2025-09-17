from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os

load_dotenv()
router = APIRouter()

VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")  # use the same token you enter in the Meta dashboard


@router.get("/webhook")
async def verify_webhook(request: Request):
    """
    Step 1: Meta sends a GET request with hub.challenge to verify your webhook
    """
    hub_mode = request.query_params.get("hub.mode")
    hub_challenge = request.query_params.get("hub.challenge")
    hub_verify_token = request.query_params.get("hub.verify_token")

    if hub_mode == "subscribe" and hub_verify_token == VERIFY_TOKEN:
        return JSONResponse(content=int(hub_challenge))
    return JSONResponse(content={"error": "Verification failed"}, status_code=403)


@router.post("/webhook")
async def receive_webhook(request: Request):
    """
    Step 2: Meta sends POST requests here when events happen (e.g., comments, mentions)
    """
    data = await request.json()
    print("Received Webhook Event:", data)
    # You can log this, save to DB, or process further
    return JSONResponse(content={"status": "event_received"})
