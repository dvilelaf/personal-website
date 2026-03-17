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

# Redeploy the stack in Portainer
redeploy:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "🚀 Deploying to Portainer..."
    env_array=$(jq -n \
        --arg port "${PORT:-8090}" \
        '[{name: "PORT", value: $port}]')
    response=$(curl -s -X PUT "${PORTAINER_URL_ROBALEIRA}/api/stacks/${WEBSITE_STACK_ID}?endpointId=${PORTAINER_ENDPOINT_ID_ROBALEIRA}" \
        -H "X-API-Key: ${PORTAINER_API_TOKEN_ROBALEIRA}" \
        -H "Content-Type: application/json" \
        -d "$(jq -n --arg content "$(cat docker-compose.portainer.yml)" --argjson env "$env_array" '{stackFileContent: $content, Env: $env, pullImage: true, prune: false}')")
    if echo "$response" | jq -e '.Id' > /dev/null 2>&1; then
        echo "✅ Deploy complete!"
    else
        echo "❌ FAILED: $(echo "$response" | jq -r '.message // .details // "Unknown error"')"
        exit 1
    fi

# Build, push and deploy to Portainer
deploy: build push redeploy
