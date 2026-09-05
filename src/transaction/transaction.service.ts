import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TransactionService {
    constructor(private readonly prismaService: PrismaService) {}

    // Récupérer l'historique complet des transactions de l'utilisateur
    async getUserTransactions(userId: string) {
        return this.prismaService.transaction.findMany({
            where: {
                paiement: {
                    userId,
                },
            },
            select: {
                id: true,
                type: true,
                amount: true,
                currency: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
