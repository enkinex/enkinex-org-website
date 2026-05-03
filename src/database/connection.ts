import { Surreal } from "surrealdb"

import type { DatabaseConfig } from "@/database/config"

export async function getDatabase(config: DatabaseConfig): Promise<Surreal> {
  const db = new Surreal()

  try {
    await db.connect(`${config.host}/rpc`, {
      authentication: {
        username: config.username,
        password: config.password,
      },
    })
    await db.use({ namespace: config.namespace, database: config.database })
    return db
  } catch (err) {
    console.error(
      "Failed to connect to SurrealDB:",
      err instanceof Error ? err.message : String(err),
    )
    await db.close()
    throw err
  }
}
