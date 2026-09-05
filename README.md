<div align="center">

<!-- HEADER ANIMÉ -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=💸%20FinPay%20API&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=API%20REST%20de%20paiement%20mobile%20avec%20NestJS&descAlignY=60&descColor=a78bfa&animation=fadeIn" width="100%"/>

<!-- TYPING ANIMÉ -->
<a href="https://github.com/jean-emmvnuel/finpay-api">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&pause=1000&color=A78BFA&center=true&vCenter=true&width=600&lines=NestJS+%2B+PostgreSQL+%2B+Prisma+ORM;Authentification+JWT+%2B+bcrypt;Portefeuille+XOF+%E2%80%94+Paiement+Mobile;S%C3%A9curis%C3%A9+%2B+Scalable+%2B+Dockeris%C3%A9" alt="Typing SVG" />
</a>

<br/>

<!-- BADGES PRINCIPAUX -->
<img src="https://img.shields.io/badge/version-1.0.0-a78bfa?style=for-the-badge&logo=github&logoColor=white"/>
<img src="https://img.shields.io/badge/license-UNLICENSED-ef4444?style=for-the-badge"/>
<img src="https://img.shields.io/badge/status-active-22c55e?style=for-the-badge"/>
<img src="https://img.shields.io/badge/port-3001-f59e0b?style=for-the-badge"/>

</div>

---

## 📋 Table des matières

<details>
<summary><b>🔽 Voir le sommaire</b></summary>

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

</details>

---

## 🌍 Aperçu

