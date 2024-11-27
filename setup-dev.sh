#!/usr/bin/env bash
./docker-compose.sh dev up -d
rm -f .env
echo "DATABASE_URL='postgresql://root:root@$(bun get-docker-ip):5432/uploadbytes?schema=public'" >> .env
bun db:migrate