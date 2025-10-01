#
# Copyright (c) 2024–2025, Daily
#
# SPDX-License-Identifier: BSD 2-Clause License
#

import argparse
import asyncio
import os
from contextlib import asynccontextmanager
from typing import Dict

import uvicorn
from dotenv import load_dotenv
from fastapi import BackgroundTasks, FastAPI
from fastapi.responses import RedirectResponse
from loguru import logger
from pipecat_ai_small_webrtc_prebuilt.frontend import SmallWebRTCPrebuiltUI

from pipecat.audio.turn.smart_turn.base_smart_turn import SmartTurnParams
from pipecat.audio.turn.smart_turn.local_smart_turn_v3 import LocalSmartTurnAnalyzerV3
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.audio.vad.vad_analyzer import VADParams
from pipecat.frames.frames import LLMRunFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.openai_llm_context import OpenAILLMContext
from pipecat.services.openai.stt import OpenAISTTService
from pipecat.services.openai.tts import OpenAITTSService
from pipecat.services.openai.llm import OpenAILLMService
from pipecat.services.tensorrt.stt import SimplismartSTTService
from pipecat.transports.base_transport import TransportParams
from pipecat.transports.smallwebrtc.connection import SmallWebRTCConnection
from pipecat.transports.smallwebrtc.transport import SmallWebRTCTransport
from pipecat.processors.aggregators.llm_response import LLMUserAggregatorParams
from pipecat.processors.frameworks.rtvi import RTVIConfig, RTVIObserver, RTVIProcessor

load_dotenv(override=True)

# Configuration from environment variables
STT_BASE_URL = os.getenv("STT_BASE_URL", "https://http.whisper-large-v3-turbo.yotta-infrastructure.on-prem.clusters.s9t.link")
TTS_BASE_URL = os.getenv("TTS_BASE_URL", "https://http.kokoro-tts-simplismart.yotta-infrastructure.on-prem.clusters.s9t.link/v1") 
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://http.gemma-3-1b-simplismart-proxy.yotta-infrastructure.on-prem.clusters.s9t.link")
API_KEY = os.getenv("API_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTgyYTUxNzYtYjliYi00NzA3LWEwM2QtMjM3OWFjZGRjNTg5IiwiZXhwIjoxNzU5ODIxODI4LCJvcmdfdXVpZCI6IjQ0NGI3ODYxLWIxZGYtNDE4Ni05NzdiLTdjNDMxZjNiMDIwOCJ9.Tdk9quBllTAP4clfTmEe4P4x3K_7-5GLsZJ-QBHRF5Q")

# Store connections by pc_id
pcs_map: Dict[str, SmallWebRTCConnection] = {}

# Lifespan for the app.
@asynccontextmanager
async def lifespan(app: FastAPI):
    yield  # Run app
    coros = [pc.close() for pc in pcs_map.values()]
    await asyncio.gather(*coros)
    pcs_map.clear()

app = FastAPI(lifespan=lifespan)

ice_servers = [
    "stun:stun.l.google.com:19302"  # Config for web rtc
]

# Mount the frontend at /
app.mount("/client", SmallWebRTCPrebuiltUI)  # Modified pipecat ui component


