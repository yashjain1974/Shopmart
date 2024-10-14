from fastapi import FastAPI, HTTPException
import firebase_admin
from firebase_admin import credentials, firestore
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
import hashlib
import os
import base64

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

