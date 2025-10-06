import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './database/database.config';
import { DatabaseService } from './database/database.service';
import { User } from './models/user.model';
import { Round } from './models/round.model';
import { Score } from './models/score.model';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig),
    SequelizeModule.forFeature([User, Round, Score]),
    AuthModule,
    GamesModule,
  ],
  providers: [DatabaseService],
})
export class AppModule {}
