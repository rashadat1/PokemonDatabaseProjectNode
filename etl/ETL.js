const axios = require("axios");
/* in the template method we define the skeleton of an algorithm in a base
class but use subclasses to override specific steps of the algorithm
The abstract class contains the template method that oultines algorithm
steps - some methods might be concrete others might be abstract
*/

class ETL {
    constructor(pool, tableNam, junctionTables = []) {
        // database connection pool 
        this.pool = pool;
        // database table 
        this.tableName = tableName;
        // extra junction tables as parameters
        this.junctionTables = junctionTables;
    }

    // retry logic utility function
    async retry(fn, retries = 5, delay = 1000) {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                if (attempt < retries - 1) {
                    console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }

            }
        }
    }

    // API request with retry
    async fetchData(url) {
        return await this.retry(() => axios.get(url),5, 2000);
    }

    // Upsert data into the database 
    async upsertData(data) {
        const client = await this.pool.connect();
        try {
            // insert or update Main Table
            const { mainData, junctionData } = data;
            await this.insertOrUpdateTable(client, this.tableName, mainData);
            // iterate through the junctionTables and then through each row we added
            for (const [tableName, rows] of Object.entries(junctionData)) {
                for (const row of rows) {
                    await this.insertOrUpdateTable(client, tableName, row);
                }
            }

            console.log(`Data successfully inserted/updated in ${this.tableName}`);
        } catch (error) {
            console.error(`Error while inserting/updating data in ${this.tableName}: `,error);
        } finally {
            client.release();
        }

    }

    async insertOrUpdateTable(client, tableName, dataBuilder) {
        
    }
    // Abstract methods implemented by subclasses
    getEndpoint(id) {
        throw new Error(`getEndpoint() must be implemented in subclasses`);
    }

    transformData(rawData) {
        throw new Error(`transformData() must be implemented in subclasses`);
    }

    // the template method in the abstract class defines the structure of the algorithm
    // it uses other methods (some of which may be abstract) to complete the algorithm
    async processData(url) {
        const rawData = await this.fetchData(url);
        const transformedData = await this.transformData(rawData);
        await this.upsertData(transformedData);
    }

    async processRange(start, end) {
        for (let i = start; i<= end; i++) {
            try {
                const url = this.getEndpoint(i);
                await this.processData(url)
            } catch (error) {
                console.error(`Error processing item ID ${i}:`, error)
            }
        }
    }
}

module.exports = ETL;