async def run_example_english(webrtc_connection: SmallWebRTCConnection):
    logger.info(f"Starting bot")

    # Create a transport using the WebRTC connection
    transport = SmallWebRTCTransport(
        webrtc_connection=webrtc_connection,
        params=TransportParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            vad_analyzer=SileroVADAnalyzer(params=VADParams()),  # To handle silence and interruptions
            audio_in_sample_rate=16000  # In hertz
        ),
    )

    stt = SimplismartSTTService(api_key=API_KEY, base_url=STT_BASE_URL)

    tts = OpenAITTSService(api_key=API_KEY, model="kokoro", voice="alloy", base_url=TTS_BASE_URL)

    llm = OpenAILLMService(model="gemma3_1b", api_key=API_KEY, base_url=LLM_BASE_URL)

    messages = [
        {
            "role": "system",
            "content": "You are a helpful AI Assistant voice bot. Don't use any emojis or special characters",
        },
    ]
    
    # Handles chat history / context
    context = OpenAILLMContext(messages)
    context_aggregator = llm.create_context_aggregator(
        context,
        user_params=LLMUserAggregatorParams(aggregation_timeout=0.2),)  # Time to wait before llm starts responding
    
    # Pipecat's real time voice protocol
    # It handles the synchronization of user and bot interactions, transcriptions, LLM processing, and text-to-speech delivery.
    rtvi = RTVIProcessor(config=RTVIConfig(config=[]))

    pipeline = Pipeline(
        [
            transport.input(),  # Transport user input (microphone)
            rtvi,  # Pipecat's real time voice protocol
            stt,  
            context_aggregator.user(),  # Aggregate chat from user
            llm,  # LLM
            tts,  # TTS
            transport.output(),  # Transport bot output
            context_aggregator.assistant(),  # Aggregrate chat from assistant
        ]
    )
    
    # Adding pipeline configs
    task = PipelineTask(
        pipeline,
        params=PipelineParams(
            enable_metrics=True,
            enable_usage_metrics=True,
        ),
        observers=[RTVIObserver(rtvi)]
    )

    @transport.event_handler("on_client_connected")
    async def on_client_connected(transport, client):
        logger.info(f"Client connected")


    @transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, client):
        logger.info(f"Client disconnected")
        await task.cancel()

    runner = PipelineRunner(handle_sigint=False)  # This is false for uvicorn to handle ctrl+c interruptions

    await runner.run(task)
    
    


@app.get("/", include_in_schema=False)
async def root_redirect():
    return RedirectResponse(url="/client/")


@app.post("/api/offer")
async def offer(request: dict, background_tasks: BackgroundTasks):
    pc_id = request.get("pc_id")
    
    logger.info(f"Received offer request with pc_id: {pc_id}")

    # Check if we already have a connection for this pc_id
    if pc_id and pc_id in pcs_map:
        logger.info(f"Returning existing connection for pc_id: {pc_id}")
        return pcs_map[pc_id].get_answer()

    # Create a fresh connection
    pipecat_connection = SmallWebRTCConnection(ice_servers)
    await pipecat_connection.initialize(sdp=request["sdp"], type=request["type"])

    @pipecat_connection.event_handler("closed")
    async def handle_disconnected(webrtc_connection: SmallWebRTCConnection):
        logger.info(f"Discarding peer connection for pc_id: {webrtc_connection.pc_id}")
        pcs_map.pop(webrtc_connection.pc_id, None)
    
    @pipecat_connection.event_handler("connected")
    async def handle_connected(webrtc_connection: SmallWebRTCConnection):
        logger.info(f"WebRTC connection established for pc_id: {webrtc_connection.pc_id}")
    
    @pipecat_connection.event_handler("failed")
    async def handle_failed(webrtc_connection: SmallWebRTCConnection):
        logger.error(f"WebRTC connection failed for pc_id: {webrtc_connection.pc_id}")
        pcs_map.pop(webrtc_connection.pc_id, None)

    # Run example function with SmallWebRTC transport arguments.
    background_tasks.add_task(run_example_english, pipecat_connection)

    answer = pipecat_connection.get_answer()
    # Updating the peer connection inside the map
    pcs_map[answer["pc_id"]] = pipecat_connection

    return answer


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pipecat Bot Runner")
    parser.add_argument(
        "--host", default="localhost", help="Host for HTTP server (default: localhost)"
    )
    parser.add_argument(
        "--port", type=int, default=7860, help="Port for HTTP server (default: 7860)"
    )
    args = parser.parse_args()

    uvicorn.run(app, host=args.host, port=args.port)