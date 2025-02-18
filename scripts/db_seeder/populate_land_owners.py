from faker import Faker
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import LandOwner


fake = Faker()


def populate_land_owners(n=25) -> None:
    """Seeds the LandOwners table with fake data."""
    session: Session = SessionLocal()

    if session.query(LandOwner).count() > 0:
        print("LandOwners table already populated. Skipping seeding.")
        session.close()
        return

    landowners = []

    for _ in range(1, n + 1):
        landowner = LandOwner(
            contact_name=fake.name(),
            organization=fake.company(),
            address=fake.street_address(),
            city=fake.city(),
            state=fake.state_abbr(),
            zip=fake.zipcode(),
            phone=fake.phone_number(),
            mobile=fake.phone_number(),
            email=fake.email(),
            note=fake.text(max_nb_chars=100),
        )
        landowners.append(landowner)

    session.add_all(landowners)
    session.commit()
    session.close()
    print(f"Inserted {len(landowners)} land owners into the database.")


if __name__ == "__main__":
    init_db()
    populate_land_owners(25)
