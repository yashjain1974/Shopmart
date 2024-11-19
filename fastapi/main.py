import asyncio
import cv2
from fastapi import FastAPI, HTTPException, Query, Depends
import firebase_admin
from firebase_admin import credentials, firestore
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
import hashlib
import os
import base64
from datetime import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel, validator
from ultralytics import YOLO
from models.analytics import EngagementEvent, EngagementStats
from datetime import datetime, timedelta
from datetime import timezone
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict
import numpy as np
import uuid
import traceback

# Initialize Firebase Admin SDK with service account
cred = credentials.Certificate("shopreel-4b398-firebase-adminsdk-20lns-5e2c723abf.json")
firebase_admin.initialize_app(cred)
model = YOLO("yolov8s.pt") 

db = firestore.client()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
# Set up passlib CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # Generate a random salt
    salt = os.urandom(32)
    # Use PBKDF2 with SHA256
    iterations = 100000  # Number of iterations, adjust as needed
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations)
    # Combine salt and hash, and encode in base64 for storage
    combined = salt + password_hash
    encoded = base64.b64encode(combined).decode('utf-8')
    print(f"Hashed password length: {len(encoded)}")
    return encoded

def verify_password(stored_password: str, provided_password: str) -> bool:
    try:
        # Decode the stored password
        decoded = base64.b64decode(stored_password.encode('utf-8'))
        salt = decoded[:32]  # First 32 bytes are the salt
        stored_hash = decoded[32:]  # The rest is the hash
        
        # Hash the provided password with the same salt
        iterations = 100000  # Must be the same as in hash_password
        computed_hash = hashlib.pbkdf2_hmac('sha256', provided_password.encode('utf-8'), salt, iterations)
        
        print(f"Stored hash length: {len(stored_hash)}")
        print(f"Computed hash length: {len(computed_hash)}")
        print(f"Stored hash: {stored_hash.hex()}")
        print(f"Computed hash: {computed_hash.hex()}")
        
        # Compare the computed hash with the stored hash
        return computed_hash == stored_hash
    except Exception as e:
        print(f"Error in verify_password: {str(e)}")
        return False


class ContentUploadModel(BaseModel):
    videoUrl: str
    videoTitle: str
    category: str
    description: Optional[str] = ""
    tags: List[str]
    shareToFeed: bool
    productIds: List[str]
    creatorId: str

    @validator('videoUrl')
    def validate_video_url(cls, v):
        if not v:
            raise ValueError('Video URL is required')
        # Add additional URL validation if needed
        return v

    @validator('videoTitle')
    def validate_title(cls, v):
        v = v.strip()
        if not v:
            raise ValueError('Video title is required')
        if len(v) > 100:  # Adjust max length as needed
            raise ValueError('Video title is too long')
        return v

    @validator('productIds')
    def validate_product_ids(cls, v):
        if not v:
            raise ValueError('At least one product must be selected')
        return v
