import asyncio
from database import engine, Base
import models

async def create_all():
    print("Connecting to database and creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()
    print("TABLES CREATED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(create_all())