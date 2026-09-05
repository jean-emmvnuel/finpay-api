import { Controller, Get, Request, UseGuards, Body, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';


@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService : WalletService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getWalletByUserId(@Request() req) {
        return this.walletService.getWalletByUserId(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Post('send-quote')
    async sendQuote(@Body() data : { montant: number }) {
        return this.walletService.sendQuote(data.montant);
    }
}