@app.post("/signup/")
async def signup(user: dict):
    try:
        # Extract user fields from the dictionary
        name = user.get("name")
        email = user.get("email")
        password = user.get("password")
        address = user.get("address")
        phone=user.get("phone_number")

        # Validate required fields
        missing_fields = []
        if not name:
            missing_fields.append("name")
        if not email:
            missing_fields.append("email")
        if not password:
            missing_fields.append("password")
        if not address:
            missing_fields.append("address")
        if not phone:
            missing_fields.append("phone_number")
        
        if missing_fields:
            raise HTTPException(status_code=400, detail=f"Missing required fields: {', '.join(missing_fields)}")

        # Check if the user already exists by email
        existing_user_ref = db.collection("user_details").where("email", "==", email).get()

        if existing_user_ref:
            raise HTTPException(status_code=400, detail="User with this email already exists.")

        # Hash the password

        hashed_password = hash_password(password)
        print(password)
        print(hashed_password)

        # Create a new user document and use Firestore's auto-generated ID
        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password,  # Store the hashed password
            "address": address,
            "phone":phone
        }

        # Add the user document to Firestore and get the auto-generated document ID
        doc_ref = db.collection("user_details").add(user_data)
        user_id = doc_ref[1].id  # This is the Firestore document ID

        # Optionally, you can return the user ID to the client if needed
        return {"status": "User signed up successfully.", "user_id": user_id}

    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        # Log the full error for debugging
        print(f"Signup error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.post("/login/")
async def login(details: dict):
    email = details.get("email")
    password = details.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Fields are empty")
    
    user_docs = db.collection("user_details").where("email", "==", email).get()
    
    if not user_docs:
        raise HTTPException(status_code=400, detail="Incorrect email")
    
    user = user_docs[0].to_dict()
    print(user)

    # Get the stored hashed password
    stored_hashed_password = user.get("password")
    print(password)
    print(stored_hashed_password)

    

    if verify_password(stored_hashed_password,password):
        user_data = {
            "name": user.get("name"),
            "email": user.get("email"),
            "address": user.get("address"),
            "phone": user.get("phone")
        }
        return {"status": "Login Successful","user":user_data}
    else:
        raise HTTPException(status_code=400, detail="Incorrect Password")

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

@app.get("/users/")
async def get_users():
    try:
        # Access the 'Users' collection
        users_ref = db.collection("user_details")
        docs = users_ref.stream()

        # Create a list of user dictionaries
        users = []
        for doc in docs:
            user_data = doc.to_dict()  # Convert document to dictionary
            users.append(user_data)

        return {"users": users}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/product/")
async def getProducts():
    try:
        products_ref = db.collection("Product")
        docs = products_ref.stream()

        prods = []
        for prod in docs:
            product_data = prod.to_dict()  # Convert document to dictionary
            product_data["product_id"] = prod.id
            prods.append(product_data)

        return {"users": prods}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/product/{product_id}")
async def get_product_by_id(product_id: str):
    try:
        product_ref = db.collection("Product").document(product_id)
        product_doc = product_ref.get()

        if not product_doc.exists:
            raise HTTPException(status_code=404, detail="Product not found")

        product_data = product_doc.to_dict()
        product_data["product_id"] = product_id  # Include the product ID in the response

        return {"product": product_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/product/type/{product_type}")
async def get_products_by_type(product_type: str):
    try:
        # Query Firestore for products with the given type
        products_ref = db.collection("Product").where("type", "==", product_type)
        docs = products_ref.stream()

        prods = []
        for prod in docs:
            product_data = prod.to_dict()  # Convert document to dictionary
            product_data["product_id"] = prod.id  # Include document ID as product_id
            prods.append(product_data)

        # If no products are found, return a message
        if not prods:
            raise HTTPException(status_code=404, detail="No products found for this type")

        return {"products": prods}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/reels/")
async def get_reels():
    try:
        reels_ref = db.collection("Reels")
        docs = reels_ref.stream()

        reels = []
        for reel in docs:
            reel_data = reel.to_dict()
            reel_data["id"] = reel.id  # Include the document ID as the reel ID
            reels.append(reel_data)

        return {"reels": reels}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def extract_tags(video_url, content_id):
    # Simulate the long-running task of extracting tags
    tags = await asyncio.to_thread(extract_objects_yolo_stream, video_url)
    
    # After extracting tags, update the content document in the database
    content_ref = db.collection("content").document(content_id)
    
    # Update content with extracted tags
    content_ref.update({
        "tags": tags,
        "updatedAt": datetime.now()  # update the timestamp
    })

# POST endpoint for uploading content
@app.post("/content/upload/")
async def upload_content(content: ContentUploadModel):
    try:
        # Validate creator exists
        creator_ref = db.collection("user_details").where("email", "==", content.creatorId).get()
        if not creator_ref:
            raise HTTPException(status_code=404, detail="Creator not found")

        

        # Prepare content data without tags
        content_data = {
            "videoUrl": content.videoUrl,
            "title": content.videoTitle,
            "category": content.category,
            "description": content.description,
            "sharedToFeed": content.shareToFeed,
            "productIds": content.productIds,
            "creatorId": content.creatorId,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now(),
            "status": "active",
            "likes": 0,
            "views": 0,
            "comments": 0,
            "tags": []  # Initially empty, will be filled after tag extraction
        }

        # Save content to the database first
        doc_ref = db.collection("content").add(content_data)
        content_id = doc_ref[1].id  # Get the document ID

        # Create an asyncio task to extract tags asynchronously
        asyncio.create_task(extract_tags(content.videoUrl, content_id))

        # Return immediately with success response
        return {
            "status": "success",
            "message": "Content uploaded and tag extraction started in the background.",
            "contentId": content_id
        }

    except HTTPException as he:
        raise he
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Error uploading content: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while uploading content"
        )

@app.get("/content/")
async def get_all_content():
    try:
        content_ref = db.collection("content")
        docs = content_ref.order_by("createdAt", direction=firestore.Query.DESCENDING).stream()

        content_list = []
        for doc in docs:
            content_data = doc.to_dict()
            content_data["id"] = doc.id

            # Get product details for each content
            products = []
            for product_id in content_data.get("productIds", []):
                product_ref = db.collection("Product").document(product_id)
                product_doc = product_ref.get()
                if product_doc.exists:
                    product_data = product_doc.to_dict()
                    product_data['id'] = product_id
                    products.append(product_data)
            
            content_data["products"] = products

            # Get creator details
            creator_id = content_data.get("creatorId")
            if creator_id:
                creator_ref = db.collection("user_details").document(creator_id)
                creator_doc = creator_ref.get()
                if creator_doc.exists:
                    creator_data = creator_doc.to_dict()
                    # Remove sensitive information
                    creator_data.pop("password", None)
                    content_data["creator"] = creator_data

            content_list.append(content_data)

        return {"content": content_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching content: {str(e)}")

@app.get("/content/{content_id}")
async def get_content_by_id(content_id: str):
    try:
        content_ref = db.collection("content").document(content_id)
        content_doc = content_ref.get()

        if not content_doc.exists:
            raise HTTPException(status_code=404, detail="Content not found")

        content_data = content_doc.to_dict()
        content_data["id"] = content_id

        # Get product details
        products = []
        for product_id in content_data.get("productIds", []):
            product_ref = db.collection("Product").document(product_id)
            product_doc = product_ref.get()
            if product_doc.exists:
                product_data = product_doc.to_dict()
                product_data['id'] = product_id
                products.append(product_data)
        
        content_data["products"] = products

        # Get creator details
        creator_id = content_data.get("creatorId")
        if creator_id:
            creator_ref = db.collection("user_details").document(creator_id)
            creator_doc = creator_ref.get()
            if creator_doc.exists:
                creator_data = creator_doc.to_dict()
                # Remove sensitive information
                creator_data.pop("password", None)
                content_data["creator"] = creator_data

        return {"content": content_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching content: {str(e)}")

@app.get("/content/user/{user_id}")
async def get_user_content(user_id: str):
    try:
        content_ref = db.collection("content").where("creatorId", "==", user_id)
        docs = content_ref.order_by("createdAt", direction=firestore.Query.DESCENDING).stream()

        content_list = []
        for doc in docs:
            content_data = doc.to_dict()
            content_data["id"] = doc.id

            # Get product details
            products = []
            for product_id in content_data.get("productIds", []):
                product_ref = db.collection("Product").document(product_id)
                product_doc = product_ref.get()
                if product_doc.exists:
                    product_data = product_doc.to_dict()
                    product_data['id'] = product_id
                    products.append(product_data)
            
            content_data["products"] = products
            content_list.append(content_data)

        return {"content": content_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user content: {str(e)}")

# Optional: Add endpoint for content interaction (likes, views)
@app.post("/content/{content_id}/interaction")
async def update_content_interaction(content_id: str, interaction_type: str):
    try:
        content_ref = db.collection("content").document(content_id)
        content_doc = content_ref.get()

        if not content_doc.exists:
            raise HTTPException(status_code=404, detail="Content not found")

        if interaction_type == "like":
            content_ref.update({"likes": firestore.Increment(1)})
        elif interaction_type == "view":
            content_ref.update({"views": firestore.Increment(1)})
        else:
            raise HTTPException(status_code=400, detail="Invalid interaction type")

        return {"status": f"Content {interaction_type} updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating content interaction: {str(e)}")
    






def extract_objects_yolo_stream(video_url, skip_frames=14):  

    cap = cv2.VideoCapture(video_url)

    
    if not cap.isOpened():
        raise Exception("Failed to open video stream")

    detected_objects = {}  
    frame_count = 0  
    
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        
        if frame_count % (skip_frames + 1) == 0: 
            
            results = model(frame)

            for result in results:
                boxes = result.boxes
                for box in boxes:
                    
                    label_id = int(box.cls[0])
                    label_name = model.names[label_id]

                    
                    confidence = box.conf[0]

                    
                    if label_name in detected_objects:
                       
                        detected_objects[label_name] = max(detected_objects[label_name], confidence)
                    else:
                        detected_objects[label_name] = confidence
                    
                    
        frame_count += 1  
        
    cap.release()

    sorted_detected_objects = sorted(detected_objects.items(), key=lambda item: item[1], reverse=True)

    ordered_classes = [item[0] for item in sorted_detected_objects]

    return ordered_classes

# Add these new models
class EngagementResponse(BaseModel):
    status: str
    event_id: str

class EngagementEvent(BaseModel):
    content_id: str
    action: str  # e.g., "video_start", "like", "comment", "share"
    timestamp: datetime
    user_id: str
    metadata: Optional[Dict] = {}

    class Config:
        json_schema_extra = {
            "example": {
                "content_id": "video123",
                "action": "video_start",
                "timestamp": "2024-03-21T10:00:00Z",
                "user_id": "anonymous",
                "metadata": {"videoTitle": "Example Video"}
            }
        }

class VideoRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.engagement_scores = defaultdict(float)
        self.video_tags = {}
        print("VideoRecommender initialized")  # Debug log

    def update_engagement(self, video_id: str, tags: List[str], engagement_type: str):
        # Weight different engagement types
        engagement_weights = {
            'watch_time': 1.0,
            'like': 2.0,
            'comment': 1.5,
            'share': 2.5
        }
        
        weight = engagement_weights.get(engagement_type, 1.0)
        self.engagement_scores[video_id] += weight
        self.video_tags[video_id] = tags

    async def get_videos_by_ids(video_ids: List[str]):
        videos = []
        for vid_id in video_ids:
            video_ref = db.collection("content").document(vid_id)
            doc = video_ref.get()
            if doc.exists:
                video_data = doc.to_dict()
                video_data["id"] = vid_id
                videos.append(video_data)
        return videos

    def get_recommendations(self, user_id: str, n_recommendations: int = 5):
        print(f"Getting recommendations for user {user_id}")  # Debug log
        print(f"Current video tags: {self.video_tags}")  # Debug log
        print(f"Current engagement scores: {self.engagement_scores}")  # Debug log
        
        # If no recommendations are available yet, return empty list
        if not self.video_tags:
            print("No video tags available")  # Debug log
            return []
            
        try:
            # Create tag corpus
            video_ids = list(self.video_tags.keys())
            tag_corpus = [' '.join(self.video_tags[vid]) for vid in video_ids]
            
            # Calculate tag similarity
            tfidf_matrix = self.vectorizer.fit_transform(tag_corpus)
            cosine_sim = cosine_similarity(tfidf_matrix)
            
            # Weight similarities by engagement scores
            weighted_scores = {}
            for i, vid1 in enumerate(video_ids):
                score = 0
                for j, vid2 in enumerate(video_ids):
                    if i != j:
                        score += cosine_sim[i][j] * self.engagement_scores[vid2]
                weighted_scores[vid1] = score
                
            # Sort by weighted scores
            recommended_videos = sorted(
                weighted_scores.items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:n_recommendations]

            print(recommended_videos)
            
            return [vid for vid, _ in recommended_videos]
        except Exception as e:
            print(f"Error in recommendation algorithm: {str(e)}")  # Debug log
            return []

# Initialize the recommender at startup
@app.on_event("startup")
async def startup_event():
    app.recommender = VideoRecommender()
    print("Recommender initialized during startup")  # Debug log

@app.post("/analytics/engagement/")
async def track_engagement(event: EngagementEvent):
    if event.action == 'meaningful_engagement':
        app.recommender.update_engagement(
            event.content_id,
            event.metadata.get('tags', []),
            event.metadata.get('engagementType')
        )
    return {"status": "success", "event_id": str(uuid.uuid4())}

@app.get("/analytics/content/{content_id}")
async def get_content_analytics(content_id: str, days: int = 7):
    try:
        # Calculate the date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Query analytics events for the content
        analytics_ref = db.collection("analytics")
        events = analytics_ref.where("content_id", "==", content_id)\
                            .where("timestamp", ">=", start_date)\
                            .where("timestamp", "<=", end_date)\
                            .stream()

        # Initialize counters
        stats = {
            "views": 0,
            "likes": 0,
            "comments": 0,
            "shares": 0,
            "total_watch_duration": 0,
            "completed_views": 0,
            "watch_durations": [],
            "engagement_by_hour": {},
            "completion_rates": []
        }

        # Process events
        for event in events:
            event_data = event.to_dict()
            action = event_data.get("action")
            metadata = event_data.get("metadata", {})
            
            # Track basic metrics
            if action == "video_start":
                stats["views"] += 1
            elif action == "like":
                stats["likes"] += 1
            elif action == "comment":
                stats["comments"] += 1
            elif action == "share":
                stats["shares"] += 1
            
            # Track watch duration
            if action == "video_end" and "watchDuration" in metadata:
                duration = metadata["watchDuration"]
                stats["watch_durations"].append(duration)
                stats["total_watch_duration"] += duration
                
                # Track completion
                if "completionRate" in metadata:
                    stats["completion_rates"].append(metadata["completionRate"])
                    if metadata["completionRate"] >= 95:  # Consider 95% or more as completed
                        stats["completed_views"] += 1

            # Track engagement by hour
            hour = event_data["timestamp"].hour
            stats["engagement_by_hour"][hour] = stats["engagement_by_hour"].get(hour, 0) + 1

        # Calculate averages and rates
        total_events = len(stats["watch_durations"])
        response = {
            "content_id": content_id,
            "period_days": days,
            "total_views": stats["views"],
            "total_likes": stats["likes"],
            "total_comments": stats["comments"],
            "total_shares": stats["shares"],
            "avg_watch_duration": stats["total_watch_duration"] / total_events if total_events > 0 else 0,
            "completion_rate": (stats["completed_views"] / stats["views"] * 100) if stats["views"] > 0 else 0,
            "engagement_rate": ((stats["likes"] + stats["comments"] + stats["shares"]) / stats["views"] * 100) if stats["views"] > 0 else 0,
            "engagement_by_hour": stats["engagement_by_hour"]
        }

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analytics: {str(e)}")

@app.get("/analytics/user/{user_id}")
async def get_user_analytics(user_id: str, days: int = 7):
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Get all content IDs for the user
        content_ref = db.collection("content").where("creatorId", "==", user_id).stream()
        content_ids = [doc.id for doc in content_ref]

        # Get analytics for all user content
        analytics_ref = db.collection("analytics")
        events = analytics_ref.where("content_id", "in", content_ids)\
                            .where("timestamp", ">=", start_date)\
                            .where("timestamp", "<=", end_date)\
                            .stream()

        # Initialize analytics summary
        summary = {
            "total_views": 0,
            "total_likes": 0,
            "total_comments": 0,
            "total_shares": 0,
            "content_performance": {},
            "engagement_by_day": {},
            "top_performing_content": []
        }

        # Process events
        for event in events:
            event_data = event.to_dict()
            content_id = event_data["content_id"]
            action = event_data["action"]
            day = event_data["timestamp"].date().isoformat()

            # Initialize content metrics if needed
            if content_id not in summary["content_performance"]:
                summary["content_performance"][content_id] = {
                    "views": 0, "likes": 0, "comments": 0, "shares": 0
                }

            # Update metrics
            if action == "video_start":
                summary["total_views"] += 1
                summary["content_performance"][content_id]["views"] += 1
            elif action == "like":
                summary["total_likes"] += 1
                summary["content_performance"][content_id]["likes"] += 1
            elif action == "comment":
                summary["total_comments"] += 1
                summary["content_performance"][content_id]["comments"] += 1
            elif action == "share":
                summary["total_shares"] += 1
                summary["content_performance"][content_id]["shares"] += 1

            # Track daily engagement
            if day not in summary["engagement_by_day"]:
                summary["engagement_by_day"][day] = {
                    "views": 0, "likes": 0, "comments": 0, "shares": 0
                }
            summary["engagement_by_day"][day][action] = summary["engagement_by_day"][day].get(action, 0) + 1

        # Calculate top performing content
        for content_id, metrics in summary["content_performance"].items():
            engagement_score = metrics["views"] + (metrics["likes"] * 2) + (metrics["comments"] * 3) + (metrics["shares"] * 4)
            summary["top_performing_content"].append({
                "content_id": content_id,
                "metrics": metrics,
                "engagement_score": engagement_score
            })

        # Sort top performing content
        summary["top_performing_content"].sort(key=lambda x: x["engagement_score"], reverse=True)
        summary["top_performing_content"] = summary["top_performing_content"][:5]  # Keep top 5

        return {
            "user_id": user_id,
            "period_days": days,
            "analytics_summary": summary
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user analytics: {str(e)}")

@app.get("/content/recommendations/")
async def get_recommendations(user_id: str = Query(default=..., description="User ID to get recommendations for")):
    try:
        print(f"Fetching recommendations for user: {user_id}")  # Debug log
        
        # Check if recommender is initialized
        if not hasattr(app, 'recommender'):
            print("Initializing recommender")
            app.recommender = VideoRecommender()
            
        # Get recommendations
        recommended_video_ids = app.recommender.get_recommendations(user_id)
        print(f"Got recommended video IDs: {recommended_video_ids}")  # Debug log
        
        # If no recommendations, return empty list
        if not recommended_video_ids:
            print("No recommendations found")
            return {"content": []}
            
        videos = []
        for vid_id in recommended_video_ids:
            try:
                video_ref = db.collection("content").document(vid_id)
                doc = video_ref.get()
                if doc.exists:
                    video_data = doc.to_dict()
                    video_data["id"] = vid_id
                    video_data["isRecommended"] = True
                    videos.append(video_data)
                    print(f"Added video: {vid_id}")  # Debug log
                else:
                    print(f"Video not found: {vid_id}")  # Debug log
            except Exception as e:
                print(f"Error fetching video {vid_id}: {str(e)}")  # Debug log
                continue
        
        print(f"Returning {len(videos)} recommendations")  # Debug log
        return {"content": videos}
        
    except Exception as e:
        error_details = traceback.format_exc()
        print(f"Error in get_recommendations: {str(e)}")
        print(f"Traceback: {error_details}")
        raise HTTPException(
            status_code=500, 
            detail={
                "error": str(e),
                "traceback": error_details
            }
        )