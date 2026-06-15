import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:postgres@localhost:54322/postgres';
const client = new Client({ connectionString });

async function fixSchema() {
  try {
    await client.connect();
    console.log('Connected to DB');

    // Add image_url to library_items if it doesn't exist
    await client.query(`ALTER TABLE library_items ADD COLUMN IF NOT EXISTS image_url TEXT;`);
    console.log('Added image_url to library_items');

    // Add image_url to hostels if it doesn't exist
    await client.query(`ALTER TABLE hostels ADD COLUMN IF NOT EXISTS image_url TEXT;`);
    console.log('Added image_url to hostels');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('Done');
  }
}

fixSchema();
