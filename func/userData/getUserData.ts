import { MongoClient } from "mongodb";
import NodeCache from "node-cache";

const uri = process.env.MONGO_URI!;
const mongoClient = new MongoClient(uri).db("exotic-workshop").collection("workers");
const usersCache = new NodeCache();

export async function getUserData(USER_ID: string) {
    const cachedUser = usersCache.get(USER_ID);
    if (cachedUser) return cachedUser;

    const fetchedUser = mongoClient.findOne({ user_id: USER_ID });
    usersCache.set(USER_ID, fetchedUser, 3600);
    console.log("Fetched user from database");
    return fetchedUser;
}
