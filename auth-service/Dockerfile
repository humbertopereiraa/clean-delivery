# Usa a imagem do Node.js com o tag alpine
FROM node:18.15-alpine
# Define o diretório de trabalho como /app
WORKDIR /app
# Copia os arquivos package.json e package-lock.json para o diretório de trabalho
COPY dist/package*.json ./
# Copia o restante dos arquivos da aplicação para o diretório de trabalho
COPY dist/ .
# Instala as dependências da aplicação
RUN npm install
# Expõe a porta 3000
EXPOSE 3000
# Inicia a aplicação
CMD ["node","index"]
