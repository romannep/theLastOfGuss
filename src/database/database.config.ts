import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'username',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'the_last_of_guss',
  models: [__dirname + '/../models/*.model.ts'],
  autoLoadModels: true,
  synchronize: false, // We'll handle initialization manually
  logging: false,
  define: {
    timestamps: false,
  },
};
