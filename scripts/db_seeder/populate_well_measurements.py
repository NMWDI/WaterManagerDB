from faker import Faker
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import Well, Unit, ObservedPropertyTypeLU, User, WellMeasurement, WellUseLU


fake = Faker()


def generate_random_timestamp():
    """Generate a random timestamp evenly distributed between 1950 and 2024."""
    start_date = datetime(1950, 1, 1)
    end_date = datetime(2024, 12, 31)
    time_range = (end_date - start_date).total_seconds()
    random_offset = random.uniform(0, time_range)
    return start_date + timedelta(seconds=random_offset)


def generate_next_value(previous_value, min_value=0, max_value=250, step=5):
    """
    Generate the next measurement value with a slight random fluctuation from the previous one.
    """
    change = random.uniform(-step, step)
    new_value = previous_value + change
    return max(min_value, min(max_value, new_value))


def populate_well_measurements():
    """Seeds the WellMeasurements table with synthetic data."""
    session: Session = SessionLocal()

    # Retrieve the WellUseLU ID for "Monitoring"
    monitoring_use_type = (
        session.query(WellUseLU).filter(WellUseLU.use_type == "Monitoring").first()
    )
    if not monitoring_use_type:
        print("WellUseLU 'Monitoring' type not found in the database.")
        return

    # Retrieve first 50 wells where use_type is "Monitoring", sorted by name (ascending)
    wells = (
        session.query(Well)
        .filter(Well.use_type_id == monitoring_use_type.id)
        .order_by(Well.name.asc())
        .limit(50)
        .all()
    )
    if not wells:
        print("No wells with 'Monitoring' use type found in the database.")
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

    # Retrieve enabled users (disabled IS NULL or FALSE)
    users = (
        session.query(User)
        .filter((User.disabled.is_(False)) | (User.disabled.is_(None)))
        .all()
    )
    if not users:
        print("No enabled users found. Please populate the Users table first.")
        exit(1)

    user_ids = [user.id for user in users]

    well_measurements = []

    for well in wells:
        num_measurements = random.randint(100, 150)
        previous_value = random.uniform(0, 250)  # Initial random starting point

        for _ in range(num_measurements):
            value = generate_next_value(previous_value)
            previous_value = value  # Update for the next iteration

            measurement = WellMeasurement(
                well_id=well.id,
                timestamp=generate_random_timestamp(),
                value=value,
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
