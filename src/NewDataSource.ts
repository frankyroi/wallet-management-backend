import { DataSource } from 'typeorm';

export class NewDataSource extends DataSource {
  constructor() {
    super({
      type: 'postgres',
      host: 'dpg-cj528vc5kgrc73fr7fj0-a',
      port: 5432,
      username: 'baeldung',
      password: 'Rpwqx0sqZlQa3zpjFP2yYFC2i12xR9t4',
      database: 'wallet_management',
      entities: ["dist/entities/*.js"],
      migrations: ["dist/migrations/*.js"],
      logging: true,
    });
    
  }
}

export default new NewDataSource();