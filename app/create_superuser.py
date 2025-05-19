from .users.auth import get_password_hash
from .users.dao import UsersDao


async def main():
    await UsersDao.add(
        email="root",
        username="root",
        hashed_password=get_password_hash("root"),
        is_active=True,
        admin_status="admin",
    )


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
