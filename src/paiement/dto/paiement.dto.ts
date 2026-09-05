import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class PaiementDto {
    @ApiProperty({
        example: 5000,
        description: 'Montant du paiement à effectuer',
        required: true,
    })
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Le montant doit être un nombre valide' })
    @IsPositive({ message: 'Le montant doit être supérieur à zéro' })
    @IsNotEmpty({ message: 'Le montant est requis' })
    montant: number;
}
