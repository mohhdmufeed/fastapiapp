import asyncio
from sqlalchemy import text
from database import engine

async def run_migration():
    print("Starting database schema migration...")
    async with engine.begin() as conn:
        print("Checking/altering 'jobs' table...")
        await conn.execute(text("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location VARCHAR;"))
        await conn.execute(text("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_type VARCHAR;"))
        await conn.execute(text("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level VARCHAR;"))
        await conn.execute(text("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS skills VARCHAR;"))
        print("Migration query executed successfully.")

if __name__ == "__main__":
    asyncio.run(run_migration())
