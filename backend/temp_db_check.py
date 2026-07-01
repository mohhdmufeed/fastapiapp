from sqlalchemy import create_engine, inspect
from database import SQLALCHEMY_DATABASE_URL

print('DB URL:', SQLALCHEMY_DATABASE_URL)
engine = create_engine(SQLALCHEMY_DATABASE_URL)
inspector = inspect(engine)
print('tables:', inspector.get_table_names())
if 'users' in inspector.get_table_names():
    cols = inspector.get_columns('users')
    print('users columns:', cols)
else:
    print('users table missing')
