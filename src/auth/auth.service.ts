import {  Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { registerDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

    async register(data: registerDto) {
        const { fullname, number, code } = data;

        const fullnames = fullname.toUpperCase();

        const existingNumber = await this.prisma.user.findUnique({ where: { number } });
        if (existingNumber) {
            return {
                status : 409,
                message : "ce numero est deja associé à un compte"
            }
        }

        const hashedCode = await bcrypt.hash(code, 12);

        const user = await this.prisma.user.create({
            data: {
                fullname: fullnames,
                number,
                code: hashedCode
            },
            select: {
                id: true,
                fullname: true,
                number: true,
                role: true,
                createdAt: true,
            },
        });
        // creer un wallet pour l'utilisateur
        await this.prisma.wallet.create({
            data: {
                userId: user.id,
                balance: 0,
                currency: "XOF"
            }
        });
        const payload = {
            sub: user.id,
            number: user.number,
        };
        const token = await this.jwtService.signAsync(payload);
        return {
            status: 201,
            message: "Utilisateur créé avec succès",
            user: user,
            token: token,
        }
    }

    async login(data: loginDto) {
        const { number, code } = data;

        let user = await this.prisma.user.findUnique({
            where: { number },
            select: {
                id: true,
                fullname: true,
                number: true,
                code: true,
                role: true,
                createdAt: true,
            },
        });

        if (user) {
            const isCodeValid = await bcrypt.compare(code, user.code);
            if (!isCodeValid) {
                throw new UnauthorizedException("Identifiants incorrects");
            }
        }

        if (!user) {
            throw new NotFoundException("Utilisateur non trouvé");
        }

        const payload = {
            sub: user.id,
            number: user.number,
        };
        const token = await this.jwtService.signAsync(payload);
        return {
            status: 200,
            message: "utilisateur connecte avec succes",
            user: {
                id: user.id,
                fullname: user.fullname,
                number: user.number,
                role: user.role,
                createdAt: user.createdAt,
            },
            token: token 
        }
    }

    async validateUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullname: true,
                number: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new NotFoundException("utilisateur non trouve");
        }
        return {
            status: 200,
            message: "utilisateur trouve avec succes",
            user: user
        };
    }
}
