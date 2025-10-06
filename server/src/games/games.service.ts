import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Round } from '../models/round.model';
import { Score } from '../models/score.model';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'sequelize';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Round)
    private roundModel: typeof Round,
    @InjectModel(Score)
    private scoreModel: typeof Score,
  ) {}

  async getAllRounds(): Promise<Round[]> {
    return this.roundModel.findAll();
  }

  async getRoundByUuid(uuid: string): Promise<Round | null> {
    return this.roundModel.findByPk(uuid);
  }

  async getScoreByUserAndRound(userId: string, roundUuid: string): Promise<Score | null> {
    return this.scoreModel.findOne({
      where: {
        user: userId,
        round: roundUuid,
      },
    });
  }

  async createRound(): Promise<Round> {
    const now = new Date();
    const cooldownDuration = parseInt(process.env.COOLDOWN_DURATION || '60') * 1000; // Convert to milliseconds
    const roundDuration = parseInt(process.env.ROUND_DURATION || '300') * 1000; // Convert to milliseconds

    const startDatetime = new Date(now.getTime() + cooldownDuration);
    const endDatetime = new Date(now.getTime() + cooldownDuration + roundDuration);

    const round = await this.roundModel.create({
      uuid: uuidv4(),
      start_datetime: startDatetime,
      end_datetime: endDatetime,
      status: 'scheduled',
      score: 0,
    });

    return round;
  }

  async processTap(userId: string, roundUuid: string): Promise<void> {
    const transaction = await this.scoreModel.sequelize.transaction();
    
    try {
      // Найти или создать запись в таблице score
      let scoreRecord = await this.scoreModel.findOne({
        where: {
          user: userId,
          round: roundUuid,
        },
        transaction,
      });

      if (!scoreRecord) {
        scoreRecord = await this.scoreModel.create({
          user: userId,
          round: roundUuid,
          score: 0,
          taps: 0,
        }, { transaction });
      }

      // Вычислить новые значения
      const newTaps = scoreRecord.taps + 1;
      const newScore = Math.floor(newTaps / 11) * 9 + newTaps;
      const scoreIncrease = newScore - scoreRecord.score;

      // Обновить запись в таблице score
      await this.scoreModel.increment('taps', {
        by: 1,
        where: {
          user: userId,
          round: roundUuid,
        },
        transaction,
      });
      await this.scoreModel.increment('score', {
        by: scoreIncrease,
        where: {
          user: userId,
          round: roundUuid,
        },
        transaction,
      });

      // Обновить общий счет раунда
      await this.roundModel.increment('score', {
        by: scoreIncrease,
        where: {
          uuid: roundUuid,
        },
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
