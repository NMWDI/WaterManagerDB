from faker import Faker
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import LandOwner, LocationTypeLU, Location


fake = Faker()


def populate_locations() -> None:
    """Seeds the Locations table with fake data."""
    session: Session = SessionLocal()

    if session.query(Location).count() > 0:
        print("Locations table already populated. Skipping seeding.")
        session.close()
        return

    types = session.query(LocationTypeLU).all()
    landowners = session.query(LandOwner).all()

    if not landowners:
        print("LandOwners table must be populated. Skipping seeding.")
        session.close()
        return

    locations = []
    for location_type in types:
        for owner in landowners:
            location = Location(
                name=fake.company(),
                type_id=location_type.id,
                trss=fake.bothify(text="??###"),
                latitude=fake.latitude(),
                longitude=fake.longitude(),
                township=fake.random_int(min=1, max=100),
                range=fake.random_int(min=1, max=100),
                section=fake.random_int(min=1, max=36),
                quarter=fake.random_int(min=1, max=4),
                half_quarter=fake.random_int(min=1, max=2),
                quarter_quarter=fake.random_int(min=1, max=4),
                geom=f"POINT({fake.longitude()} {fake.latitude()})",
                land_owner_id=owner.id,
            )
            locations.append(location)

    session.add_all(locations)
    session.commit()
    session.close()
    print(f"Inserted {len(locations)} locations into the database.")


if __name__ == "__main__":
    init_db()
    populate_locations()
