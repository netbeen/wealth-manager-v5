- https://vercel.com/guides/nextjs-prisma-postgres
- https://www.prisma.io/blog/backend-prisma-typescript-orm-with-postgresql-data-modeling-tsjs1ps7kip1
- https://www.youtube.com/watch?v=tcm2WCgITv8


npx prisma migrate deploy
No pending migrations to apply.

## For Database Backup
This project required a PostgreSQL database. Before executing dangerous actions like DDL or DML, it's better to back the existing data into a file and keep safe. 

Steps:
1. Install the latest Postgres.app
2. npm run db:dump

Recover
1. Unzip the tar with ZIP_PASSWORD in `.env.local`
