import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";


export class WalletDto {
    @IsNumber({ allowNaN: false, allowInfinity: false }) 
    @IsPositive({ message: "Le montant doit être supérieur à zéro" })
    @IsNotEmpty({ message: "Le montant est requis" })
    montant: number;
}
