from database import init_db
from populate_users import populate_users
from populate_land_owners import populate_land_owners
from populate_locations import populate_locations
from populate_wells import populate_wells

if __name__ == "__main__":
    init_db()
    populate_users(25)
    populate_land_owners(25)
    populate_locations()
    populate_wells()
