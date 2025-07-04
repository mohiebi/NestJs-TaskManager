// #region Imports - Dependencies needed for testing
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { testConfig } from '../config/test.config';
// #endregion

export class TestSetup {
    app: INestApplication;
    dataSource: DataSource;

    static async create(module: any) {
        const instance = new TestSetup();
        await instance.init(module);
        return instance;
    }

    // Sets up testing module with custom configuration
    private async init(module: any) {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [module],
        })
            // Replace normal config with test config
            .overrideProvider(ConfigService)
            .useValue({
                get: (key: string) => {
                    if (key.includes('database')) return testConfig.database;
                    if (key.includes('auth')) return testConfig.auth;
                    return null;
                },
            })
            .compile();

        // Create NestJS application
        this.app = moduleFixture.createNestApplication();
        // Get database connection
        this.dataSource = moduleFixture.get(DataSource);
        // Initialize app (starts servers, connects to db etc.)
        await this.app.init();
    }
    // #endregion

    // #region Database Operations - Managing test data
    // Cleans all tables between tests
    async cleanup() {
        // Get all entity metadata to find table names
        const entities = this.dataSource.entityMetadatas;
        // Create list of table names for SQL query
        const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ');
        // TRUNCATE removes all data
        // RESTART IDENTITY resets auto-increment counters
        // CASCADE handles foreign key relationships
        await this.dataSource.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    }
    // #endregion

    // #region Cleanup - Properly closing everything after tests
    // Properly close database and app after tests
    async teardown() {
        await this.dataSource.destroy(); // Close database connection
        await this.app.close(); // Shut down NestJS app
    }
    // #endregion
}
