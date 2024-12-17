# Use a lightweight Python base image
FROM python:3.10-slim

# Install required system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3-venv ffmpeg nodejs npm && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create and activate a Python virtual environment 
RUN python3 -m venv /env
RUN /env/bin/pip install --upgrade pip


# Install Python dependencies
COPY requirements.txt /app/
RUN /env/bin/pip install -r /app/requirements.txt

# Install npm dependencies
COPY . /app/
WORKDIR /app
RUN npm install

# Add the virtual environment to PATH
ENV PATH="/env/bin:$PATH"

# Ensure necessary scripts and files are executable
RUN chmod +x /app/audio_transcribe.py

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
