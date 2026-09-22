const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

require("@next/env").loadEnvConfig(process.cwd());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const DATA_DIR = path.join(process.cwd(), "data");

async function migrate() {
  console.log("Starting data migration...\n");

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const name = path.basename(file, ".json");
    const filePath = path.join(DATA_DIR, file);

    try {
      const raw = fs.readFileSync(filePath, "utf8").trim();

      if (!raw) {
        console.log(`SKIP  ${file} (empty)`);
        continue;
      }

      const data = JSON.parse(raw);

      if (Array.isArray(data)) {
        await pool.query(
          `
          INSERT INTO app_collections (collection, data, updated_at)
          VALUES ($1, $2::jsonb, NOW())
          ON CONFLICT (collection)
          DO UPDATE SET
            data = EXCLUDED.data,
            updated_at = NOW()
          `,
          [name, JSON.stringify(data)]
        );

        console.log(
          `OK    ${file} → collection "${name}" (${data.length} items)`
        );
      } else {
        await pool.query(
          `
          INSERT INTO app_docs (name, data, updated_at)
          VALUES ($1, $2::jsonb, NOW())
          ON CONFLICT (name)
          DO UPDATE SET
            data = EXCLUDED.data,
            updated_at = NOW()
          `,
          [name, JSON.stringify(data)]
        );

        console.log(`OK    ${file} → document "${name}"`);
      }
    } catch (error) {
      console.error(`ERROR ${file}: ${error.message}`);
    }
  }

  console.log("\nMigration complete.");
  await pool.end();
}

migrate().catch(async (error) => {
  console.error("\nMigration failed:", error.message);
  await pool.end();
  process.exit(1);
});