**FinPay API** est une API REST développée avec [NestJS](https://nestjs.com/) pour gérer des comptes utilisateurs et des portefeuilles financiers dans un contexte de **paiement mobile** (inspiré de la Côte d'Ivoire — numéros à 10 chiffres).

> Chaque utilisateur inscrit dispose automatiquement d'un **portefeuille (Wallet)** en **XOF (Franc CFA)** créé à l'inscription.

---

## 🛠 Stack technique

<div align="center">

<!-- SKILL ICONS ANIMÉS -->
<img src="https://skillicons.dev/icons?i=nestjs,ts,postgres,prisma,docker,jest&perline=6&theme=dark" alt="Tech Stack" />

</div>

<br/>

<div align="center">

| Technologie | Rôle | Badge |
|---|---|---|
| **NestJS** | Framework principal | ![NestJS](https://img.shields.io/badge/NestJS-^11-e0234e?style=flat-square&logo=nestjs&logoColor=white) |
| **TypeScript** | Typage statique | ![TypeScript](https://img.shields.io/badge/TypeScript-^5.7-3178c6?style=flat-square&logo=typescript&logoColor=white) |
| **Prisma ORM** | Accès base de données | ![Prisma](https://img.shields.io/badge/Prisma-^7.2-2d3748?style=flat-square&logo=prisma&logoColor=white) |
| **PostgreSQL** | Base de données | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-336791?style=flat-square&logo=postgresql&logoColor=white) |
| **Supabase** | Hébergement BDD cloud | ![Supabase](https://img.shields.io/badge/Supabase-cloud-3ecf8e?style=flat-square&logo=supabase&logoColor=white) |
| **JWT + Passport** | Authentification | ![JWT](https://img.shields.io/badge/JWT-Bearer-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) |
| **bcrypt** | Hachage code secret | ![bcrypt](https://img.shields.io/badge/bcrypt-salt=12-f59e0b?style=flat-square) |
| **Helmet** | Sécurité HTTP | ![Helmet](https://img.shields.io/badge/Helmet-^8-6366f1?style=flat-square) |
| **Throttler** | Rate limiting | ![Throttler](https://img.shields.io/badge/Throttler-10req%2Fmin-ef4444?style=flat-square) |
| **Winston** | Logging structuré | ![Winston](https://img.shields.io/badge/Winston-logs-22c55e?style=flat-square) |
| **Swagger** | Docs API auto-générée | ![Swagger](https://img.shields.io/badge/Swagger-UI-85ea2d?style=flat-square&logo=swagger&logoColor=black) |
| **Docker** | Conteneurisation | ![Docker](https://img.shields.io/badge/Docker-ready-2496ed?style=flat-square&logo=docker&logoColor=white) |

</div>

---

## 🗂 Architecture du projet

```
finpay-api/
├── 📁 prisma/
│   ├── schema.prisma          # Modèles de données (User, Wallet)
│   └── 📁 migrations/         # Historique des migrations
├── 📁 src/
│   ├── 📁 auth/               # Module d'authentification
│   │   ├── 📁 dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── auth.controller.ts # Routes : /auth/*
│   │   ├── auth.service.ts    # Logique métier (register, login, me)
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts    # Stratégie JWT Passport
│   │   └── jwt.auth.guard.ts  # Guard JWT
│   ├── 📁 wallet/             # Module portefeuille
│   │   ├── wallet.controller.ts
│   │   ├── wallet.service.ts
│   │   └── wallet.module.ts
│   ├── app.module.ts          # Module racine (throttler, logger, modules)
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
  number    String    @unique   // Numéro mobile (10 chiffres)
  fullname  String
  role      UserRole  @default(USER)
  createdAt DateTime  @default(now())
  code      String              // Code secret haché (bcrypt)
  wallet    Wallet?             // Relation one-to-one
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

> **🔗 Relation** : `User → Wallet` est **one-to-one** — le wallet est créé automatiquement à l'inscription avec `0 XOF`.

---

## 🚀 Installation

### Prérequis

![Node](https://img.shields.io/badge/Node.js->=18-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm->=9-cb3837?style=flat-square&logo=npm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-required-336791?style=flat-square&logo=postgresql&logoColor=white)

### Étapes

```bash
# 1️⃣ Cloner le dépôt
git clone https://github.com/jean-emmvnuel/finpay-api.git
cd finpay-api

# 2️⃣ Installer les dépendances
npm install

# 3️⃣ Configurer les variables d'environnement
cp .env.example .env
# → Remplir les valeurs dans .env

# 4️⃣ Appliquer les migrations Prisma
npx prisma migrate deploy

# 5️⃣ Générer le client Prisma
npx prisma generate
```

---

## ⚙️ Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# 🗄️ URL de connexion PostgreSQL (via PgBouncer pour les requêtes)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?pgbouncer=true"

# 🔗 URL directe (pour les migrations Prisma)
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

# 🔑 Clé secrète pour signer les tokens JWT
JWT_SECRET="votre_secret_jwt_ici"

# 🌐 Port d'écoute du serveur (défaut : 3001)
PORT=3001

# 🔒 URL du frontend autorisé pour CORS (défaut : http://localhost:3000)
FRONTEND_URL="http://localhost:3000"
```

> ⚠️ **Ne jamais committer le fichier `.env`.** Il doit être dans `.gitignore`.

---

## ▶️ Lancer l'application

```bash
# 🔧 Développement (hot-reload via nodemon)
npm run start:dev

# 🏭 Production
npm run build
npm run start:prod
```

Le serveur démarre sur **`http://localhost:3001`**

---

## 📡 API Endpoints

<div align="center">

![Base URL](https://img.shields.io/badge/Base%20URL-http%3A%2F%2Flocalhost%3A3001-a78bfa?style=for-the-badge)

</div>

### 🔐 Authentification — `/auth`

<details>
<summary><b>POST /auth/register — Inscription</b></summary>

Crée un nouvel utilisateur et son portefeuille. Retourne un token JWT.

**Corps de la requête :**
```json
{
  "fullname": "Ahossi Jean Emmanuel",
  "number": "0504030201",
  "code": "1234"
}
```

| Champ | Type | Obligatoire | Contraintes |
|---|---|:---:|---|
| `fullname` | `string` | ✅ | 7 à 70 caractères |
| `number` | `string` | ✅ | Exactement 10 chiffres |
| `code` | `string` | ✅ | Exactement 4 caractères |

**Réponse `201 Created` :**
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
> 💡 `fullname` → converti en **MAJUSCULES** automatiquement  
> 💡 `code` → haché avec **bcrypt (salt=12)** avant stockage

</details>

---

<details>
<summary><b>POST /auth/login — Connexion</b></summary>

Authentifie un utilisateur existant. Retourne un token JWT.

**Corps de la requête :**
```json
{
  "number": "0504030201",
  "code": "1234"
}
```

**Réponse `200 OK` :**
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

**Erreurs :**

| Code | Raison |
|---|---|
| `401 Unauthorized` | Code secret incorrect |
| `404 Not Found` | Numéro non trouvé |

</details>

---

<details>
<summary><b>GET /auth/me — Profil utilisateur 🔒 JWT requis</b></summary>

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse `200 OK` :**
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

</details>

---

### 💰 Portefeuille — `/wallet`

<details>
<summary><b>GET /wallet — Consulter son portefeuille 🔒 JWT requis</b></summary>

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse `200 OK` :**
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

</details>

---

### 🗺️ Résumé des routes

<div align="center">

| Méthode | Route | Auth | Description |
|:---:|---|:---:|---|
| ![POST](https://img.shields.io/badge/POST-22c55e?style=flat-square) | `/auth/register` | ❌ | Créer un compte |
| ![POST](https://img.shields.io/badge/POST-22c55e?style=flat-square) | `/auth/login` | ❌ | Se connecter |
| ![GET](https://img.shields.io/badge/GET-3b82f6?style=flat-square) | `/auth/me` | ✅ JWT | Voir son profil |
| ![GET](https://img.shields.io/badge/GET-3b82f6?style=flat-square) | `/wallet` | ✅ JWT | Consulter le portefeuille |

</div>

---

## 🔒 Sécurité

<div align="center">

| Mécanisme | Description | Badge |
|---|---|---|
| **Helmet** | Sécurise les en-têtes HTTP (XSS, clickjacking...) | ![Helmet](https://img.shields.io/badge/Helmet-ON-22c55e?style=flat-square) |
| **CORS** | Restreint les origines via `FRONTEND_URL` | ![CORS](https://img.shields.io/badge/CORS-Restricted-f59e0b?style=flat-square) |
| **Rate Limiting** | Max **10 req/min/IP** | ![Throttler](https://img.shields.io/badge/Throttler-10%2Fmin-ef4444?style=flat-square) |
| **JWT Bearer** | Authentification stateless HS256 | ![JWT](https://img.shields.io/badge/JWT-HS256-a78bfa?style=flat-square) |
| **bcrypt** | Hachage sécurisé du code secret | ![bcrypt](https://img.shields.io/badge/bcrypt-salt=12-3b82f6?style=flat-square) |
| **ValidationPipe** | Rejette les champs inconnus des DTOs | ![Validation](https://img.shields.io/badge/Whitelist-ON-22c55e?style=flat-square) |
| **Winston Logs** | Logs console + fichier `error.log` | ![Winston](https://img.shields.io/badge/Logs-Winston-6366f1?style=flat-square) |

</div>

---

## 📖 Documentation Swagger

En mode **développement**, l'interface Swagger UI est disponible à :

<div align="center">

[![Swagger](https://img.shields.io/badge/Swagger%20UI-http%3A%2F%2Flocalhost%3A3001%2Fapi-85ea2d?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:3001/api)

</div>

> 🚫 La documentation Swagger est **désactivée automatiquement en production** (`NODE_ENV=production`).

---

## 🐳 Docker

```bash
# Lancer en développement avec Docker
docker-compose up
```

**Le conteneur :**
- 📡 Expose le port **3001**
- 🔄 Monte le code source en volume (hot-reload actif)
- 🔐 Charge automatiquement le fichier `.env`

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
npm run start:dev      # 🔧 Développement (nodemon + hot-reload)
npm run start:prod     # 🏭 Production (dist compilé)
npm run build          # 📦 Compilation TypeScript → dist/
npm run format         # ✨ Formatage du code (Prettier)
npm run lint           # 🔍 Lint et auto-correction (ESLint)
npm run test           # 🧪 Tests unitaires (Jest)
npm run test:cov       # 📊 Couverture de tests
npm run test:e2e       # 🔁 Tests end-to-end
```

**Commandes Prisma :**

```bash
npx prisma migrate dev     # 🆕 Créer et appliquer une migration (dev)
npx prisma migrate deploy  # 🚀 Appliquer les migrations en production
npx prisma generate        # ⚙️  Régénérer le client Prisma
npx prisma studio          # 🖥️  Interface graphique pour la BDD
npx prisma validate        # ✅ Valider le schéma Prisma
```

---

## 👤 Auteur

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=120&section=footer" width="100%"/>

**Jean Emmanuel AHOSSI**

[![GitHub](https://img.shields.io/badge/GitHub-jean--emmvnuel-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jean-emmvnuel)

![FinPay](https://img.shields.io/badge/FinPay%20API-v1.0.0-a78bfa?style=for-the-badge)
![NestJS](https://img.shields.io/badge/NestJS-e0234e?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2d3748?style=for-the-badge&logo=prisma&logoColor=white)

</div>
