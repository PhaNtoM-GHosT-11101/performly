import argparse
import asyncio

from app.db.session import AsyncSessionLocal
from app.services.billing import ensure_default_plans


async def seed_plans() -> None:
    async with AsyncSessionLocal() as db:
        await ensure_default_plans(db)
        await db.commit()


def main() -> None:
    parser = argparse.ArgumentParser(description="Performly backend management commands")
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("seed-plans", help="Create or verify default billing plans")

    args = parser.parse_args()
    if args.command == "seed-plans":
        asyncio.run(seed_plans())


if __name__ == "__main__":
    main()
