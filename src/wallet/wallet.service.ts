import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WalletService {
    constructor(private readonly prismaService: PrismaService) { }

    async getWalletByUserId(userId: string) {
        try {
            const wallet = await this.prismaService.wallet.findUnique({
                where: { userId },select: {
                    balance: true,
                    currency: true,
                }
            });
            if (!wallet) {
                throw new NotFoundException('Portefeuille non trouvé pour cet utilisateur');
            }
            return {
                status: 200,
                message: "Portefeuille récupéré avec succès",
                wallet: {
                    amount: wallet.balance,
                    currency: wallet.currency,
                } ,
            };
        } catch (error) {
            console.error(error);
            throw new NotFoundException('Erreur lors de la récupération du portefeuille');
        }
    }

    async sendQuote(amount: number) {
        if (amount <= 0) {
            throw new NotFoundException('Le montant doit être supérieur à zéro');
        }
        console.log("Montant envoyé pour le devis :", amount);
        const fee = amount * 0.02; // 2% fee
        const totalAmount = amount + fee;
        return {
            "amount" : amount,
            "fee" : fee,
            "totalAmount" : totalAmount,
        }
    }
}
