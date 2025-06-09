MediHelper

MediHelper is an AI-powered medical assistant designed to generate structured health summaries, enable voice-based transcription, perform intelligent web searches, and integrate with Google Calendar for follow-up scheduling. It leverages cutting-edge technologies like Snowflake LLM and SerpAPI for natural language tasks and medical data retrieval.

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://python.org/)


Features

1. Health Summary Generation
• Converts raw clinical text into concise and informative health summaries using Snowflake LLM.
• Summaries are suitable for EHR inputs or patient briefings.
![Health Summary Screenshot](screenshots/summary.jpg)

2. Voice Input Transcription
• Transcribes spoken medical notes to structured text using Deepgram.
• Useful for hands-free operation in a clinical setting.
![Voice Input Screenshot](screenshots/voice.jpg)

3. Intelligent Web Search
• Uses SerpAPI to perform real-time medical or drug-related queries.
• Retrieves up-to-date contextual information for patient care.
![Intelligent Web Search Screenshot](screenshots/SerpAPI.jpg)

4. Google Calendar Integration
• Automatically creates follow-up events for appointments or tests.
• Simplifies medical workflow automation.
![Google Calendar Screenshot](screenshots/calendar.jpg)

5. Language Support & Translation
• Allows users to translate medical summaries or instructions into the patient’s preferred language.
• Enhances accessibility for non-English-speaking users.
• Useful in multilingual healthcare environments.
![Language Support Screenshot](screenshots/Multilingual.jpg)

🧰 Tech Stack
• Backend: FastAPI, Uvicorn
• Frontend: React.js (with Vite)
• AI Models: Snowflake Cortex LLM, SerpAPI
• Voice Processing: Deepgram API
• Scheduling: Google Calendar API
• Environment: Virtualenv (venv)

Setup Instructions
1. Clone the repository:
   git clone https://github.com/PriyankaWani66/medihelper.git

2. Navigate to the backend folder and set up the backend (FastAPI):
   cd medihelper/backend
   python -m venv .venv
   source .venv/bin/activate  (Use .venv\Scripts\activate on Windows)
   pip install -r requirements.txt

3. Set up the .env file with the following variables:
    # Snowflake Configuration
    SNOWFLAKE_USER=your_username
    SNOWFLAKE_PASSWORD=your_password
    SNOWFLAKE_ACCOUNT=your_account_identifier
    SNOWFLAKE_WAREHOUSE=your_warehouse
    SNOWFLAKE_DATABASE=your_database
    SNOWFLAKE_SCHEMA=your_schema
    # API Keys
    SERPAPI_API_KEY=your_serpapi_key
    DEEPGRAM_API_KEY=your_deepgram_key

4. Run the backend server:
   uvicorn app:app --reload

5. Set up the frontend (React + Vite)
   cd medihelper/frontend
   npm install
   npm run dev


📁 Project Structure
```
medihelper/
├── 📂 backend/
│   ├── 🐍 app.py               # FastAPI application entry point
│   ├── 🧠 summarizer.py        # AI-powered text summarization
│   ├── 📊 extractor.py         # Data extraction and structuring
│   ├── 🎙️ voice_api.py         # Voice processing with Deepgram
│   ├── 🧪 test_summary.py      # Unit tests for summary module
│   ├── 📋 requirements.txt     # Python dependencies
│   └── 🔐 .env                 # Environment variables
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/      # React components
│   │   │   ├── 📝 SummaryForm.jsx
│   │   │   ├── 🎤 VoiceRecorder.jsx
│   │   │   └── 📅 CalendarIntegration.jsx
│   │   └── 📂 utils/           # Helper functions
│   ├── 📦 package.json         # Node.js dependencies
│   └── ⚙️ vite.config.js       # Vite configuration
├── 📸 screenshots/             # Documentation images
├── 📖 README.md               # Project documentation
└── 📄 LICENSE                 # License information
```

Future Improvements
- Personalized Preventive Care Alerts
  - AI-driven patient history analysis
  - Predictive healthcare recommendations
  - Automated screening reminders
  - Risk stratification algorithms

- Enhanced Patient Portal Integration
  - Connect with existing patient portals and EHR systems
  - Import and organize existing health records
  - Seamless data synchronization across platforms

- Health Goal Tracking
  - Set and monitor personal health objectives
  - Track medication adherence and lifestyle changes
  - Progress visualization and achievement rewards

- Family Health Management
  - Manage health information for family members
  - Shared calendars for family medical appointments
  - Emergency health information access



