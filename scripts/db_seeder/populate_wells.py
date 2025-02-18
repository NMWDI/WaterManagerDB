from faker import Faker
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import Location, WellUseLU, WellStatus, WaterSource, Well


fake = Faker()


def populate_wells() -> None:
    """Seeds the Locations table with fake data."""
    session: Session = SessionLocal()

    locations = session.query(Location).all()
    if not locations:
        print("Locations table is empty. Please populate Locations first.")
        exit()

    well_use_types = session.query(WellUseLU).all()
    water_sources = session.query(WaterSource).all()
    well_statuses = session.query(WellStatus).all()

    if not well_use_types or not water_sources or not well_statuses:
        print("Ensure WellUseLU, WaterSource, and WellStatus tables are populated.")
        exit()

    wells = []
    well_id_counter = 1

    for well_use in well_use_types:
        for _ in range(15):
            for location in locations:
                well = Well(
                    name=fake.company(),
                    use_type_id=well_use.id,
                    location_id=location.id,
                    ra_number=fake.bothify(text="RA####"),
                    owners=fake.name(),
                    comments=fake.text(max_nb_chars=100),
                    osetag=fake.bothify(text="TAG####"),
                    water_source_id=fake.random_element(
                        elements=[ws.id for ws in water_sources]
                    ),
                    well_status_id=fake.random_element(
                        elements=[ws.id for ws in well_statuses]
                    ),
                    casing=fake.bothify(text="Casing####"),
                    total_depth=fake.pyfloat(
                        min_value=50, max_value=500, right_digits=2
                    ),
                    outside_recorder=fake.boolean(),
                )
                wells.append(well)
                well_id_counter += 1

    session.add_all(wells)
    session.commit()
    session.close()
    print(f"Inserted {len(wells)} wells into the database.")


if __name__ == "__main__":
    init_db()
    populate_wells()
