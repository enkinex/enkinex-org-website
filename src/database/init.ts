import fs from "node:fs"
import { type Surreal, jsonify } from "surrealdb"

import { DatabaseConfig } from "@/database/config"
import { getDatabase } from "@/database/connection"

const DATABASE_DIR = `${process.env.ENKINEX_WEBSITE_DATABASE_DIR}`
const API_DIR = `${DATABASE_DIR}/api`
const DATA_DIR = `${DATABASE_DIR}/data`
const TABLES_DIR = `${DATABASE_DIR}/table`

const REMOVE_TABLE_QUERIES: Record<string, string> = {
  "Remove all tables": "remove.surql",
}

const REMOVE_API_QUERIES: Record<string, string> = {
  "Remove all apis": "remove.surql",
}

const CREATE_TABLE_QUERIES: Record<string, string> = {
  "Create table account": "account.surql",
  "Create table website": "content/website.surql",
  "Create table navbar": "content/navbar.surql",
  "Create table page": "content/page.surql",
}

const CREATE_DATA_QUERIES: Record<string, string> = {
  "Create account data": "account.surql",
  "Create website data": "content/website.surql",
  "Create navbar data": "content/navbar.surql",
  "Create page data": "content/page.surql",
}

const CREATE_API_QUERIES: Record<string, string> = {
  "Create page api": "content/page.surql",
}

async function executeQueries(
  db: Surreal,
  dir: string,
  queries: Record<string, string>,
) {
  for (const [action, file] of Object.entries(queries)) {
    let filePath: string = `${dir}/${file}`
    const query: string = fs.readFileSync(filePath, "utf-8")
    const result = await db.query(query).collect()
    console.log(`${action}: ${jsonify(result)}`)
  }
}

async function initDatabase() {
  const db = await getDatabase(new DatabaseConfig())

  try {
    await executeQueries(db, TABLES_DIR, REMOVE_TABLE_QUERIES)
    await executeQueries(db, API_DIR, REMOVE_API_QUERIES)
    await executeQueries(db, TABLES_DIR, CREATE_TABLE_QUERIES)
    await executeQueries(db, DATA_DIR, CREATE_DATA_QUERIES)
    await executeQueries(db, API_DIR, CREATE_API_QUERIES)
  } catch (err: unknown) {
    console.error(
      "Failed to execute query:",
      err instanceof Error ? err.message : String(err),
    )
  } finally {
    await db.close()
  }
}

await initDatabase()
