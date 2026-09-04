# --- ÉTAPE 1 : Build (Compilation) ---
FROM node:24.13.0-alpine AS builder

WORKDIR /app

# Installation de toutes les dépendances
COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# --- ÉTAPE 2 : Dépendances de production ---
FROM node:24.13.0-alpine AS prod

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --omit=dev
RUN npx prisma generate

# --- ÉTAPE 3 : Image Finale (Ultra légère) ---
FROM node:24.13.0-alpine

WORKDIR /app

# Récupération du code compilé et du client Prisma généré
COPY --from=builder /app/dist ./dist
# On s'assure que le dossier 'generated' est au bon endroit pour les imports de dist/main.js
COPY --from=builder /app/src/generated ./dist/generated

# Récupération des node_modules de production
COPY --from=prod /app/node_modules ./node_modules
COPY --from=prod /app/package*.json ./

# Configuration de l'environnement
ENV NODE_ENV=production

EXPOSE 3001

# Lancement de l'application
CMD ["node", "dist/main.js"]