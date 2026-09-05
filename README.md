<div align="center">

<!-- HEADER ANIMÉ -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=💸%20FinPay%20API&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=API%20REST%20de%20Paiement%20Mobile%20%26%20Portefeuille%20Fintech%20avec%20NestJS&descAlignY=60&descColor=a78bfa&animation=fadeIn" width="100%"/>

<!-- TYPING ANIMÉ -->
<a href="https://github.com/jean-emmvnuel/finpay-api">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&pause=1000&color=A78BFA&center=true&vCenter=true&width=650&lines=NestJS+%2B+PostgreSQL+%2B+Prisma+ORM;Authentification+JWT+%2B+Hachage+bcrypt;Portefeuille+XOF+%E2%80%94+Paiement+Mobile+S%C3%A9curis%C3%A9;Transactions+Financi%C3%A8res+ACID+%2B+Rate+Limiting" alt="Typing SVG" />
</a>

<br/>

<!-- BADGES PRINCIPAUX -->
<img src="https://img.shields.io/badge/version-1.1.0-a78bfa?style=for-the-badge&logo=github&logoColor=white"/>
<img src="https://img.shields.io/badge/license-UNLICENSED-ef4444?style=for-the-badge"/>
<img src="https://img.shields.io/badge/status-active-22c55e?style=for-the-badge"/>
<img src="https://img.shields.io/badge/port-3001-f59e0b?style=for-the-badge"/>

</div>

---

## 📋 Table des matières

<details>
<summary><b>🔽 Cliquez pour dérouler le sommaire</b></summary>

