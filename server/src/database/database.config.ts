import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  uri: process.env.DB_URI || 'none',
  models: [__dirname + '/../models/*.model.ts'],
  autoLoadModels: true,
  synchronize: false, // We'll handle initialization manually
  logging: false,
  define: {
    timestamps: false,
  },
};
