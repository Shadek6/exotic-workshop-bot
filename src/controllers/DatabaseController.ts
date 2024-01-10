import { MongoClient } from "mongodb"
export class DatabaseController 
{
    connect_string: string
    db: string
    client: MongoClient

    constructor(connect_string: string, db: string) {
        this.connect_string = connect_string
        this.db = db
        this.client = new MongoClient(connect_string)
    }

    public async fetchDatabaseData(collection: string, filter?: object) 
    {
        if(filter) return await this.client.db(this.db).collection(collection).findOne(filter)

        return await this.client.db(this.db).collection(collection).findOne()
    }

    public async addDatabaseData(collection: string, data: object) 
    {
        return await this.client.db(this.db).collection(collection).insertOne(data)
    }

    public async deleteDatabaseData(collection: string, filter: object) {
        return await this.client.db(this.db).collection(collection).deleteMany(filter);
    }
}