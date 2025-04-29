# Utilise une image officielle de Node.js comme base
FROM node:18

# Crée un dossier pour l'application dans le conteneur
WORKDIR /app

# Copie les fichiers de package
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste de l’application
COPY . .

# Expose le port (à adapter selon ton app)
EXPOSE 3000

# Commande de démarrage
CMD ["node", "app.js"]
