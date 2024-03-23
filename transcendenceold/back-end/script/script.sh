#!/bin/bash

npx prisma generate

npx prisma migrate deploy

npm run start:dev