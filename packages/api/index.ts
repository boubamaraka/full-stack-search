import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient, Db, ObjectId } from 'mongodb';

dotenv.config();

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  await import('./db/startAndSeedMemoryDB');
}

const PORT = process.env.PORT || 3001;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors());
app.use(express.json());

let db: Db;

const connectToDatabase = async () => {
  const mongoClient = new MongoClient(DATABASE_URL);
  console.log('Connecting to MongoDB...');
  await mongoClient.connect();
  console.log('Successfully connected to MongoDB!');
  db = mongoClient.db();
};

app.get('/hotels', async (req, res) => {
  try {
    console.log('Successfully connected to MongoDB!');
    const collection = db.collection('hotels');
    res.send(await collection.find().toArray());
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get('/hotels/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const collection = db.collection('hotels');
    const hotel = await collection.findOne({ _id: new ObjectId(id) });
    if (hotel) {
      res.send(hotel);
    } else {
      res.status(404).send({ message: 'Hotel not found' });
    }
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get('/cities/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const collection = db.collection('cities');
    const city = await collection.findOne({ name });
    if (city) {
      res.send(city);
    } else {
      res.status(404).send({ message: 'City not found' });
    }
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get('/countries/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const collection = db.collection('countries');
    const country = await collection.findOne({ country: name });
    if (country) {
      res.send(country);
    } else {
      res.status(404).send({ message: 'Country not found' });
    }
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`API Server Started at ${PORT}`);
});
