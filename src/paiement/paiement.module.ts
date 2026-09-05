import { Module } from '@nestjs/common';
import { PaiementController } from './paiement.controller';
import { PaiementService } from './paiement.service';
import { PrismaService } from '../prisma.service';


@Module({
  controllers: [PaiementController],
  providers: [PaiementService, PrismaService],
})
export class PaiementModule { }
