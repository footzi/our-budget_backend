# our-budget_backend

## Запуск

Создать `.env` в корне проекта, затем:

```bash
docker compose up --build
```

Swagger: http://localhost:3000/swagger/

## Разработка (база в докере, приложение на машине)

```bash
docker compose up -d postgres
npm ci
npm run start:dev
```

## Проверки

```bash
npm run build
npm test
npm run lint
```
