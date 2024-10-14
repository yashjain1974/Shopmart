import hashlib
import os
import base64

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

# Test the functions
test_password = "mySecurePassword123"
hashed = hash_password(test_password)
print(f"Hashed password: {hashed}")

# Simulate storing and retrieving from database
stored_hashed_password = hashed

# Verify correct password
is_correct = verify_password(stored_hashed_password, test_password)
print(f"Correct password verified: {is_correct}")

# Verify incorrect password
is_incorrect = verify_password(stored_hashed_password, "wrongPassword")
print(f"Incorrect password verified: {is_incorrect}")