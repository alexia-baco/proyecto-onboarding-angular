#!/bin/bash

set -e

APP_DIR="/var/www/app"

echo "STARTING APACHE"

if [ -d "$APP_DIR" ]; then
    cd "$APP_DIR"
    php bin/console doctrine:database:create --if-not-exists --no-interaction
    php bin/console doctrine:schema:update --force --no-interaction
    php bin/console app:create-admin || true
else
    echo "WARN: Application directory $APP_DIR not found. Skipping schema update and admin creation."
fi

exec "$@"
