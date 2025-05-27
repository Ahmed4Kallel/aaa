# Test imports to identify issues
try:
    print("Testing FastAPI imports...")
    from fastapi import FastAPI, HTTPException, Depends, status
    from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
    from fastapi.middleware.cors import CORSMiddleware
    print("✓ FastAPI imports successful")
    
    print("\nTesting Pydantic imports...")
    from pydantic import BaseModel, EmailStr, Field
    print("✓ Pydantic imports successful")
    
    print("\nTesting JWT imports...")
    import jwt
    from jwt.exceptions import PyJWTError, InvalidTokenError
    print("✓ JWT imports successful")
    
    print("\nTesting bcrypt imports...")
    import bcrypt
    print("✓ bcrypt imports successful")
    
    print("\nTesting typing imports...")
    from typing import List, Optional, Annotated
    from typing_extensions import TypedDict
    print("✓ Typing imports successful")
    
    print("\nAll imports successful!")
except Exception as e:
    print(f"\n❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
    import traceback
    traceback.print_exc()
