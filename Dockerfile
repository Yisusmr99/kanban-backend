FROM node:18-alpine
# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app
# Copia los archivos de dependencias
COPY package*.json ./
# Instala las dependencias (bcryptjs no requiere compilación)
RUN npm install --legacy-peer-deps
# Copia el resto de los archivos de la aplicación
COPY . .
# Construye la aplicación
RUN npm run build
# Expone el puerto en el contenedor
EXPOSE 3003
# Define el comando de inicio
CMD ["npm", "run", "start:prod"]