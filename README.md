# Task Manager – Setup Guide

This project contains two parts:

- **🛠️ task-manager-api (Laravel Backend)**
- **💻 task-manager-frontend (React Frontend)**

---

## 🛠️ Task Manager API – Setup Guide

### 📥 Installation

```bash
cd task-manager-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed

cd task-manager-frontend
npm install

