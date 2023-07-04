- https://vercel.com/guides/nextjs-prisma-postgres
- https://www.prisma.io/blog/backend-prisma-typescript-orm-with-postgresql-data-modeling-tsjs1ps7kip1
- https://www.youtube.com/watch?v=tcm2WCgITv8


npx prisma migrate deploy
No pending migrations to apply.

## To update database table
Steps:
1. Execute DDL by `npm run prisma:prisma:db:push`
2. Generate prisma client by `npm run prisma:generate`

## To backup database
This project required a PostgreSQL database. Before executing dangerous actions like DDL or DML, it's better to back the existing data into a file and keep safe. 

Steps:
1. Install the latest Postgres.app
2. Dump the data by `npm run db:dump`

Recover
1. Unzip the tar with ZIP_PASSWORD in `.env.local`
2. Restore the database using `pg_restore`
