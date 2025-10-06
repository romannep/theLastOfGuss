import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Round } from '../models/round.model';
import { Score } from '../models/score.model';

@Module({
  imports: [SequelizeModule.forFeature([Round, Score])],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
