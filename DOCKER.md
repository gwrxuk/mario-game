# 🐳 Docker Deployment Guide

## Quick Start (3 Commands)

```bash
# 1. Build and run
docker-compose up -d --build

# 2. Open browser
open http://localhost:8080

# 3. Stop when done
docker-compose down
```

## 📦 What's Included

- **Dockerfile** - Nginx-based container
- **docker-compose.yml** - Easy orchestration
- **nginx.conf** - Optimized web server config
- **deploy.sh** - Interactive deployment script
- **.dockerignore** - Build optimization

## 🚀 Deployment Methods

### Method 1: Docker Compose (Recommended)

**Build and run:**
```bash
docker-compose up -d --build
```

**View logs:**
```bash
docker-compose logs -f
```

**Stop:**
```bash
docker-compose down
```

### Method 2: Docker CLI

**Build image:**
```bash
docker build -t mario-game:latest .
```

**Run container:**
```bash
docker run -d \
  --name super-mario-game \
  -p 8080:80 \
  --restart unless-stopped \
  mario-game:latest
```

**Stop and remove:**
```bash
docker stop super-mario-game
docker rm super-mario-game
```

### Method 3: Interactive Script

**Run the deployment script:**
```bash
./deploy.sh
```

This provides a menu with options:
1. Build and run with docker-compose
2. Build Docker image only
3. Run existing image
4. Stop and remove containers
5. View logs
6. Clean up
7. Exit

## 🌐 Accessing the Game

**Local:**
- http://localhost:8080

**Network:**
- http://YOUR-IP:8080 (from other devices)

**Find your IP:**
```bash
# macOS/Linux
hostname -I | awk '{print $1}'

# macOS specific
ipconfig getifaddr en0
```

## 🏗️ Container Details

### Image Info
- **Base**: nginx:alpine (lightweight ~40MB)
- **Web Server**: Nginx 1.25+
- **Port**: 80 (mapped to 8080)
- **Architecture**: Multi-platform (amd64/arm64)

### Optimizations
- ✅ Gzip compression enabled
- ✅ Static asset caching (1 year)
- ✅ Security headers configured
- ✅ Health checks included
- ✅ Minimal image size (~45MB)
- ✅ Auto-restart on failure

## 📊 Container Management

### Check Status
```bash
docker ps
docker-compose ps
```

### View Logs
```bash
docker logs super-mario-game
docker-compose logs -f mario-game
```

### Restart Container
```bash
docker restart super-mario-game
docker-compose restart
```

### Execute Commands in Container
```bash
docker exec -it super-mario-game sh
```

### Health Check
```bash
docker inspect --format='{{.State.Health.Status}}' super-mario-game
```

## 🔧 Configuration

### Change Port

**docker-compose.yml:**
```yaml
ports:
  - "3000:80"  # Change 3000 to your desired port
```

**Docker CLI:**
```bash
docker run -d -p 3000:80 mario-game:latest
```

### Environment Variables

Add to docker-compose.yml:
```yaml
environment:
  - NGINX_HOST=yourdomain.com
  - NGINX_PORT=80
```

### Custom Nginx Config

Edit `nginx.conf` before building:
- Change cache duration
- Add SSL configuration
- Modify security headers
- Add custom redirects

## 🌍 Production Deployment

### With Custom Domain

**docker-compose.yml:**
```yaml
services:
  mario-game:
    # ... existing config
    environment:
      - VIRTUAL_HOST=mario.yourdomain.com
      - LETSENCRYPT_HOST=mario.yourdomain.com
      - LETSENCRYPT_EMAIL=you@email.com
```

### With SSL/HTTPS

Add to nginx.conf:
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    # ... rest of config
}
```

Mount certificates:
```yaml
volumes:
  - ./certs:/etc/ssl/certs:ro
  - ./keys:/etc/ssl/private:ro
```

### Behind Reverse Proxy

If using Traefik/Nginx Proxy:
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.mario.rule=Host(`mario.yourdomain.com`)"
  - "traefik.http.services.mario.loadbalancer.server.port=80"
```

