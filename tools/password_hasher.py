'''
Hashes a password so it can manually be entered into the database
'''

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Get password from command line
password = input("Enter password: ")

# Hash password and return
print(pwd_context.hash(password))