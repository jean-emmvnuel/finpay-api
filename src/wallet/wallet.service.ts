import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WalletService {
    constructor(private readonly prismaService: PrismaService) { }

    // methode pour recuperer le wallet d'un utilisateur par son id
    async getWalletByUserId(userId: string) {
        const wallet = await this.prismaService.wallet.findUnique({
            where: { userId },
            select: {
                id:true,
                userId: true,
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
    }

    // methode pour envoyer un devis
    async sendQuote(amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('Le montant doit être supérieur à zéro');
        }
        const fee = amount * 0.02; // 2% fee
        const totalAmount = amount + fee;
        return {
            status: 200,
            message: "Devis calculé avec succès",
            data:{
                amount: amount,
                fee: fee,
                totalAmount: totalAmount,
            }
        }
    }
}
