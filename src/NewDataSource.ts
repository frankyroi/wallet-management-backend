import { DataSource } from 'typeorm';

export class NewDataSource extends DataSource {
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

export default new NewDataSource();