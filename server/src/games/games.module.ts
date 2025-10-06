import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Round } from '../models/round.model';
import { Score } from '../models/score.model';
import { User } from '../models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Round, Score, User])],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
