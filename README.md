# 💸 FinPay API

> **API REST de paiement mobile** — Backend NestJS avec authentification JWT, gestion de portefeuille et sécurité renforcée.

---

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Stack technique](#-stack-technique)
- [Architecture du projet](#-architecture-du-projet)
- [Schéma de base de données](#-schéma-de-base-de-données)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Lancer l'application](#-lancer-lapplication)
- [API Endpoints](#-api-endpoints)
- [Sécurité](#-sécurité)
- [Documentation Swagger](#-documentation-swagger)
- [Docker](#-docker)
- [Scripts disponibles](#-scripts-disponibles)
- [Auteur](#-auteur)

---

## 🌍 Aperçu

**FinPay API** est une API REST développée avec [NestJS](https://nestjs.com/) pour gérer des comptes utilisateurs et des portefeuilles financiers dans un contexte de **paiement mobile** (inspiré de la Côte d'Ivoire — numéros à 10 chiffres).

Chaque utilisateur inscrit dispose automatiquement d'un **portefeuille (Wallet)** en **XOF (Franc CFA)** créé à l'inscription.

---

## 🛠 Stack technique

| Technologie         | Rôle                                      | Version |
|---------------------|-------------------------------------------|---------|
| **NestJS**          | Framework principal                       | ^11     |
| **TypeScript**      | Typage statique                           | ^5.7    |
| **Prisma ORM**      | Accès base de données                     | ^7.2    |
| **PostgreSQL**      | Base de données relationnelle             | —       |
| **Supabase**        | Hébergement PostgreSQL (cloud)            | —       |
| **JWT (Passport)**  | Authentification par token                | —       |
| **bcrypt**          | Hachage du code secret                    | ^6      |
| **Helmet**          | Sécurité des en-têtes HTTP               | ^8      |
| **Throttler**       | Rate limiting (anti-brute force)          | ^6      |
| **Winston**         | Logging structuré                         | ^3      |
| **Swagger**         | Documentation API auto-générée            | ^11     |
| **Docker**          | Conteneurisation                          | —       |

---

## 🗂 Architecture du projet

```
finpay-api/
├── prisma/
│   ├── schema.prisma          # Modèles de données (User, Wallet)
│   └── migrations/            # Historique des migrations
├── src/
│   ├── auth/                  # Module d'authentification
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── auth.controller.ts # Routes : /auth/*
│   │   ├── auth.service.ts    # Logique métier (register, login, me)
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts    # Stratégie JWT Passport
│   │   └── jwt.auth.guard.ts  # Guard JWT
│   ├── wallet/                # Module portefeuille
│   │   ├── wallet.controller.ts
│   │   ├── wallet.service.ts
│   │   └── wallet.module.ts
│   ├── app.module.ts          # Module racine (throttler, logger, modules)
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── prisma.service.ts      # Service Prisma partagé
│   └── main.ts                # Bootstrap (helmet, CORS, Swagger, pipes)
├── .env                       # Variables d'environnement
├── Docker-compose.yml
├── Dockerfile
└── package.json
```

---

## 🗃 Schéma de base de données

```prisma
model User {
  id        String    @id @default(uuid())
  number    String    @unique   // Numéro mobile (10 chiffres, ex: Côte d'Ivoire)
  fullname  String
  role      UserRole  @default(USER)
  createdAt DateTime  @default(now())
  code      String                    // Code secret haché (bcrypt)
  wallet    Wallet?                   // Relation one-to-one
}

enum UserRole {
  USER
  ADMIN
  SYSTEM
}

model Wallet {
  id        String   @id @default(uuid())
  userId    String   @unique           // Clé étrangère (one-to-one)
  balance   Float    @default(0)
  currency  String   @default("XOF")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}
```

### Relations
- **User → Wallet** : Relation **one-to-one** — chaque utilisateur a exactement un portefeuille
- Le wallet est **créé automatiquement** à l'inscription avec un solde initial de `0 XOF`

---

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 9
- Une base de données PostgreSQL (ou un projet [Supabase](https://supabase.com/))

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/jean-emmvnuel/finpay-api.git
cd finpay-api

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Remplir les valeurs dans .env

# 4. Appliquer les migrations Prisma
npx prisma migrate deploy

# 5. Générer le client Prisma
npx prisma generate
```

---

## ⚙️ Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# URL de connexion PostgreSQL (via PgBouncer pour les requêtes)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?pgbouncer=true"

# URL directe (pour les migrations Prisma)
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

# Clé secrète pour signer les tokens JWT
JWT_SECRET="votre_secret_jwt_ici"

# Port d'écoute du serveur (optionnel, défaut : 3001)
PORT=3001

# URL du frontend autorisé pour CORS (optionnel, défaut : http://localhost:3000)
FRONTEND_URL="http://localhost:3000"
```

> ⚠️ **Ne jamais committer le fichier `.env` en production.** Assurez-vous qu'il est dans `.gitignore`.

---

## ▶️ Lancer l'application

```bash
# Développement (avec hot-reload via nodemon)
npm run start:dev

# Production
npm run build
npm run start:prod
```

Le serveur démarre sur le port défini dans `PORT` (défaut : **3001**).

---

## 📡 API Endpoints

> **Base URL** : `http://localhost:3001`

### 🔐 Authentification — `/auth`

#### `POST /auth/register` — Inscription

Crée un nouvel utilisateur et son portefeuille. Retourne un token JWT.

**Corps de la requête :**
```json
{
  "fullname": "Ahossi Jean Emmanuel",
  "number": "0504030201",
  "code": "1234"
}
```

| Champ      | Type   | Obligatoire | Contraintes                    |
|------------|--------|-------------|--------------------------------|
| `fullname` | string | ✅           | Entre 7 et 70 caractères       |
| `number`   | string | ✅           | Exactement 10 chiffres         |
| `code`     | string | ✅           | Exactement 4 caractères        |

**Réponse — `201 Created` :**
```json
{
  "status": 201,
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "uuid",
    "fullname": "AHOSSI JEAN EMMANUEL",
    "number": "0504030201",
    "role": "USER",
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> 💡 Le `fullname` est automatiquement converti en **MAJUSCULES**.
> 💡 Le `code` est **haché avec bcrypt** (salt = 12) avant stockage.

---

#### `POST /auth/login` — Connexion

Authentifie un utilisateur existant. Retourne un token JWT.

**Corps de la requête :**
```json
{
  "number": "0504030201",
  "code": "1234"
}
```

**Réponse — `200 OK` :**
```json
{
  "status": 200,
  "message": "utilisateur connecte avec succes",
  "user": {
    "id": "uuid",
    "fullname": "AHOSSI JEAN EMMANUEL",
    "number": "0504030201",
    "role": "USER",
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs possibles :**

| Code | Raison                              |
|------|-------------------------------------|
| `401 Unauthorized` | Code secret incorrect          |
| `404 Not Found`    | Numéro non trouvé              |
| `409 Conflict`     | Numéro déjà utilisé (register) |

---

#### `GET /auth/me` — Profil utilisateur 🔒

Retourne les informations de l'utilisateur connecté.

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse — `200 OK` :**
```json
{
  "status": 200,
  "message": "utilisateur trouve avec succes",
  "user": {
    "id": "uuid",
    "fullname": "AHOSSI JEAN EMMANUEL",
    "number": "0504030201",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### 💰 Portefeuille — `/wallet`

#### `GET /wallet` — Consulter son portefeuille 🔒

Retourne le solde et la devise du portefeuille de l'utilisateur connecté.

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse — `200 OK` :**
```json
{
  "status": 200,
  "message": "Portefeuille récupéré avec succès",
  "wallet": {
    "amount": 0.0,
    "currency": "XOF"
  }
}
```

---

### Résumé des routes

| Méthode | Route            | Auth requise | Description                    |
|---------|------------------|:------------:|--------------------------------|
| `POST`  | `/auth/register` | ❌           | Créer un compte utilisateur    |
| `POST`  | `/auth/login`    | ❌           | Se connecter                   |
| `GET`   | `/auth/me`       | ✅ JWT       | Voir son profil                |
| `GET`   | `/wallet`        | ✅ JWT       | Consulter son portefeuille     |

---

## 🔒 Sécurité

L'API embarque plusieurs couches de sécurité :

| Mécanisme              | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| **Helmet**             | Sécurise les en-têtes HTTP (XSS, clickjacking, sniffing, etc.)             |
| **CORS**               | Restreint les origines autorisées via `FRONTEND_URL`                        |
| **Rate Limiting**      | Max **10 requêtes / minute / IP** (via `@nestjs/throttler`)                 |
| **JWT Bearer Token**   | Authentification stateless avec signature HS256                             |
| **bcrypt (salt=12)**   | Hachage sécurisé du code secret utilisateur                                 |
| **ValidationPipe**     | Rejette toute propriété non déclarée dans les DTOs (`forbidNonWhitelisted`) |
| **Logs (Winston)**     | Logging console + fichier `error.log` pour les erreurs                      |

---

## 📖 Documentation Swagger

En mode **développement**, l'interface Swagger UI est disponible à :

```
http://localhost:3001/api
```

> La documentation Swagger est **désactivée en production** (`NODE_ENV=production`).

---

## 🐳 Docker

### Développement avec Docker

```bash
docker-compose up
```

Le conteneur :
- Expose le port **3001**
- Monte le code source en volume (hot-reload actif)
- Charge automatiquement le fichier `.env`

### Structure Docker

```yaml
services:
  api:
    build: .
    container_name: nest-docker-test
    ports:
      - "3001:3001"
    env_file: .env
    volumes:
      - .:/app
    command: npm run start:dev
```

---

## 📜 Scripts disponibles

```bash
npm run start:dev      # Démarrage en développement (nodemon + hot-reload)
npm run start:prod     # Démarrage en production (dist compilé)
npm run build          # Compilation TypeScript vers dist/
npm run format         # Formatage du code (Prettier)
npm run lint           # Lint et auto-correction (ESLint)
npm run test           # Tests unitaires (Jest)
npm run test:cov       # Couverture de tests
npm run test:e2e       # Tests end-to-end
```

**Commandes Prisma utiles :**

```bash
npx prisma migrate dev     # Créer et appliquer une migration (dev)
npx prisma migrate deploy  # Appliquer les migrations en production
npx prisma generate        # Régénérer le client Prisma
npx prisma studio          # Interface graphique pour la BDD
npx prisma validate        # Valider le schéma Prisma
```

---

## 👤 Auteur

**Jean Emmanuel AHOSSI**
🔗 [github.com/jean-emmvnuel](https://github.com/jean-emmvnuel)

---

<div align="center">
  <sub>FinPay API — v1.0.0 · NestJS · PostgreSQL · Prisma</sub>
</div>
