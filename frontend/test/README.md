# Pipecat Prebuilt Test App

This is a simple example app to help you test your Pipecat bot with a prebuilt UI and a basic Python backend.

---

## 🚀 Setup

1. **Create and activate a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

2. **Install dependencies:**

    ```bash
    # Install the Pipecat prebuilt UI package
    pip install -e ../

    # Install additional requirements
    pip install -r requirements.txt
    ```

3. **Set up environment variables:**

    ```bash
    cp env.example .env
    ```

4. **Add API keys** to your `.env` file for:

    - Google (e.g., for Speech-to-Text or other services)

---

## ▶️ Run the Example

Once setup is complete, start the app with:

```bash
python run.py
```

## 🎉 Test with SmallWebRTC Prebuilt UI

Open your browser and navigate to:
👉 http://localhost:7860
  - (Or use your custom port, if configured)
