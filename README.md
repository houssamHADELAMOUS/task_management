Task Manager API – Setup Guide
📥 Installation
cd task-manager-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed

cd task-manager-frontend
npm install

