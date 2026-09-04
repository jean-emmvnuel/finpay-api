import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, IsNotEmpty, IsString, MinLength } from "class-validator";


export class loginDto {
    @ApiProperty({
        example: '0504030201',
        description: 'Numero de l\'utilisateur',
        required: true,
    })
    @IsNotEmpty({ message: 'le numero de telephone est obligatoire' })
    @IsString({ message: 'Le numero de telephone doit etre une chaine de caracteres' })
    number: string;


    @ApiProperty({
        example: 1234,
        description: 'Code secret de l\'utilisateur',
        required: true,
        minLength: 4,
        maxLength: 4,
    })

    @IsNotEmpty({ message: 'le code secret est obligatoire' })
    @MinLength(4, { message: 'Le code secret doit contenir au moins 4 chiffres' })
    @MaxLength(4, { message: 'Le code secret doit contenir au exactement 4 chiffres'})
    code: string;
}