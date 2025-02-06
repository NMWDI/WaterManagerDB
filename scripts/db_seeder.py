from faker import Faker
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

import os

fake = Faker()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres@localhost:5432/appdb_local")
engine = create_engine(DATABASE_URL, echo=True)
Base = declarative_base()

class UserRole(Base):
    __tablename__ = 'UserRoles'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

class User(Base):
    __tablename__ = 'Users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    full_name = Column(String)
    email = Column(String)
    hashed_password = Column(String, nullable=False, default="password")
    disabled = Column(Boolean)
    user_role_id = Column(Integer, ForeignKey('UserRoles.id'), nullable=False)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def populate_users(n=10) -> None:
    if session.query(User).count() > 0:
        print("Users table already populated. Skipping seeding.")
        return

    user_roles = session.query(UserRole).all()
    if not user_roles:
        print("No user roles found in the database!")
        return

    users = []
    for role in user_roles:
        user = User(
            username=fake.user_name(),
            full_name=fake.name(),
            email=fake.unique.email(),
            hashed_password=hash_password("password"),
            disabled=fake.boolean(),
            user_role_id=role.id
        )
        users.append(user)

    for _ in range(n - len(user_roles)):
        user = User(
            username=fake.user_name(),
            full_name=fake.name(),
            email=fake.unique.email(),
            hashed_password=hash_password("password"),
            disabled=fake.boolean(),
            user_role_id=fake.random_element(user_roles).id
        )
        users.append(user)

    session.add_all(users)
    session.commit()
    print(f"Inserted {len(users)} users into the database.")

if __name__ == "__main__":
    populate_users(25)
