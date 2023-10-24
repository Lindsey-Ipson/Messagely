const { Client } = require('pg');
const { DB_URI } = require('./config');

const client = new Client(DB_URI);

async function insertFakeData() {
  try {
    await client.connect();
    console.log('Connected to the database.');

    // Insert fake user data
    await client.query(`
      INSERT INTO users (username, password, first_name, last_name, phone, join_at)
      VALUES
        ('user1', 'password1', 'John', 'Doe', '123-456-7890', NOW()),
        ('user2', 'password2', 'Jane', 'Smith', '987-654-3210', NOW());
    `);

    // Insert fake message data
    await client.query(`
      INSERT INTO messages (from_username, to_username, body, sent_at)
      VALUES
        ('user1', 'user2', 'Hello, Jane!', NOW()),
        ('user2', 'user1', 'Hi, John!', NOW());
    `);

    console.log('Fake data inserted successfully.');
  } catch (error) {
    console.error('Error inserting fake data:', error);
  } finally {
    await client.end(); // Close the database connection
  }
}

// Call the function to insert fake data
insertFakeData();
