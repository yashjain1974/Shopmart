from fastapi import FastAPI, HTTPException
import firebase_admin
from firebase_admin import credentials, firestore
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
import hashlib
import os
import base64
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, validator

# Initialize Firebase Admin SDK with service account
cred = credentials.Certificate("shopreel-4b398-firebase-adminsdk-20lns-5e2c723abf.json")
firebase_admin.initialize_app(cred)

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

@app.post("/content/upload/")
async def upload_content(content: ContentUploadModel):
    try:
        # Validate creator exists
        creator_ref = db.collection("user_details").where("email", "==", content.creatorId).get()
        if not creator_ref:
            raise HTTPException(status_code=404, detail="Creator not found")

        # Validate all product IDs exist
        for product_id in content.productIds:
            product_ref = db.collection("Product").document(product_id).get()
            if not product_ref.exists:
                raise HTTPException(
                    status_code=404, 
                    detail=f"Product with ID {product_id} not found"
                )

        # Prepare content data
        content_data = {
            "videoUrl": content.videoUrl,
            "title": content.videoTitle,
            "category": content.category,
            "description": content.description,
            "tags": content.tags,
            "sharedToFeed": content.shareToFeed,
            "productIds": content.productIds,
            "creatorId": content.creatorId,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now(),
            "status": "active",
            "likes": 0,
            "views": 0,
            "comments": 0
        }

        # Add to Firestore
        doc_ref = db.collection("content").add(content_data)
        content_id = doc_ref[1].id

        # Get product details for response
        products = []
        for product_id in content.productIds:
            product_ref = db.collection("Product").document(product_id).get()
            if product_ref.exists:
                product_data = product_ref.to_dict()
                product_data['id'] = product_id
                products.append(product_data)

        return {
            "status": "success",
            "message": "Content uploaded successfully",
            "contentId": content_id,
            "content": {
                **content_data,
                "id": content_id,
                "products": products
            }
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