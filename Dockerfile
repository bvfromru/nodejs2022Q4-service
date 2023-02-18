FROM node:18-alpine
USER root
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# RUN npx prisma generate
EXPOSE ${PORT}
CMD ["npm", "run", "start:dev"]
