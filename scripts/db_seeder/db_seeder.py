from database import init_db
from populate_users import populate_users

if __name__ == "__main__":
    init_db()
    populate_users(25)
