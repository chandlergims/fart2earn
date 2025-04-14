const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://test:iHvBWwnCGJPYdboP@cluster0.hxfim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('test'); // use your actual DB name
    const result = await db.collection('farts').deleteMany({
      name: { $regex: '@kryotrades', $options: 'i' }
    });
    console.log(`Deleted ${result.deletedCount} fart(s).`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();
