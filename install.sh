#!/bin/bash

# Exit on error
set -e

echo "=========================================="
echo "Voice Agent Installation Script"
echo "=========================================="
echo ""

# Install pipecat with dependencies
echo "📦 Installing pipecat with dependencies..."
pip install "git+https://github.com/simpli-smart/pipecat.git@main#egg=pipecat-ai[websockets-base,openai,anthropic]"
pip install -r requirements.txt
echo "✅ Pipecat and its dependencies installed"
echo ""

# Navigate to frontend/client and build
echo "🔨 Building frontend..."
cd frontend/client
npm install
npm run build
echo "✅ Frontend built successfully"
echo ""

# Go back and install the package
echo "📦 Installing voice-agent package..."
cd ..
pip install -e .
echo "✅ Voice-agent package installed"
echo ""

echo "=========================================="
echo "✨ Installation complete!"
echo "=========================================="

