import { Controller, Request, Post, Body, UseGuards } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { PaiementDto } from './dto/paiement.dto';

@Controller('paiement')
export class PaiementController {
    constructor(private readonly paiementService: PaiementService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPaiement(@Request() req, @Body() data: PaiementDto) {
        return this.paiementService.createPaiement(req.user.sub, data.montant);
    }
}
