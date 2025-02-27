from faker import Faker
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import Well, Unit, ObservedPropertyTypeLU, User, WellMeasurement, WellUseLU


fake = Faker()


def generate_uniform_timestamps(start_year=1950, end_year=2024, num_measurements=100):
    """
    Generate a list of `num_measurements` timestamps uniformly distributed between `start_year` and `end_year`.
    """

    start_date = datetime(start_year, 1, 1)
    end_date = datetime(end_year, 12, 31)

    timestamps = [
        start_date + timedelta(seconds=frac * (end_date - start_date).total_seconds())
        for frac in sorted([random.random() for _ in range(num_measurements)])
    ]

    return timestamps


def generate_next_value(previous_value, min_value=0, max_value=250, step=2):
    """
    Generate the next measurement value with a slight random fluctuation from the previous one.
    """

    change = random.uniform(-step, step)
    new_value = previous_value + change
    return round(max(min_value, min(max_value, new_value)), 2)


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
        num_measurements = random.randint(100, 250)
        timestamps = generate_uniform_timestamps(1950, 2024, num_measurements)

        previous_value = random.uniform(0, 250)  # Initial random starting point

        for timestamp in timestamps:
            value = generate_next_value(previous_value)
            previous_value = value  # Update for the next iteration

            measurement = WellMeasurement(
                well_id=well.id,
                timestamp=timestamp,
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