## 📈 Scaling

### Multiple Replicas
```bash
docker-compose up -d --scale mario-game=3
```

### With Load Balancer
```yaml
services:
  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      - mario-game
      
  mario-game:
    deploy:
      replicas: 3
```

## 🧹 Cleanup

### Remove Container
```bash
docker-compose down
```

### Remove Images
```bash
docker-compose down --rmi all
```

### Remove Everything (including volumes)
```bash
docker-compose down --rmi all --volumes
docker system prune -af
```

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs mario-game

# Check if port is in use
lsof -i :8080

# Verify image built correctly
docker images | grep mario-game
```

### Can't Access Game
```bash
# Check container is running
docker ps | grep mario-game

# Check port mapping
docker port super-mario-game

# Test from inside container
docker exec -it super-mario-game wget -O- http://localhost/
```

### Performance Issues
```bash
# Check resource usage
docker stats super-mario-game

# Increase resources in Docker Desktop settings
# Or add resource limits to docker-compose.yml
```

## 📦 Docker Hub Deployment

### Tag and Push
```bash
# Tag image
docker tag mario-game:latest username/mario-game:latest
docker tag mario-game:latest username/mario-game:1.0

# Push to Docker Hub
docker push username/mario-game:latest
docker push username/mario-game:1.0
```

### Pull and Run from Docker Hub
```bash
docker pull username/mario-game:latest
docker run -d -p 8080:80 username/mario-game:latest
```

## 🚢 Cloud Deployment

### AWS ECS
```bash
# Create ECR repository
aws ecr create-repository --repository-name mario-game

# Tag and push
docker tag mario-game:latest ACCOUNT.dkr.ecr.REGION.amazonaws.com/mario-game:latest
docker push ACCOUNT.dkr.ecr.REGION.amazonaws.com/mario-game:latest
```

### Google Cloud Run
```bash
# Tag and push to GCR
docker tag mario-game:latest gcr.io/PROJECT-ID/mario-game:latest
docker push gcr.io/PROJECT-ID/mario-game:latest

# Deploy
gcloud run deploy mario-game --image gcr.io/PROJECT-ID/mario-game:latest
```

### Azure Container Instances
```bash
# Create container
az container create \
  --resource-group myResourceGroup \
  --name mario-game \
  --image mario-game:latest \
  --ports 80
```

## 📋 Useful Commands

```bash
# View all images
docker images

# View all containers
docker ps -a

# Stop all containers
docker stop $(docker ps -q)

# Remove all stopped containers
docker container prune -f

# View container resource usage
docker stats

# Export image as tar
docker save mario-game:latest > mario-game.tar

# Import image from tar
docker load < mario-game.tar
```

## 🎯 Best Practices

1. **Use .dockerignore** - Minimize build context
2. **Multi-stage builds** - Keep final image small
3. **Health checks** - Ensure container is healthy
4. **Resource limits** - Prevent resource exhaustion
5. **Security scanning** - Check for vulnerabilities
6. **Version tags** - Don't rely on `latest` in production
7. **Environment configs** - Use env vars for configuration
8. **Logging** - Centralize logs for debugging

## 🔒 Security

### Scan for Vulnerabilities
```bash
docker scan mario-game:latest
```

### Run as Non-Root (Enhanced Dockerfile)
```dockerfile
RUN addgroup -g 1000 mario && \
    adduser -D -u 1000 -G mario mario
USER mario
```

### Read-Only Filesystem
```yaml
security_opt:
  - no-new-privileges:true
read_only: true
tmpfs:
  - /tmp
  - /var/cache/nginx
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)

---

## ✅ Verification Checklist

After deployment, verify:
- [ ] Container is running: `docker ps`
- [ ] Health check passes: `docker inspect super-mario-game`
- [ ] Game accessible at http://localhost:8080
- [ ] No errors in logs: `docker logs super-mario-game`
- [ ] Resource usage normal: `docker stats`

---

**Enjoy your dockerized Mario game! 🐳🍄**

