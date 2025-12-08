# Justfile for Personal Website

set dotenv-load

# Build the Docker image
build:
    docker compose build

# Start the Docker container
up:
    docker compose up -d

# Stop the Docker container
down:
    docker compose down

# View Docker logs
logs:
    docker compose logs -f

# Restart the Docker container
restart: down up

# Push the Docker image
push:
    docker compose push

# Build and push
ship: build push

# Serve locally without Docker
serve-local port="8090":
    cd src && python3 -m http.server {{port}}
