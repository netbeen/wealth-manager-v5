// eslint-disable-next-line @typescript-eslint/no-var-requires
const shell = require('shelljs')

const PG_DUMP_PATH =
  '/Applications/Postgres.app/Contents/Versions/latest/bin/pg_dump'
const {
  POSTGRES_DATABASE,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  ZIP_PASSWORD,
} = process.env

const dumpFileName = `wealth_manager_db_dump_${new Date()
  .toString()
  .replaceAll('(', '')
  .replaceAll(')', '')
  .replaceAll(' ', '_')}.sql`
const dumpFileFullPath = `${shell.pwd()}/data-backup/${dumpFileName}`
const zipFileFullPath = dumpFileFullPath.replace('.sql', '.zip')

const pgDumpCommand = `PGPASSWORD="${POSTGRES_PASSWORD}" ${PG_DUMP_PATH} --dbname=${POSTGRES_DATABASE} --file=${dumpFileFullPath} --username=${POSTGRES_USER} --host=${POSTGRES_HOST} --port=5432`
console.log(`Going to dump ...`)

shell.exec(pgDumpCommand)

console.log(`Dump Successfully, file at ${dumpFileFullPath}`)

shell.exec(`cat ${dumpFileFullPath}`)

shell.exec(
  `(cd data-backup && zip -P ${ZIP_PASSWORD} ${zipFileFullPath} ${dumpFileName})`
)

shell.rm(dumpFileFullPath)
