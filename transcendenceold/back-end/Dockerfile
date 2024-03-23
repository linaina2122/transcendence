FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@10.2.5

RUN npm install 

COPY . .

RUN chmod 777 script/script.sh

RUN mkdir -p /avatar_users_images/

# ENTRYPOINT [ "script/script.sh" ]

# ENTRYPOINT [ "npm", "run", "start:dev" ]
