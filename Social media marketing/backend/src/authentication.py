from fastapi import HTTPException
from clerk_backend_api import Clerk, AuthenticateRequestOptions
import os
from dotenv import load_dotenv

load_dotenv()


clerk_sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

def authenticate_and_get_user_details(request):
    try:
        # Get the user ID from the token
        request_state = clerk_sdk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=["http://localhost:5173", "http://localhost:5174"],
                jwt_key=os.getenv("JWT_KEY")
            )
        )
        # Check if the user is signed in
        if not request_state.is_signed_in:
            raise HTTPException(status_code=401, detail="Invalid token")
        # Get the user ID
        user_id = request_state.payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="User ID not found in token")

        return {"user_id": user_id}
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))    
