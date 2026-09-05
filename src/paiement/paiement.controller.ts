import { Controller, Request, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { PaiementDto } from './dto/paiement.dto';

@Controller(['payments', 'paiement'])
export class PaiementController {
    constructor(private readonly paiementService: PaiementService) {}

    // Effectuer un paiement
    @UseGuards(JwtAuthGuard)
    @Post()
    async createPaiement(@Request() req, @Body() data: PaiementDto) {
        return this.paiementService.createPaiement(req.user.sub, data.montant);
    }

    // Récupérer la liste des paiements de l'utilisateur connecté
    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserPayments(@Request() req) {
        return this.paiementService.getUserPayments(req.user.sub);
    }

    // Récupérer un paiement spécifique par son id
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getPaymentById(@Request() req, @Param('id') id: string) {
        return this.paiementService.getPaymentById(req.user.sub, id);
    }
}
