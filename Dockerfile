FROM node

WORKDIR /app
COPY ./package.json ./package-lock.json ./tsconfig.json ./.env  ./
RUN npm install
COPY ./src ./src
CMD ["npm", "run", "prod"]