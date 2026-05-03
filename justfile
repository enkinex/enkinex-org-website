set dotenv-load := true
set dotenv-filename := ".env.local"

surreal_data := env_var("SURREAL_DATA")
surreal_user := env_var("SURREAL_USER")
surreal_pass := env_var("SURREAL_PASS")
surreal_namespace := env_var("SURREAL_NAMESPACE")
surreal_database := env_var("SURREAL_DATABASE")

dev:
    npm run dev

surreal-start:
    surreal start rocksdb://{{surreal_data}} --user={{surreal_user}} --pass={{surreal_pass}} --default-namespace={{surreal_namespace}} --default-database={{surreal_database}} --allow-all

surreal-init:
    npm run initdb

typegen-dev:
    npx wrangler types --env-file .env.local
