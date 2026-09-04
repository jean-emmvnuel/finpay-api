import { Controller, Get, Request, UseGuards } from '@nestjs/common';
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
}
