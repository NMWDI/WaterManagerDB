from faker import Faker
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import User, UserRole
from password_hashing import hash_password

fake = Faker()

def populate_users(n=10) -> None:
    """Seeds the Users table with fake data."""
    session: Session = SessionLocal()

    if session.query(User).count() > 0:
        print("Users table already populated. Skipping seeding.")
        session.close()
        return

    user_roles = session.query(UserRole).all()
    if not user_roles:
        print("No user roles found in the database!")
        session.close()
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
    session.close()
    print(f"Inserted {len(users)} users into the database.")

if __name__ == "__main__":
    init_db()
    populate_users(25)
