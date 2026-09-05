import { Controller, Get, Request, UseGuards, Body, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { WalletDto } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService : WalletService) { }

    // Obtenir le portefeuille de l'utilisateur
    @UseGuards(JwtAuthGuard)
    @Get()
    async getWalletByUserId(@Request() req) {
        return this.walletService.getWalletByUserId(req.user.sub);
    }

    // Envoyer un devis de paiement
    @UseGuards(JwtAuthGuard)
    @Post('send-quote')
    async sendQuote(@Body() data : WalletDto) {
        return this.walletService.sendQuote(data.montant);
    }
}
