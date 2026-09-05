import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    // Récupérer l'historique des transactions de l'utilisateur connecté
    @UseGuards(JwtAuthGuard)
    @Get()
    async getTransactions(@Request() req) {
        return this.transactionService.getUserTransactions(req.user.sub);
    }
}
