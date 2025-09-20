from openai import OpenAI, APIError, RateLimitError, APIConnectionError, Timeout
from dotenv import load_dotenv
import os
#import json

load_dotenv()

# Configure with your OpenRouter API key
api_key = os.getenv("OPENROUTER_API_KEY")
model = ''
client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key)


def curate_caption(business_name: str, business_description: str, raw_text: str, tone: str = "professional")-> str:
    prompt = f"""
    Create a {tone}-tone social media caption using this information for twitter that:   
    name of business: {business_name}
    description: {business_description}    
    Raw Content: {raw_text}   
    1. Incorporates key elements from this business profile
    2. create the {raw_text} into compelling marketing copy based on{business_description}
    3. put in 1-3 relevant hashtags using: {business_description}
    4. put in appropriate CTAs and engagement prompts
    5. Is optimized for maximum reach and brand consistency     
    Output ONLY the final caption text.
    """      
    try:
        
        response = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://marketing-agent-app.com",
                "X-Title": "Business Marketing Agent",
            },
            extra_body={},
            model=model,
            messages=[ { "role": "user", "content": prompt }
                      ]
               )      
        data =  response.choices[0].message.content.strip()
        #json_data= {"caption": data}
        #with open("caption.json", "w") as json_file:
        #json.dump(json_data, json_file, indent=4)    
        #json_data = json.loads(data)
        #print(data)
        return data
           
    except Exception as e:
        exception_matrix = (f"""oops.. there's been a bug in caption generation we'll just use your 
                            description for now:\n\n{raw_text},\n{business_description},\n{business_name}""")      
        print(exception_matrix)
    except RateLimitError:
        print("⚠️ Rate limit exceeded. Try again later.")
        return f"(Rate limit hit) {raw_text}\n\n{business_description}\n{business_name}"

    except Timeout:
        print("⚠️ The request to OpenRouter timed out.")
        return f"(Timeout fallback) {raw_text}\n\n{business_description}\n{business_name}"

    except APIConnectionError:
        print("⚠️ Network issue. Could not connect to OpenRouter.")
        return f"(Network error fallback) {raw_text}\n\n{business_description}\n{business_name}"

    except APIError as e:
        print(f"⚠️ API returned an error: {e}")
        return f"(API error fallback) {raw_text}\n\n{business_description}\n{business_name}"

    except Exception as e:
        print(f"⚠️ Unexpected error: {e}")
        return f"(Unexpected error fallback) {raw_text}\n\n{business_description}\n{business_name}"
    return exception_matrix
        


    