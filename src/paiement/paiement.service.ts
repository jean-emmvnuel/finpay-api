import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaiementService {
    constructor(private readonly prismaService: PrismaService) {}

    // methode pour effectuer un paiement
    async createPaiement(userId: string, amount: number) {
        if (amount <= 0) {
            throw new BadRequestException('Le montant doit être supérieur à zéro');
        }

        const fee = 0.02; // 2% fee
        const feeAmount = amount * fee;
        const totalAmount = amount + feeAmount;

        // 1. Vérifier l'existence du portefeuille
        const wallet = await this.prismaService.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new NotFoundException('Portefeuille introuvable pour cet utilisateur');
        }

        // 2. Si le solde est insuffisant : consigner la tentative échouée dans la table Transaction
        if (wallet.balance < totalAmount) {
            await this.prismaService.paiement.create({
                data: {
                    userId,
                    amount,
                    feeAmount,
                    totalAmount,
                    status: 'ECHOUE',
                    transaction: {
                        create: {
                            amount: totalAmount,
                            type: 'DEBIT',
                            currency: 'XOF',
                        },
                    },
                },
            });

            throw new BadRequestException('Solde insuffisant pour effectuer ce paiement');
        }

        // 3. Solde suffisant : transaction atomique (débit + paiement SUCCES + log Transaction)
        try {
            return await this.prismaService.$transaction(async (tx) => {
                // Re-vérifier le solde sous transaction pour éviter les doubles débits concurrents
                const currentWallet = await tx.wallet.findUnique({
                    where: { userId },
                });

                if (!currentWallet || currentWallet.balance < totalAmount) {
                    throw new BadRequestException('Solde insuffisant pour effectuer ce paiement');
                }

                // Débiter le portefeuille
                const updatedWallet = await tx.wallet.update({
                    where: { userId },
                    data: {
                        balance: {
                            decrement: totalAmount,
                        },
                    },
                });

                // Créer le paiement avec statut SUCCES et consigner la transaction
                const paiement = await tx.paiement.create({
                    data: {
                        userId,
                        amount,
                        feeAmount,
                        totalAmount,
                        status: 'SUCCES',
                        transaction: {
                            create: {
                                amount: totalAmount,
                                type: 'DEBIT',
                                currency: 'XOF',
                            },
                        },
                    },
                    include: {
                        transaction: true,
                    },
                });

                return {
                    status: 201,
                    message: 'Paiement effectué avec succès',
                    data: {
                        paiement,
                        newBalance: updatedWallet.balance,
                    },
                };
            });
        } catch (error) {
            if (error instanceof HttpException) {
                // Si l'erreur dans la transaction est un solde insuffisant concurrent, consigner la tentative échouée
                if (error instanceof BadRequestException) {
                    await this.prismaService.paiement.create({
                        data: {
                            userId,
                            amount,
                            feeAmount,
                            totalAmount,
                            status: 'ECHOUE',
                            transaction: {
                                create: {
                                    amount: totalAmount,
                                    type: 'DEBIT',
                                    currency: 'XOF',
                                },
                            },
                        },
                    }).catch(() => {});
                }
                throw error;
            }

            // En cas d'erreur imprévue, consigner également la tentative échouée pour traçabilité
            try {
                await this.prismaService.paiement.create({
                    data: {
                        userId,
                        amount,
                        feeAmount,
                        totalAmount,
                        status: 'ECHOUE',
                        transaction: {
                            create: {
                                amount: totalAmount,
                                type: 'DEBIT',
                                currency: 'XOF',
                            },
                        },
                    },
                });
            } catch (logError) {
                console.error("Échec de l'enregistrement de la transaction échouée:", logError);
            }

            console.error('Erreur lors du traitement du paiement:', error);
            throw new InternalServerErrorException('Erreur interne lors du traitement du paiement');
        }
    }

    // Récupérer tous les paiements de l'utilisateur
    async getUserPayments(userId: string) {
        return this.prismaService.paiement.findMany({
            where: { userId },
            select: {
                id: true,
                amount: true,
                feeAmount: true,
                totalAmount: true,
                currency: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // Récupérer un paiement précis par son id
    async getPaymentById(userId: string, paymentId: string) {
        const payment = await this.prismaService.paiement.findFirst({
            where: {
                id: paymentId,
                userId,
            },
            include: {
                transaction: true,
            },
        });

        if (!payment) {
            throw new NotFoundException('Paiement introuvable');
        }

        return payment;
    }
}

