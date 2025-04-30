# Étape unique : Utilise Node.js pour servir le projet React
FROM node:20-bullseye

# Crée le dossier de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install --force

# Copie tout le reste du projet
COPY . .

# Expose le port par défaut du serveur React
EXPOSE 5173

# Démarre le serveur React
CMD ["npm", "start"]
