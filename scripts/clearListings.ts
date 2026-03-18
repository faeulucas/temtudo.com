import "dotenv/config";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to clear listings");
}

async function main() {
  const connection = await mysql.createConnection(databaseUrl);

  try {
    await connection.beginTransaction();

    const statements = [
      "DELETE FROM favorites",
      "DELETE FROM boosters",
      "DELETE FROM listing_images",
      "DELETE FROM listings",
    ];

    for (const statement of statements) {
      await connection.execute(statement);
    }

    await connection.commit();
    console.log("Listings cleared successfully");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch(error => {
  console.error("Failed to clear listings", error);
  process.exit(1);
});