- [Aperçu](#-aperçu)
- [Cas d'usage métier (Use Cases)](#-cas-dusage-métier-use-cases)
  - [Cas 1 : Inscription & Création automatique du portefeuille](#-cas-1--onboarding--création-atomique-du-portefeuille)
  - [Cas 2 : Simulation & Calcul des frais (Devis)](#-cas-2--simulation--calcul-instantané-des-frais-devis)
  - [Cas 3 : Exécution d'un paiement sécurisé (Transaction ACID)](#-cas-3--règlement-dun-paiement-avec-débit-atomique)
  - [Cas 4 : Consultation du solde & Profil utilisateur](#-cas-4--consultation-du-solde--profil)
- [Stack technique](#-stack-technique)
- [Architecture du projet](#-architecture-du-projet)
- [Schéma de base de données](#-schéma-de-base-de-données)
- [Installation & Démarrage](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Documentation des API Endpoints](#-api-endpoints)
- [Sécurité & Fiabilité](#-sécurité--fiabilité)
- [Documentation Swagger](#-documentation-swagger)
- [Docker](#-docker)
- [Scripts disponibles](#-scripts-disponibles)
- [Auteur](#-auteur)

</details>

---

## 🌍 Aperçu

**FinPay API** est une solution backend fintech haute performance conçue avec le framework **NestJS**, **Prisma ORM** et **PostgreSQL**.

Adaptée à l'écosystème du **paiement mobile en Afrique de l'Ouest** (notamment le plan de numérotation à 10 chiffres de Côte d'Ivoire et la devise **XOF - Franc CFA**), elle offre un socle robuste pour propulser des applications de portefeuille électronique (e-wallet), de transfert d'argent et de règlement d'achats marchands.

### ✨ Fonctionnalités clés
- 📱 **Gestion d'identité mobile** : Inscription par numéro de téléphone à 10 chiffres et code PIN secret sécurisé par bcrypt.
- 💼 **Portefeuille XOF automatique** : Création atomique d'un wallet dès l'onboarding de l'utilisateur.
- 📊 **Moteur de devis (Quote)** : Calcul en temps réel des frais de transaction (2%) avant validation.
- 🛡️ **Paiements transactionnels ACID** : Débit du portefeuille et émission de paiement protégés contre la concurrence et les doubles dépenses (`Prisma $transaction`).
- 🔒 **Sécurité de niveau bancaire** : Protection brute-force (Rate Limiting), validation stricte des payloads (`ValidationPipe`), en-têtes durcis (`Helmet`), isolation des origines (`CORS`).

---

## 💡 Cas d'usage métier (Use Cases)

```mermaid
flowchart LR
    A([Client Mobile]) -->|1. Register| B[Auth Service]
    B -->|Création atomique| DB[(User + Wallet)]
    A -->|2. Send Quote| W[Wallet Service]
    W -->|Calcul 2%| A
    A -->|3. Paiement| P[Paiement Service]
    P -->|Transaction ACID Débit + Statut| DB
```

---

### 🔹 Cas 1 : Onboarding & Création atomique du portefeuille

> **Contexte** : Un nouvel utilisateur télécharge l'application mobile et s'inscrit pour la première fois avec son numéro de téléphone et un code PIN secret à 4 chiffres.

1. **Vérification d'unicité** : L'API s'assure que le numéro n'est pas déjà enregistré (rejet `409 Conflict` si existant).
2. **Hachage cryptographique** : Le code PIN est chiffré via `bcrypt` avec un coût de salage de 12.
3. **Création atomique User + Wallet** : Via Prisma, l'utilisateur et son portefeuille en XOF (`balance: 0`) sont générés ensemble dans la même transaction SQL. Impossible d'obtenir un utilisateur sans portefeuille.
4. **Session immédiate** : Un jeton JWT est retourné pour connecter directement l'utilisateur.

---

### 🔹 Cas 2 : Simulation & Calcul instantané des frais (Devis)

> **Contexte** : Avant de valider un paiement de facture ou un achat chez un marchand partenaire, le client saisit le montant qu'il souhaite envoyer et souhaite visualiser le coût exact de la transaction.

1. **Contrôle d'intégrité** : Le montant est validé par le DTO (`montant > 0`).
2. **Moteur tarifaire** : Application automatique de la commission de service de **2%**.
3. **Restitution transparente** : L'utilisateur reçoit le détail :
   $$\text{Montant brut} + \text{Frais (2\%)} = \text{Montant total débité}$$
4. **Aucun impact en base** : C'est une opération en lecture/calcul sans altération des soldes.

---

### 🔹 Cas 3 : Règlement d'un paiement avec débit atomique

> **Contexte** : Le client confirme le paiement d'un montant de `10 000 XOF`. Son compte doit être débité de `10 200 XOF` (frais inclus) et un reçu de paiement doit être enregistré.

1. **Validation & Authentification** : Vérification du token JWT Bearer (`req.user.sub`).
2. **Transaction ACID (`Prisma.$transaction`)** :
   - Lecture du solde actuel du portefeuille de l'utilisateur.
   - **Vérification de solvabilité** : Si $\text{balance} < \text{totalAmount}$, arrêt immédiat avec levée d'une `400 BadRequestException ("Solde insuffisant")`.
   - **Débit immédiat** : Décrémentation atomique de la balance du portefeuille.
   - **Génération du paiement** : Création de la ligne `Paiement` avec le statut `SUCCES`, horodatage et montants détaillés.
3. **Garantie anti-double dépense** : Si un problème réseau survient, toute l'opération est annulée (rollback automatique). L'utilisateur n'est jamais débité à tort.

---

### 🔹 Cas 4 : Consultation du solde & Profil

> **Contexte** : À chaque ouverture de l'application ou rafraîchissement du dashboard, l'application synchronise l'état du compte.

- `GET /wallet` : Récupération du solde courant et de la devise associée.
- `GET /auth/me` : Récupération des informations d'identité (nom complet, numéro de téléphone, date de création).

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
| **NestJS** | Framework Node.js modulaire & scalable | ![NestJS](https://img.shields.io/badge/NestJS-^11-e0234e?style=flat-square&logo=nestjs&logoColor=white) |
| **TypeScript** | Typage statique et rigueur applicative | ![TypeScript](https://img.shields.io/badge/TypeScript-^5.7-3178c6?style=flat-square&logo=typescript&logoColor=white) |
| **Prisma ORM** | Mapping objet-relationnel & migrations SQL | ![Prisma](https://img.shields.io/badge/Prisma-^7.2-2d3748?style=flat-square&logo=prisma&logoColor=white) |
| **PostgreSQL** | Moteur de base de données relationnelle | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=flat-square&logo=postgresql&logoColor=white) |
| **Supabase** | Hébergement PostgreSQL avec pool de connexions | ![Supabase](https://img.shields.io/badge/Supabase-cloud-3ecf8e?style=flat-square&logo=supabase&logoColor=white) |
| **Passport & JWT** | Authentification sans état (Bearer tokens) | ![JWT](https://img.shields.io/badge/JWT-Bearer-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) |
| **bcrypt** | Hachage sécurisé des codes PIN (12 rounds) | ![bcrypt](https://img.shields.io/badge/bcrypt-salt=12-f59e0b?style=flat-square) |
| **Helmet** | Protection des en-têtes HTTP contre les failles | ![Helmet](https://img.shields.io/badge/Helmet-^8-6366f1?style=flat-square) |
| **Throttler** | Prévention des attaques DDoS et brute-force | ![Throttler](https://img.shields.io/badge/Throttler-10req%2Fmin-ef4444?style=flat-square) |
| **Winston** | Centralisation des logs d'erreurs | ![Winston](https://img.shields.io/badge/Winston-logging-22c55e?style=flat-square) |
| **Swagger** | Documentation interactive OpenAPI 3.0 | ![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85ea2d?style=flat-square&logo=swagger&logoColor=black) |
| **Docker** | Environnement conteneurisé prêt pour le déploiement | ![Docker](https://img.shields.io/badge/Docker-ready-2496ed?style=flat-square&logo=docker&logoColor=white) |

</div>

---

## 🗂 Architecture du projet

```
finpay-api/
├── 📁 prisma/
│   ├── schema.prisma               # Modèles de données (User, Wallet, Paiement)
│   └── 📁 migrations/              # Historique des migrations SQL
├── 📁 src/
│   ├── 📁 auth/                    # Module d'authentification
│   │   ├── 📁 dto/
│   │   │   ├── register.dto.ts     # DTO Inscription
│   │   │   └── login.dto.ts        # DTO Connexion
│   │   ├── auth.controller.ts      # Contrôleur : /auth/register, /auth/login, /auth/me
│   │   ├── auth.service.ts         # Logique métier d'authentification
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts         # Stratégie Passport JWT
│   │   └── jwt.auth.guard.ts       # Guard de sécurisation des routes privées
│   ├── 📁 wallet/                  # Module de portefeuille
│   │   ├── 📁 dto/
│   │   │   └── wallet.dto.ts       # DTO de calcul de devis
│   │   ├── wallet.controller.ts    # Contrôleur : /wallet, /wallet/send-quote
│   │   ├── wallet.service.ts       # Solde & Calcul des frais de service
│   │   └── wallet.module.ts
│   ├── 📁 paiement/                # Module de paiements
│   │   ├── 📁 dto/
│   │   │   └── paiement.dto.ts     # DTO de validation de montant de paiement
│   │   ├── paiement.controller.ts  # Contrôleur : POST /paiement
│   │   ├── paiement.service.ts     # Transaction ACID de débit et règlement
│   │   └── paiement.module.ts
│   ├── app.module.ts               # Module racine (Winston, Throttler, Modules métier)
│   ├── prisma.service.ts           # Client Prisma avec pool de connexions
│   └── main.ts                     # Point d'entrée (Helmet, CORS, Swagger, ValidationPipe)
├── .env                            # Variables d'environnement
├── Docker-compose.yml
├── Dockerfile
└── package.json
```

---

## 🗃 Schéma de base de données

```prisma
model User {
  id        String     @id @default(uuid())
  number    String     @unique // Numéro de téléphone (10 chiffres)
  fullname  String
  role      UserRole   @default(USER)
  createdAt DateTime   @default(now())
  code      String     // Code PIN chiffré (bcrypt)
  wallet    Wallet?    // Relation 1-to-1 avec le portefeuille

  paiements Paiement[] // Historique des paiements de l'utilisateur
}

enum UserRole {
  USER
  ADMIN
  SYSTEM
}

model Wallet {
  id        String   @id @default(uuid())
  userId    String   @unique
  balance   Float    @default(0)
  currency  String   @default("XOF")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])
}

model Paiement {
  id          String        @id @default(uuid())
  amount      Float         // Montant net
  feeAmount   Float         // Frais de service (2%)
  totalAmount Float         // Montant brut débité
  currency    String        @default("XOF")
  status      PaymentStatus @default(EN_COURS)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  userId String
  user   User @relation(fields: [userId], references: [id])

  transaction Transaction? // Log de la tentative dans la table Transaction
}

enum PaymentStatus {
  EN_COURS
  SUCCES
  ECHOUE
}

model Transaction {
  id        String          @id @default(uuid())
  amount    Float           // Montant de la transaction
  type      TransactionType // DEBIT / CREDIT
  currency  String          @default("XOF")
  createdAt DateTime        @default(now())

  paiementId String   @unique
  paiement   Paiement @relation(fields: [paiementId], references: [id])
}

enum TransactionType {
  DEBIT
  CREDIT
}
```

---

## 🚀 Installation

### Prérequis

![Node](https://img.shields.io/badge/Node.js->=18-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm->=9-cb3837?style=flat-square&logo=npm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=flat-square&logo=postgresql&logoColor=white)

### Procédure pas à pas

```bash
# 1️⃣ Cloner le dépôt
git clone https://github.com/jean-emmvnuel/finpay-api.git
cd finpay-api

# 2️⃣ Installer les dépendances
npm install

# 3️⃣ Créer le fichier d'environnement
cp .env.example .env
# Remplir les identifiants PostgreSQL et la clé secrète JWT

# 4️⃣ Exécuter les migrations Prisma
npx prisma migrate deploy

# 5️⃣ Générer les types du client Prisma
npx prisma generate
```

---

## ⚙️ Variables d'environnement

Créer un fichier `.env` à la racine :

```env
# 🗄️ Connexion PostgreSQL (Pooled pour l'API)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?pgbouncer=true"

# 🔗 Connexion PostgreSQL directe (pour les migrations Prisma)
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

# 🔑 Clé secrète de signature des tokens JWT
JWT_SECRET="votre_cle_secrete_ultra_securisee_ici"

# 🌐 Port d'écoute du serveur (Défaut : 3001)
PORT=3001

# 🔒 Origine frontend autorisée pour les requêtes CORS
FRONTEND_URL="http://localhost:3000"
```

---

## ▶️ Lancer l'application

```bash
# 🔧 Mode Développement (hot-reload nodemon)
npm run start:dev

# 📦 Construction du bundle de production
npm run build

# 🏭 Lancement en Production
npm run start:prod
```

L'API est accessible par défaut sur **`http://localhost:3001`**.

---

## 📡 API Endpoints

<div align="center">

![Base URL](https://img.shields.io/badge/Base%20URL-http%3A%2F%2Flocalhost%3A3001-a78bfa?style=for-the-badge)

</div>

### 1. 🔐 Module Authentification — `/auth`

<details>
<summary><b>POST /auth/register — Inscription</b></summary>

Crée le compte utilisateur et initialise immédiatement son portefeuille à `0 XOF`.

**Body :**
```json
{
  "fullname": "Ahossi Jean Emmanuel",
  "number": "0504030201",
  "code": "1234"
}
```

| Champ | Type | Contrainte | Description |
|---|---|---|---|
| `fullname` | `string` | 7 à 70 car. | Converti automatiquement en majuscules |
| `number` | `string` | 10 chiffres | Numéro mobile unique |
| `code` | `string` | 4 caractères | Code PIN secret haché via bcrypt |

**Réponse `201 Created` :**
```json
{
  "status": 201,
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "2d6e43a3-b571-464f-a9f0-1f951046300b",
    "fullname": "AHOSSI JEAN EMMANUEL",
    "number": "0504030201",
    "role": "USER",
    "createdAt": "2026-09-05T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

</details>

<details>
<summary><b>POST /auth/login — Connexion</b></summary>

Authentifie l'utilisateur via son numéro et son code PIN.

**Body :**
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
    "id": "2d6e43a3-b571-464f-a9f0-1f951046300b",
    "fullname": "AHOSSI JEAN EMMANUEL",
    "number": "0504030201",
    "role": "USER",
    "createdAt": "2026-09-05T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

</details>

<details>
<summary><b>GET /auth/me — Profil connecté 🔒 (JWT Requis)</b></summary>

**En-tête HTTP :** `Authorization: Bearer <token>`

**Réponse `200 OK` :**
```json
{
  "status": 200,
  "message": "utilisateur trouve avec succes",
  "user": {
    "id": "2d6e43a3-b571-464f-a9f0-1f951046300b",
    "fullname": "AHOSSI JEAN EMMANUEL",
    "number": "0504030201",
    "createdAt": "2026-09-05T12:00:00.000Z"
  }
}
```

</details>

---

### 2. 💰 Module Portefeuille — `/wallet`

<details>
<summary><b>GET /wallet — Consulter le solde 🔒 (JWT Requis)</b></summary>

**En-tête HTTP :** `Authorization: Bearer <token>`

**Réponse `200 OK` :**
```json
{
  "balance": 3980000,
  "currency": "XOF"
}
```

</details>

<details>
<summary><b>POST /wallet/send-quote — Obtenir une estimation des frais 🔒 (JWT Requis)</b></summary>

Calcule en amont la commission (2%) et le montant total d'une opération.

**Body :**
```json
{
  "montant": 10000
}
```

**Réponse `200 OK` :**
```json
{
  "status": 200,
  "message": "Devis calculé avec succès",
  "data": {
    "amount": 10000,
    "fee": 200,
    "totalAmount": 10200
  }
}
```

</details>

---

### 3. 💳 Module Paiements — `/payments` (ou `/paiement`)

<details>
<summary><b>POST /payments — Effectuer un paiement 🔒 (JWT Requis)</b></summary>

Débite le portefeuille utilisateur de manière atomique et consigne la transaction financière.

**Body :**
```json
{
  "montant": 5000
}
```

**Réponse `201 Created` :**
```json
{
  "status": 201,
  "message": "Paiement effectué avec succès",
  "data": {
    "paiement": {
      "id": "a9317079-0c67-4f4c-b17d-e6b72d245465",
      "amount": 5000,
      "feeAmount": 100,
      "totalAmount": 5100,
      "currency": "XOF",
      "status": "SUCCES",
      "userId": "2d6e43a3-b571-464f-a9f0-1f951046300b",
      "createdAt": "2026-09-05T14:10:00.000Z",
      "updatedAt": "2026-09-05T14:10:00.000Z"
    },
    "newBalance": 19900
  }
}
```

**Erreurs possibles :**
- `400 Bad Request` : Solde insuffisant (`"Solde insuffisant pour effectuer ce paiement"`).
- `404 Not Found` : Portefeuille utilisateur introuvable.

</details>

<details>
<summary><b>GET /payments — Voir la liste de ses paiements 🔒 (JWT Requis)</b></summary>

Retourne l'historique complet des paiements de l'utilisateur connecté, triés du plus récent au plus ancien.

**Réponse `200 OK` :**
```json
[
  {
    "id": "a9317079-0c67-4f4c-b17d-e6b72d245465",
    "amount": 5000,
    "feeAmount": 100,
    "totalAmount": 5100,
    "currency": "XOF",
    "status": "SUCCES",
    "createdAt": "2026-09-05T14:10:00.000Z",
    "updatedAt": "2026-09-05T14:10:00.000Z"
  }
]
```

</details>

<details>
<summary><b>GET /payments/:id — Voir un paiement précis 🔒 (JWT Requis)</b></summary>

Retourne le détail d'un paiement spécifique et sa transaction liée.

**Réponse `200 OK` :**
```json
{
  "id": "a9317079-0c67-4f4c-b17d-e6b72d245465",
  "amount": 5000,
  "feeAmount": 100,
  "totalAmount": 5100,
  "currency": "XOF",
  "status": "SUCCES",
  "createdAt": "2026-09-05T14:10:00.000Z",
  "updatedAt": "2026-09-05T14:10:00.000Z",
  "userId": "2d6e43a3-b571-464f-a9f0-1f951046300b",
  "transaction": {
    "id": "b1827079-0c67-4f4c-b17d-e6b72d245466",
    "amount": 5100,
    "type": "DEBIT",
    "currency": "XOF",
    "createdAt": "2026-09-05T14:10:00.000Z",
    "paiementId": "a9317079-0c67-4f4c-b17d-e6b72d245465"
  }
}
```

</details>

---

### 4. 📜 Module Transactions — `/transactions`

<details>
<summary><b>GET /transactions — Historique des transactions de compte 🔒 (JWT Requis)</b></summary>

Permet à l'utilisateur de consulter l'historique complet de tous les mouvements financiers ayant affecté son solde.

**Réponse `200 OK` :**
```json
[
  {
    "id": "b1827079-0c67-4f4c-b17d-e6b72d245466",
    "type": "DEBIT",
    "amount": 1020000,
    "currency": "XOF",
    "createdAt": "2026-09-05T14:10:00.000Z"
  }
]
```

</details>

---

### 🗺️ Tableau de synthèse des routes

<div align="center">

| Méthode | Route | Protection | Description |
|:---:|---|:---:|---|
| ![POST](https://img.shields.io/badge/POST-22c55e?style=flat-square) | `/auth/register` | Publique | Inscription & Initialisation automatique du Wallet |
| ![POST](https://img.shields.io/badge/POST-22c55e?style=flat-square) | `/auth/login` | Publique | Authentification & Obtention du token JWT |
| ![GET](https://img.shields.io/badge/GET-3b82f6?style=flat-square) | `/auth/me` | 🔒 JWT Bearer | Récupération du profil utilisateur |
| ![GET](https://img.shields.io/badge/GET-3b82f6?style=flat-square) | `/wallet` | 🔒 JWT Bearer | Consultation du solde du portefeuille (`{ balance, currency }`) |
| ![POST](https://img.shields.io/badge/POST-22c55e?style=flat-square) | `/wallet/send-quote` | 🔒 JWT Bearer | Simulation des frais de transaction (2%) |
| ![POST](https://img.shields.io/badge/POST-22c55e?style=flat-square) | `/payments` (ou `/paiement`) | 🔒 JWT Bearer | Exécution transactionnelle du paiement |
| ![GET](https://img.shields.io/badge/GET-3b82f6?style=flat-square) | `/payments` (ou `/paiement`) | 🔒 JWT Bearer | Consultation de la liste des paiements de l'utilisateur |
| ![GET](https://img.shields.io/badge/GET-3b82f6?style=flat-square) | `/payments/:id` | 🔒 JWT Bearer | Consultation détaillée d'un paiement spécifique |
| ![GET](https://img.shields.io/badge/GET-3b82f6?style=flat-square) | `/transactions` | 🔒 JWT Bearer | Historique complet des transactions financières |

</div>

---

## 🔒 Sécurité & Fiabilité

<div align="center">

| Mécanisme | Rôle & Implémentation | Statut |
|---|---|:---:|
| **Transactions ACID** | Isolation totale des paiements et débits via `Prisma.$transaction` | ![Active](https://img.shields.io/badge/ACID-Activé-22c55e?style=flat-square) |
| **Helmet** | Durcissement des en-têtes de réponse HTTP (X-Frame-Options, CSP, etc.) | ![Active](https://img.shields.io/badge/Helmet-Activé-22c55e?style=flat-square) |
| **CORS Filtré** | Restriction stricte aux domaines déclarés dans `FRONTEND_URL` | ![Active](https://img.shields.io/badge/CORS-Restreint-f59e0b?style=flat-square) |
| **Rate Limiting** | Max **10 requêtes par minute par IP** (anti brute-force sur `/auth`) | ![Active](https://img.shields.io/badge/Throttler-10%2Fmin-ef4444?style=flat-square) |
| **JWT Stateless** | Tokens signés avec expiration et validation des rôles | ![Active](https://img.shields.io/badge/JWT-HS256-a78bfa?style=flat-square) |
| **Hachage bcrypt** | 12 cycles de salage pour tous les codes secrets utilisateurs | ![Active](https://img.shields.io/badge/bcrypt-Salt%2012-3b82f6?style=flat-square) |
| **ValidationPipe** | Rejet systématique des attributs non déclarés (`whitelist: true`) | ![Active](https://img.shields.io/badge/DTO-Strict-22c55e?style=flat-square) |
| **Journalisation Winston** | Traçabilité console enrichie et persistance des erreurs dans `error.log` | ![Active](https://img.shields.io/badge/Logs-Winston-6366f1?style=flat-square) |

</div>

---

## 📖 Documentation Swagger

En environnement de développement, l'interface graphique interactive OpenAPI / Swagger UI est disponible à l'adresse :

<div align="center">

[![Swagger](https://img.shields.io/badge/Swagger%20UI-http%3A%2F%2Flocalhost%3A3001%2Fapi-85ea2d?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:3001/api)

</div>

> 🛡️ **Remarque de sécurité** : L'accès à Swagger est automatiquement désactivé lorsque `NODE_ENV=production`.

---

## 🐳 Docker

Pour démarrer instantanément un environnement de test isolé :

```bash
# Démarrage des conteneurs
docker-compose up -d
```

Le service Docker monte le code source en volume pour préserver le rechargement à chaud (**hot-reload**) et transmet les variables d'environnement.

---

## 📜 Scripts disponibles

```bash
npm run start:dev      # 🔧 Serveur de développement avec rechargement à chaud
npm run build          # 📦 Compilation TypeScript vers /dist
npm run start:prod     # 🏭 Lancement du serveur compilé de production
npm run format         # ✨ Formatage global du code avec Prettier
npm run lint           # 🔍 Analyse statique et correction ESLint
npm run test           # 🧪 Exécution de la suite de tests unitaires
npm run test:cov       # 📊 Rapport de couverture de tests
```

---

## 👤 Auteur

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=120&section=footer" width="100%"/>

**Jean Emmanuel AHOSSI**

[![GitHub](https://img.shields.io/badge/GitHub-jean--emmvnuel-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jean-emmvnuel)

![FinPay](https://img.shields.io/badge/FinPay%20API-v1.1.0-a78bfa?style=for-the-badge)
![NestJS](https://img.shields.io/badge/NestJS-e0234e?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2d3748?style=for-the-badge&logo=prisma&logoColor=white)

</div>
