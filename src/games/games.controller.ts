import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
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

    const score = await this.gamesService.getScoreByUserAndRound(req.user.sub, uuid);
    
    return {
      round: round,
      score: score,
    };
  }

  @Post('tap')
  @UseGuards(AuthGuard('jwt'))
  tap() {
    console.log('tap performed');
    return { message: 'tap performed' };
  }
}
