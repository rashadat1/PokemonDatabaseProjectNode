const axios = require("axios");
/* in the template method we define the skeleton of an algorithm in a base
class but use subclasses to override specific steps of the algorithm
The abstract class contains the template method that oultines algorithm
steps - some methods might be concrete others might be abstract
*/

class ETL {
    constructor(pool, tableName) {
        // database connection pool 
        this.pool = pool;
        // database table 
        this.tableName = tableName;
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
    async upsertData(dataBuilder) {
        const client = await this.pool.connect();
        try {
            // data is the actual data to be inserted or updated in the table
            // columns is the column names for the table
            // conflictConlumn - if there's a conflict an update is performed instead of insert (like primary key)
            const { data, columns, conflictColumn } = dataBuilder.build();
            // loop through columns and create placeholders based on index i
            // result is a string like $1, $2, $3, ... 
            const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
            // use map to iterate over each column name creating an instruction
            // like column_name = EXCLUDED.column_name
            // EXCLUDED is a keyword that refers to the values that would have been inserted if no conflict occurred
            const updates = columns.map((col) => `${col} = EXCLUDED.${col}`).join(', ');
            // this query inserts the data into the table checking for conflicts in the conflictColumn
            // such as a primary key already present in the table. If there is a conflict we
            // instead update this row
            const query = `
                INSERT INTO ${this.tableName} (${columns.join(', ')})
                VALUES (${placeholders})
                ON CONFLICT (${conflictColumn}) DO UPDATE
                SET ${updates};
                `;
            
            await client.query(query, Object.values(data));
            console.log(`Data successfully inserted/updated in ${this.tableName}`);
        } catch (error) {
            console.error(`Error while inserting/updating data in ${this.tableName}: `,error);
        } finally {
            client.release();
        }

    }
    // Abstract methods implemented by subclasses
    getEndpoint() {
        throw new Error(`getEndpoint() must be implemented in subclasses`);
    }

    transformData(rawData) {
        throw new Error(`transformData() must be implemented in subclasses`);
    }

    // the template method in the abstract class defines the structure of the algorithm
    // it uses other methods (some of which may be abstract) to complete the algorithm
    async processData() {
        const url = this.getEndpoint();
        const rawData = await this.fetchData(url);
        const transformedData = this.transformData(rawData);
        await this.upsertData(transformedData);
    }
}

module.exports = ETL;