# Docker Deployment Guide

Einfaches Setup des Backends mit MySQL und Redis über Docker.

## 🐳 Voraussetzungen

-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installiert
-   Docker Compose (im Docker Desktop enthalten)

## 🚀 Quick Start

### 1. Environment Variablen setzen

Erstelle eine `.env` Datei im Root:

```bash
# Im Root-Verzeichnis (watermelondb/)
touch .env
```

Inhalt der `.env`:

```bash
JWT_SECRET=dein-super-geheimer-jwt-schluessel-hier-aendern
JWT_REFRESH_SECRET=dein-super-geheimer-refresh-schluessel-hier-aendern
```

### 2. Alles starten

```bash
# Im Root-Verzeichnis (wo docker-compose.yml liegt)
docker-compose up -d
```

Das startet:

-   ✅ Backend API (Port 3000)
-   ✅ MySQL Database (Port 3306)
-   ✅ Redis Cache (Port 6379)

### 3. Status prüfen

```bash
# Container anzeigen
docker-compose ps

# Logs anschauen
docker-compose logs -f backend

# Nur Backend Logs
docker-compose logs -f backend
```

### 4. API testen

```bash
# Health Check
curl http://localhost:3000/api/health

# Benutzer registrieren
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

## 🛠️ Nützliche Befehle

### Container Management

```bash
# Alles stoppen
docker-compose down

# Alles stoppen + Volumes löschen (⚠️ Daten gehen verloren)
docker-compose down -v

# Neu bauen und starten
docker-compose up -d --build

# Bestimmten Service neu starten
docker-compose restart backend
```

### Logs

```bash
# Alle Logs
docker-compose logs -f

# Nur letzte 100 Zeilen
docker-compose logs --tail=100 backend

# Fehler filtern
docker-compose logs backend | grep ERROR
```

### Datenbank Zugriff

```bash
# MySQL Shell
docker-compose exec mysql mysql -u root -prootpassword watermelondb

# Dann SQL Befehle:
SHOW TABLES;
SELECT * FROM users;
DESC projects;
```

### Redis Zugriff

```bash
# Redis CLI
docker-compose exec redis redis-cli

# Dann Redis Befehle:
PING
KEYS *
```

### Backend Shell

```bash
# In Container einloggen
docker-compose exec backend sh

# Dann:
ls -la
cat .env
```

## 🔧 Anpassungen

### Backend Port ändern

In `docker-compose.yml`:

```yaml
backend:
    ports:
        - "3001:3000" # Host:Container
```

### MySQL Passwort ändern

In `docker-compose.yml`:

```yaml
mysql:
    environment:
        - MYSQL_ROOT_PASSWORD=dein-neues-passwort

backend:
    environment:
        - DB_PASSWORD=dein-neues-passwort
```

### Persistent Data Location

Standardmäßig werden Volumes von Docker verwaltet. Für eigene Pfade:

```yaml
volumes:
    mysql-data:
        driver: local
        driver_opts:
            type: none
            device: /pfad/zu/deinem/ordner/mysql
            o: bind
```

## 🚀 Production Deployment

### 1. Environment für Production

Erstelle `docker-compose.prod.yml`:

```yaml
version: "3.8"

services:
    backend:
        image: dein-registry/watermelon-backend:latest
        environment:
            - NODE_ENV=production
            # Verwende Secrets statt Plain Text!
        deploy:
            replicas: 3
            restart_policy:
                condition: on-failure

    mysql:
        environment:
            - MYSQL_ROOT_PASSWORD_FILE=/run/secrets/mysql_root_password
        secrets:
            - mysql_root_password

secrets:
    mysql_root_password:
        external: true
```

### 2. Nginx Reverse Proxy

Erstelle `nginx.conf`:

```nginx
upstream backend {
    server backend:3000;
}

server {
    listen 80;
    server_name api.deine-domain.de;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Füge in `docker-compose.yml` hinzu:

```yaml
nginx:
    image: nginx:alpine
    ports:
        - "80:80"
        - "443:443"
    volumes:
        - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
        - backend
```

### 3. SSL mit Let's Encrypt

```bash
# Certbot Container
docker run -it --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/lib/letsencrypt:/var/lib/letsencrypt \
  certbot/certbot certonly \
  --standalone \
  -d api.deine-domain.de
```

## 📊 Monitoring

### Logs zu File

```yaml
backend:
    logging:
        driver: "json-file"
        options:
            max-size: "10m"
            max-file: "3"
```

### Prometheus Metrics

```yaml
prometheus:
    image: prom/prometheus
    ports:
        - "9090:9090"
    volumes:
        - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

## 🔒 Security Best Practices

1. **Keine Default Passwords in Production**
2. **Verwende Docker Secrets** für sensitive Daten
3. **Begrenze Resource Usage**:
    ```yaml
    deploy:
        resources:
            limits:
                cpus: "0.5"
                memory: 512M
    ```
4. **Network Segmentation**: Backend nicht direkt exponieren
5. **Regular Updates**: `docker-compose pull && docker-compose up -d`

## 🆘 Troubleshooting

### Backend startet nicht

```bash
# Logs checken
docker-compose logs backend

# Häufige Probleme:
# - MySQL noch nicht ready → Warten oder restart
# - Port 3000 bereits belegt → Port ändern
# - .env fehlt → Erstellen
```

### Datenbank Connection Failed

```bash
# MySQL Health prüfen
docker-compose exec mysql mysqladmin ping -h localhost

# Warten bis healthy
docker-compose ps

# Manuelle Connection testen
docker-compose exec backend sh
nc -zv mysql 3306
```

### Volumes bereinigen

```bash
# Alle ungenutzten Volumes löschen
docker volume prune

# Spezifisches Volume löschen
docker volume rm watermelondb_mysql-data
```

## 📚 Weitere Ressourcen

-   [Docker Compose Docs](https://docs.docker.com/compose/)
-   [Docker Security](https://docs.docker.com/engine/security/)
-   [Production Deployment](https://docs.docker.com/compose/production/)

---

**Viel Erfolg mit Docker! 🐳**
