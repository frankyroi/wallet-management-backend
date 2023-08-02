"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewDataSource = void 0;
const typeorm_1 = require("typeorm");
class NewDataSource extends typeorm_1.DataSource {
    constructor() {
        super({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'baeldung',
            password: 'baeldung',
            database: 'wallet_management',
            entities: ["dist/entities/*.js"],
            migrations: ["dist/migrations/*.js"],
            logging: true,
        });
    }
}
exports.NewDataSource = NewDataSource;
exports.default = new NewDataSource();
