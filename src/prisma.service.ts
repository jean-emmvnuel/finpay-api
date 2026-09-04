import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connexion à la base de données réussie (via adaptateur)');
    } catch (error) {
      console.error('❌ Échec de la connexion à la base de données:', error.message);
    }
  }
}

// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '../generated/prisma';

// @Injectable()
// export class PrismaService extends PrismaClient
//   implements OnModuleInit {

//   async onModuleInit() {
//     await this.$connect();
//     console.log('Prisma connecté (Supabase direct)');
//   }
// }
