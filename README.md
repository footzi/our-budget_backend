# Запуск

## Dev
- docker-compose up postgres - Запуск БД
- yarn start:dev - Запуск приложения
- docker-compose up pgadmin - PG admin откроется на http://localhost:5050/
- docker-compose stop pgadmin - остановить сервис

## Prod
- docker-compose up postgres - Запуск БД
- yarn build - Cборка приложения
- yarn start - Cтарт приложения

## Другие команды
- docker-compose up -d
- docker-compose down
- docker-compose up -d --build
- docker-compose ps - список контейнеров
- docker-compose rm - удалить контейнер
- docker-compose build --no-cache
  https://www.tomray.dev/nestjs-docker-compose-postgres
https://docs.docker.com/engine/reference/commandline/compose_build/
https://dev.to/erezhod/setting-up-a-nestjs-project-with-docker-for-back-end-development-30lg

