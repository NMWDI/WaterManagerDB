from faker import Faker
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import Well, Unit, ObservedPropertyTypeLU, User, WellMeasurement

fake = Faker()


def generate_random_timestamp():
    """Generate a random timestamp evenly distributed between 1950 and 2024."""
    start_date = datetime(1950, 1, 1)
    end_date = datetime(2024, 12, 31)
    time_range = (end_date - start_date).total_seconds()
    random_offset = random.uniform(0, time_range)
    return start_date + timedelta(seconds=random_offset)


def populate_well_measurements():
    """Seeds the WellMeasurements table with synthetic data."""
    session: Session = SessionLocal()

    # Retrieve first 50 wells sorted by name (ascending)
    wells = session.query(Well).order_by(Well.name.asc()).limit(50).all()
    if not wells:
        print("No wells found in the database.")
        return

    # Retrieve the unit ID for "feet"
    unit = session.query(Unit).filter(Unit.name.ilike("feet")).first()
    if not unit:
        print("Unit 'feet' not found in the database.")
        return
    unit_id = unit.id

    # Retrieve the observed property ID for "Depth to water"
    observed_property = (
        session.query(ObservedPropertyTypeLU)
        .filter(ObservedPropertyTypeLU.name.ilike("Depth to water"))
        .first()
    )
    if not observed_property:
        print("ObservedPropertyTypeLU 'Depth to water' not found in the database.")
        return
    observed_property_id = observed_property.id

    # Retrieve all users
    users = session.query(User).all()
    if not users:
        print("No users found. Please populate the Users table first.")
        exit(1)  # Fail the script with exit code 1

    user_ids = [user.id for user in users]

    well_measurements = []

    for well in wells:
        num_measurements = random.randint(100, 150)
        for _ in range(num_measurements):
            measurement = WellMeasurement(
                well_id=well.id,
                timestamp=generate_random_timestamp(),
                value=fake.pyfloat(min_value=0, max_value=250, right_digits=2),
                observed_property_id=observed_property_id,
                submitting_user_id=random.choice(user_ids),
                unit_id=unit_id,
            )
            well_measurements.append(measurement)

    session.add_all(well_measurements)
    session.commit()
    session.close()

    print(f"Inserted {len(well_measurements)} well measurements into the database.")


if __name__ == "__main__":
    init_db()
    populate_well_measurements()
