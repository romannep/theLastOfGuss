import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './database/database.config';
import { DatabaseService } from './database/database.service';
import { User } from './models/user.model';
import { Round } from './models/round.model';
import { Score } from './models/score.model';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig),
    SequelizeModule.forFeature([User, Round, Score]),
  ],
  providers: [DatabaseService],
})
export class AppModule {}
