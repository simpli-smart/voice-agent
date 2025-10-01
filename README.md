# Simplismart Voice Agent

A real-time voice AI assistant built by Simplismart using Pipecat, featuring WebRTC-based audio streaming, speech-to-text, large language model processing, and text-to-speech capabilities.

## Features

- 🎤 **Real-time Voice Interaction**: WebRTC-based audio streaming for low-latency communication
- 🗣️ **Speech-to-Text**: Powered by Whisper Large V3 Turbo for accurate transcription
- 🤖 **AI Assistant**: Uses Gemma 3 1B model for intelligent responses
- 🔊 **Text-to-Speech**: Kokoro TTS for natural-sounding voice synthesis
- 🌐 **Web Interface**: Modern React-based frontend with real-time metrics
- 📊 **Metrics & Monitoring**: Built-in performance tracking and visualization

## Architecture

The voice agent uses a pipeline architecture:
```
Audio Input → STT → LLM Context → LLM → TTS → Audio Output
```

- **Transport Layer**: SmallWebRTC for real-time audio streaming
- **STT Service**: SimplismartSTTService with Whisper Large V3 Turbo
- **LLM Service**: OpenAI-compatible service with Gemma 3 1B model
- **TTS Service**: OpenAI-compatible service with Kokoro TTS
- **Context Management**: OpenAI LLM Context for conversation history
- **RTVI Protocol**: Real-time voice interaction protocol for synchronization

## Installation

**Prerequisites**: Python 3.8+, Node.js 16+, npm

### Option 1: Automated Installation (Recommended)

The easiest way to install the Simplismart Voice Agent is using the provided installation script:

```bash
# Clone the Simplismart Voice Agent repository
git clone https://github.com/simpli-smart/voice-agent.git
cd voice-agent

# Make the install script executable (macOS/Linux)
chmod +x install.sh

# Run the installation script
./install.sh
```

### Option 2: Manual Installation

If you prefer to install manually or need to customize the installation:

#### Step 1: Install Python Dependencies

```bash
# Install pipecat with required dependencies
pip install "git+https://github.com/simpli-smart/pipecat.git@main#egg=pipecat-ai[websockets-base,openai,anthropic]"

# Install additional requirements
pip install -r requirements.txt
```

#### Step 2: Build Frontend

```bash
# Navigate to frontend client directory
cd frontend/client

# Install Node.js dependencies
npm install

# Build the frontend
npm run build

# Return to project root
cd ../..
```

#### Step 3: Install Voice Agent Package

```bash
# Install the voice-agent package in development mode
cd frontend
pip install -e .
cd ..
```

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following configuration:

```bash
# API Configuration
API_KEY=your_api_key_here

# Service URLs (optional - defaults provided)
STT_BASE_URL=https://http.whisper-large-v3-turbo.yotta-infrastructure.on-prem.clusters.s9t.link
TTS_BASE_URL=https://http.kokoro-tts-Simplismart.yotta-infrastructure.on-prem.clusters.s9t.link/v1
LLM_BASE_URL=https://http.gemma-3-1b-Simplismart-proxy.yotta-infrastructure.on-prem.clusters.s9t.link
```

### API Key Setup

The Simplismart Voice Agent requires an API key for accessing the AI services. 

## Running the Application

### Development Mode

```bash
# Run with default settings (localhost:7860)
python app.py

# Run with custom host and port
python app.py --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
# Using uvicorn directly for production
uvicorn app:app --host 0.0.0.0 --port 7860 --workers 1
```

### Command Line Options

- `--host`: Host for HTTP server (default: localhost)
- `--port`: Port for HTTP server (default: 7860)

## Usage

1. **Start the Application**: Run the Simplismart Voice Agent using one of the methods above
2. **Open Web Interface**: Navigate to `http://localhost:7860` in your browser
3. **Grant Permissions**: Allow microphone access when prompted
4. **Start Conversation**: Click the microphone button to begin voice interaction with Simplismart AI
5. **Monitor Metrics**: Use the metrics panel to view real-time performance data

## Project Structure

```
voice-agent/
├── app.py                 # Main Simplismart Voice Agent FastAPI application
├── requirements.txt       # Python dependencies
├── install.sh            # Automated installation script
├── README.md             # This file
├── .env                  # Environment configuration (create this)
└── frontend/             # Simplismart frontend package
    ├── client/           # React frontend source
    │   ├── src/          # React components and logic
    │   ├── public/       # Static assets
    │   ├── package.json  # Node.js dependencies
    │   └── dist/         # Built frontend (generated)
    ├── pipecat_ai_small_webrtc_prebuilt/  # Python package
    ├── pyproject.toml    # Package configuration
    └── setup.py          # Package setup script
```

## API Endpoints

- `GET /`: Redirects to the web interface
- `GET /client/`: Web interface (React app)
- `POST /api/offer`: WebRTC offer endpoint for establishing connections

## Development

### Making Changes

1. **Backend Changes**: Modify `app.py` and restart the server
2. **Frontend Changes**: 
   ```bash
   cd frontend/client
   npm run dev  # For development server
   # OR
   npm run build  # For production build
   ```

### Testing

```bash
# Run the Simplismart Voice Agent in test mode
python app.py --host localhost --port 7860

# Test the API endpoints
curl http://localhost:7860/
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Support

For support and questions:
1. Review the [Pipecat documentation](https://github.com/pipecat-ai/pipecat)
2. Open an issue in the repository

## Acknowledgments

- Built by [Simplismart](https://github.com/simpli-smart) using [Pipecat](https://github.com/pipecat-ai/pipecat) - Real-time AI voice framework
- Uses [FastAPI](https://fastapi.tiangolo.com/) for the web server
- Frontend built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- WebRTC implementation for real-time audio streaming
- Powered by Simplismart's AI infrastructure and services