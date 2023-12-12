import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;
const mongoClient = new MongoClient(uri).db("exotic-workshop").collection("workers");

export async function getUserData(USER_ID: string) {
    return mongoClient.findOne({ user_id: USER_ID });
}
