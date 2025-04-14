const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://test:iHvBWwnCGJPYdboP@cluster0.hxfim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

// Get the pattern from command line arguments
const pattern = process.argv[2];

if (!pattern) {
  console.error('Error: Please provide a pattern to delete.');
  console.error('Usage: node deleteSpamFarts.js "pattern to match"');
  process.exit(1);
}

async function run() {
  try {
    console.log(`Deleting farts with names matching: "${pattern}"`);
    await client.connect();
    const db = client.db('test'); // use your actual DB name
    const result = await db.collection('farts').deleteMany({
      name: { $regex: pattern, $options: 'i' }
    });
    console.log(`Deleted ${result.deletedCount} fart(s).`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();
