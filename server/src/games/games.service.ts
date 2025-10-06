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

  async getOrCreateScoreByUserAndRound(userId: string, roundUuid: string): Promise<Score> {
    // Сначала попробуем найти существующую запись
    let scoreRecord = await this.scoreModel.findOne({
      where: {
        user: userId,
        round: roundUuid,
      },
    });

    // Если записи нет, создаем новую
    if (!scoreRecord) {
      scoreRecord = await this.scoreModel.create({
        user: userId,
        round: roundUuid,
        score: 0,
        taps: 0,
      });
    }

    return scoreRecord;
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

  async processTap(userId: string, roundUuid: string): Promise<{ score: number }> {
    
      // Обновить запись в таблице score
      await this.scoreModel.increment('taps', {
        by: 1,
        where: {
          user: userId,
          round: roundUuid,
        },
      });

      const scoreRecord = await this.scoreModel.findOne({
        where: {
          user: userId,
          round: roundUuid,
        },
      });
      const score = Math.floor(scoreRecord.taps / 11) * 9 + scoreRecord.taps;

      return { score };
  }
}
