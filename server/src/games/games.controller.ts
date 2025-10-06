import { Controller, Get, Post, Param, UseGuards, Req, ForbiddenException, Body, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GamesService } from './games.service';

@Controller()
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Get('rounds')
  @UseGuards(AuthGuard('jwt'))
  async getAllRounds() {
    return this.gamesService.getAllRounds();
  }

  @Get('round/:uuid')
  @UseGuards(AuthGuard('jwt'))
  async getRound(@Param('uuid') uuid: string, @Req() req: any) {
    const round = await this.gamesService.getRoundByUuid(uuid);
    if (!round) {
      return { error: 'Round not found' };
    }

    const score = await this.gamesService.getOrCreateScoreByUserAndRound(req.user.sub, uuid);
    
    const response: any = {
      round: round,
      score: score,
    };

    // Если раунд завершен, добавляем дополнительную информацию
    if (this.gamesService.isRoundFinished(round)) {
      const summary = await this.gamesService.getRoundSummary(uuid);
      response.totalScore = summary.totalScore;
      response.bestPlayer = summary.bestPlayer;
      response.currentUserScore = score.score;
    }
    
    return response;
  }

  @Post('tap')
  @UseGuards(AuthGuard('jwt'))
  async tap(@Body() body: { uuid: string }, @Req() req: any) {
    if (!body.uuid) {
      throw new BadRequestException('UUID is required');
    }

    const result = await this.gamesService.processTap(req.user.sub, body.uuid);
    return { message: 'tap performed', score: result.score };
  }

  @Post('round')
  @UseGuards(AuthGuard('jwt'))
  async createRound(@Req() req: any) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin users can create rounds');
    }

    const round = await this.gamesService.createRound();
    return round;
  }
}
