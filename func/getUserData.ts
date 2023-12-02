import { MongoClient } from 'mongodb'
const uri = "mongodb+srv://Shadek:JJMLKOkrtYN1WLAK@cluster0.adjn4.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri).db('exotic-workshop').collection('workers');

export async function getUserData(USER_ID: string) 
{
    return mongoClient.findOne({ user_id: USER_ID }) 
}