import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

await client.connect();

export const dbo = client.db(process.env.DATABASENAME);
