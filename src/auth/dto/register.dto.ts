import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength, IsNumber } from "class-validator";


export class registerDto {


    @ApiProperty({
        example: 'Ahossi Jean Emmanuel',
        description: 'Nom complet de l\'utilisateur',
        required: true,
        minLength: 7,
        maxLength: 70,
    })
    @IsString({ message: 'Le nom complet doit etre une chaine de caracteres' })
    @IsNotEmpty({ message: 'Le nom complet est obligatoire' })
    fullname: string;


    @ApiProperty({
        example: '0504030201',
        description: 'Numero de l\'utilisateur',
        required: true,
        minLength: 10,
        maxLength: 10,
    })
    @IsNotEmpty({ message: 'le numero de telephone est obligatoire' })
    @MinLength(10, { message: 'Le numero de telephone doit contenir au moins 10 chiffres' })
    @MaxLength(10, { message: 'Le numero de telephone doit contenir au exactement 10 chiffres'})
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