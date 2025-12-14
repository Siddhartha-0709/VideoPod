# Video Processing SaaS

A full-stack SaaS application for intelligent video processing, featuring compression, stabilization, and AI-powered key moment extraction.

## 🚀 Key Features

- **Video Compression**: Achieve up to 60% reduction in video file size while maintaining quality
- **Video Stabilization**: Smooth out shaky footage for professional-looking results
- **AI Key Moment Extraction**: Automatically identify and extract important moments from videos using AI analysis
- **Scalable Architecture**: Optimized for handling multiple concurrent video processing tasks

## 📊 Performance

- **Average Compression**: 60% reduction in video size
- **Test Coverage**: Successfully processed 15+ test videos
- **Resource Efficiency**: Optimized for resource-constrained Docker environments
- **Production Ready**: Deployed and tested on DigitalOcean infrastructure

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework for building responsive interfaces

### Backend
- **Node.js** - Server-side runtime for handling API requests and video processing
- **FFmpeg** - Core video processing engine for compression and stabilization
- **VOSK** - Speech recognition for audio analysis
- **Gemini API** - AI-powered analysis for key moment detection

### Infrastructure
- **Docker** - Containerization for consistent deployment
- **NGINX** - Reverse proxy and load balancing
- **DigitalOcean** - Cloud hosting platform

## 🏗️ Architecture

The application follows a microservices architecture with containerized components:

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React.js  │ ───> │    NGINX     │ ───> │   Node.js   │
│   Frontend  │      │ Reverse Proxy│      │   Backend   │
└─────────────┘      └──────────────┘      └─────────────┘
                                                   │
                                                   ├─> FFmpeg
                                                   ├─> VOSK
                                                   └─> Gemini API
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- FFmpeg installed locally (for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/video-processing-saas.git
cd video-processing-saas
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run with Docker:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

## 📝 Environment Variables

```env
# Backend
NODE_ENV=production
PORT=5000
GEMINI_API_KEY=your_gemini_api_key

# Frontend
REACT_APP_API_URL=http://localhost:5000

# Docker
DOCKER_MEMORY_LIMIT=2g
DOCKER_CPU_LIMIT=2
```

## 🎯 Usage

1. **Upload Video**: Select a video file from your device
2. **Choose Processing Options**:
   - Enable compression for smaller file sizes
   - Apply stabilization for smoother playback
   - Enable AI analysis for key moment extraction
3. **Process**: Click process and wait for the optimized video
4. **Download**: Download the processed video and key moments report

## 🔧 Configuration

### FFmpeg Optimization

The application uses optimized FFmpeg settings for resource-constrained environments:

- H.264 codec with CRF 23 for compression
- 2-pass encoding for better quality
- Hardware acceleration when available

### CPU/RAM Optimization

- Containerized resource limits to prevent memory overflow
- Queue-based processing to handle multiple videos
- Automatic cleanup of temporary files

## 📈 Performance Optimization

- **Compression**: Utilizes H.264 codec with optimized CRF values
- **Parallel Processing**: Handles multiple videos concurrently with queue management
- **Caching**: Implements caching strategies for faster repeated processing
- **Resource Management**: CPU and RAM limits configured for optimal performance

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- FFmpeg community for the powerful video processing library
- VOSK team for speech recognition capabilities
- Google Gemini for AI-powered analysis

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/video-processing-saas](https://github.com/yourusername/video-processing-saas)

---

⭐ Star this repository if you find it helpful!