# MediHelper 🏥

> An AI-powered personal health assistant that empowers patients to take control of their healthcare through intelligent documentation, research, and appointment management.

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)](https://python.org/)

## 🚀 Overview

MediHelper empowers patients to take control of their healthcare journey by providing intelligent tools for health documentation, medical research, and appointment management. Designed for individuals who want to be active participants in their healthcare, it transforms how patients prepare for doctor visits, track their health information, and stay informed about their conditions.

Key Features

1. Personal Health Summaries
- Transform your scattered health notes into clear, structured summaries
- Prepare organized information for doctor visits and medical consultations
- Track your health journey over time with AI-powered organization

![Health Summary](screenshots/summary.jpg)

2. Voice Health Journaling
- Record health symptoms, medication effects, and daily health observations
- Hands-free documentation ideal for patients with mobility challenges
- Medical terminology recognition for accurate health tracking
- Perfect for creating health diaries and symptom logs

![Voice Input](screenshots/voice.jpg)

### 🔍 **Personal Health Research**
- Search for reliable medical information about your conditions
- Get up-to-date information about medications and treatments
- Research symptoms and health topics from trusted sources
- Prepare informed questions for your healthcare providers

![Web Search](screenshots/SerpAPI.jpg)

### 📅 **Health Appointment Management**
- Never miss important medical appointments or follow-ups
- Automatic reminders for medication schedules and health check-ups
- Organize your healthcare calendar in one place
- Track appointment history and upcoming visits

![Calendar Integration](screenshots/calendar.jpg)

### 🌐 **Multilingual Health Support**
- Translate health information into your preferred language
- Access medical information in multiple languages
- Bridge language barriers in healthcare settings
- Support for diverse patient communities worldwide

![Language Support](screenshots/Multilingual.jpg)

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Backend** | FastAPI, Uvicorn |
| **Frontend** | React.js, Vite |
| **AI/ML** | Snowflake Cortex LLM, SerpAPI |
| **Voice Processing** | Deepgram API |
| **Integration** | Google Calendar API |
| **Environment** | Python Virtual Environment |

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/PriyankaWani66/medihelper.git
cd medihelper
```

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:

```env
# Snowflake Configuration
SNOWFLAKE_USER=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_ACCOUNT=your_account_identifier
SNOWFLAKE_WAREHOUSE=your_warehouse
SNOWFLAKE_DATABASE=your_database
SNOWFLAKE_SCHEMA=your_schema

# API Keys
SERPAPI_API_KEY=your_serpapi_key
DEEPGRAM_API_KEY=your_deepgram_key

```

### 4. Start Backend Server
```bash
cd ../backend

uvicorn app:app --reload
```
Backend will be available at `http://localhost:8000`

### 5. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
medihelper/
├── 📂 backend/
│   ├── 🐍 app.py               # FastAPI application entry point
│   ├── 🧠 summarizer.py        # AI-powered text summarization
│   ├── 📊 extractor.py         # Data extraction and structuring
│   ├── 🎙️ voice_api.py         # Voice processing with Deepgram
│   ├── 🧪 test_summary.py      # Unit tests for summary module
│   ├── 📋 requirements.txt     # Python dependencies
│   └── 🔐 .env                 # Environment variables
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/      # React components
│   │   │   ├── 📝 SummaryForm.jsx
│   │   │   ├── 🎤 VoiceRecorder.jsx
│   │   │   └── 📅 CalendarIntegration.jsx
│   │   └── 📂 utils/           # Helper functions
│   ├── 📦 package.json         # Node.js dependencies
│   └── ⚙️ vite.config.js       # Vite configuration
├── 📸 screenshots/             # Documentation images
├── 📖 README.md               # Project documentation
└── 📄 LICENSE                 # License information
```

## 🔮 Future Roadmap

### 🎯 Upcoming Features

- **Personalized Preventive Care Alerts**
  - AI-driven patient history analysis
  - Predictive healthcare recommendations
  - Automated screening reminders
  - Risk stratification algorithms

- **Enhanced Patient Portal Integration**
  - Connect with existing patient portals and EHR systems
  - Import and organize existing health records
  - Seamless data synchronization across platforms

- **Health Goal Tracking**
  - Set and monitor personal health objectives
  - Track medication adherence and lifestyle changes
  - Progress visualization and achievement rewards

- **Family Health Management**
  - Manage health information for family members
  - Shared calendars for family medical appointments
  - Emergency health information access
---

