import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB);

await client.connect();
export const dbo = client.db(process.env.DBNAME);
