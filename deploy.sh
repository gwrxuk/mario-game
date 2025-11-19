#!/bin/bash

# Super Mario Game - Docker Deployment Script
# Quick deployment script for the dockerized game

set -e

echo "🍄 Super Mario Game - Docker Deployment"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Please install Docker from https://www.docker.com/get-started"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo "Please start Docker Desktop or Docker daemon"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Function to display menu
show_menu() {
    echo "Select an option:"
    echo "1) Build and run with docker-compose (recommended)"
    echo "2) Build Docker image only"
    echo "3) Run existing image"
    echo "4) Stop and remove containers"
    echo "5) View logs"
    echo "6) Clean up (remove images and containers)"
    echo "7) Exit"
    echo ""
}

# Function to build and run with docker-compose
docker_compose_up() {
    echo -e "${YELLOW}Building and starting with docker-compose...${NC}"
    docker-compose up -d --build
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Game is now running!${NC}"
        echo ""
        echo "🎮 Play the game at: http://localhost:8080"
        echo "📱 Mobile: http://$(hostname -I | awk '{print $1}'):8080"
        echo ""
        echo "To stop: docker-compose down"
        echo "To view logs: docker-compose logs -f"
    else
        echo -e "${RED}❌ Failed to start containers${NC}"
        exit 1
    fi
}

# Function to build image
build_image() {
    echo -e "${YELLOW}Building Docker image...${NC}"
    docker build -t mario-game:latest .
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Image built successfully!${NC}"
        echo "Image: mario-game:latest"
    else
        echo -e "${RED}❌ Failed to build image${NC}"
        exit 1
    fi
}

# Function to run container
run_container() {
    echo -e "${YELLOW}Starting container...${NC}"
    docker run -d \
        --name super-mario-game \
        -p 8080:80 \
        --restart unless-stopped \
        mario-game:latest
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Container started!${NC}"
        echo "🎮 Play at: http://localhost:8080"
    else
        echo -e "${RED}❌ Failed to start container${NC}"
        exit 1
    fi
}

# Function to stop containers
stop_containers() {
    echo -e "${YELLOW}Stopping containers...${NC}"
    docker-compose down
    docker stop super-mario-game 2>/dev/null || true
    docker rm super-mario-game 2>/dev/null || true
    echo -e "${GREEN}✅ Containers stopped${NC}"
}

# Function to view logs
view_logs() {
    echo -e "${YELLOW}Viewing logs (Ctrl+C to exit)...${NC}"
    docker-compose logs -f || docker logs -f super-mario-game
}

# Function to clean up
cleanup() {
    echo -e "${YELLOW}Cleaning up Docker resources...${NC}"
    read -p "This will remove all containers and images. Continue? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down --rmi all --volumes
        docker rmi mario-game:latest 2>/dev/null || true
        docker system prune -f
        echo -e "${GREEN}✅ Cleanup complete${NC}"
    else
        echo "Cleanup cancelled"
    fi
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice [1-7]: " choice
    echo ""
    
    case $choice in
        1)
            docker_compose_up
            break
            ;;
        2)
            build_image
            ;;
        3)
            run_container
            break
            ;;
        4)
            stop_containers
            ;;
        5)
            view_logs
            ;;
        6)
            cleanup
            ;;
        7)
            echo "Goodbye! 🍄"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
    
    echo ""
done

