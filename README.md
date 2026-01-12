# AI Appointment Assistant - n8n Integration

A modern, beautiful chat interface for your n8n appointment scheduling workflow with support for text, audio (STT), and image (ITT) inputs.

## 🎨 Features

- **Modern UI/UX**: Clean, spacious design with ocean blue/cyan color scheme
- **Multi-Modal Input**: Support for text messages, audio files, and images
- **Message Splitting**: AI responses are displayed as multiple separate messages for better readability
- **Real-time Chat**: Smooth animations and typing indicators
- **File Attachments**: Easy drag-and-drop or click-to-upload for audio/image files
- **Session Management**: Fixed session ID for consistent conversation history

## 🏗️ Architecture

### Frontend (React)
- **Location**: `/app/frontend/`
- **Port**: 3000 (internal)
- **Tech Stack**: React, Tailwind CSS, Shadcn UI, Axios
- **Key Components**:
  - `ChatInterface.jsx` - Main chat UI
  - `MessageBubble.jsx` - Individual message display
  - `TypingIndicator.jsx` - Loading animation

### Backend (FastAPI)
- **Location**: `/app/backend/`
- **Port**: 8001 (internal)
- **Tech Stack**: FastAPI, Python, httpx
- **Key Endpoint**: `POST /api/chat` - Proxies requests to n8n webhook

### n8n Workflow
- **URL**: `https://sheemamasood.app.n8n.cloud/webhook/91ce612a-b844-474a-9991-2bec2ec8fc9e/chat`
- **Features**:
  - Redis message queueing
  - STT (Speech to Text) processing
  - ITT (Image to Text) processing
  - 3 AI Tools: Get Availability, Book Appointment, Book Follow-up
  - Supabase for persistent storage
  - Automated follow-up system (checks every minute)

## 🚀 Getting Started

### Prerequisites
1. Your n8n workflow must be **ACTIVATED IN PRODUCTION MODE**
2. Redis and Supabase must be configured in your n8n workflow

### Running the Application

The application is already running via supervisor:

```bash
# Check status
sudo supervisorctl status

# Restart if needed
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

## 📝 n8n Workflow Setup

### Important: Activate Your Workflow

⚠️ **Your n8n workflow must be activated in production mode!**

1. Open your n8n workflow editor
2. Click the toggle in the top-right corner to activate
3. Make sure the workflow is set to "Production" mode (not "Test" mode)

### Workflow Features

1. **Chat Trigger**: Receives messages via webhook
2. **Redis Queue**: Stores multiple messages for batch processing
3. **STT/ITT Processing**: Handles audio and image inputs
4. **AI Agent**: OpenAI GPT-4o-mini with structured output
5. **Memory**: Simple buffer window (10 messages)
6. **Tools**:
   - **Get Availability**: Check available appointment slots
   - **Book Appointment**: Schedule a new appointment
   - **Book Follow-up**: Schedule a future reminder
7. **Message Splitting**: Responses are split into multiple messages
8. **Follow-up System**: Automated check every minute via scheduled trigger

## 🎯 Usage

### Text Messages
Simply type your message and click send or press Enter.

### Audio Messages (STT)
1. Click the microphone icon
2. Select an audio file
3. The file will be processed through OpenAI Whisper (or similar)
4. Send the message

### Image Messages (ITT)
1. Click the image icon
2. Select an image file
3. The image will be processed through OpenAI Vision (or similar)
4. Send the message

### Example Conversations

**Check Availability:**
```
User: What are the available appointment slots for tomorrow?
AI: I found some available slots for you!
AI: We have openings at 9:00 AM, 10:00 AM, and 2:00 PM.
AI: Which time works best for you?
```

**Book Appointment:**
```
User: I'd like to book an appointment for tomorrow at 10:00 AM for a consultation
AI: Perfect! I've booked your appointment.
AI: Your appointment ID is APT-1234567890
AI: Consultation scheduled for tomorrow at 10:00 AM
```

**Schedule Follow-up:**
```
User: Can you follow up with me next week about this?
AI: Absolutely! I'll follow up with you.
AI: I've scheduled a reminder for [date] at [time]
AI: Is there anything specific you'd like me to mention in the follow-up?
```

## 🛠️ Technical Details

### Session Management
- Fixed session ID: `fixed-user-session`
- Stored in both frontend and n8n workflow
- Used for conversation history and follow-up tracking

### Message Flow
1. User sends message → Frontend
2. Frontend → Backend (`/api/chat`)
3. Backend → n8n Webhook (bypasses CORS)
4. n8n → Redis Queue
5. n8n → Process Messages
6. n8n → AI Agent (with tools)
7. n8n → Split Messages
8. Backend → Frontend
9. Frontend displays multiple message bubbles

### File Uploads
- Audio: `multipart/form-data` with `audio` field
- Image: `multipart/form-data` with `image` field
- Text: `chatInput` field

## 🎨 Design System

### Colors
- Primary: Cyan/Blue gradient (`from-cyan-500 to-blue-600`)
- Background: Light gradient (`from-slate-50 via-white to-cyan-50`)
- User messages: Dark slate (`slate-700/800`)
- AI messages: White with border

### Typography
- Headings: Manrope (600-800 weight)
- Body: Inter (300-700 weight)
- Size hierarchy: text-xl (heading), text-sm (messages), text-xs (metadata)

### Components
- Rounded corners: `rounded-xl` (12px)
- Shadows: Subtle for elevation
- Animations: Fade-in, slide-up, pulse
- Spacing: 2-3x normal for modern feel

## 🔧 Troubleshooting

### "n8n workflow error" message
- **Solution**: Activate your n8n workflow in production mode

### No response from AI
- Check if n8n workflow is running
- Verify Redis and Supabase connections
- Check n8n execution logs

### File upload not working
- Ensure file size is under n8n limits
- Check file format (audio/*, image/*)
- Verify n8n STT/ITT nodes are configured

### CORS errors
- Should not occur (backend proxies requests)
- If you see CORS errors, the frontend is not using the backend proxy

## 📦 Dependencies

### Frontend
```json
"axios": "^1.8.4"
"lucide-react": "^0.507.0"
"sonner": "^2.0.3"
"date-fns": "^4.1.0"
```

### Backend
```python
fastapi
httpx
python-multipart
motor
pymongo
```

## 🚀 Next Steps

1. **Activate n8n Workflow**: Make sure it's in production mode
2. **Test the Chat**: Send a message and verify the response
3. **Test Audio Upload**: Try the STT feature
4. **Test Image Upload**: Try the ITT feature
5. **Test Booking**: Try booking an appointment
6. **Test Follow-up**: Schedule a follow-up and wait for the automated reminder

## 📞 Support

If you encounter any issues:
1. Check n8n workflow activation
2. Verify Redis/Supabase configuration
3. Check supervisor logs: `sudo supervisorctl tail -f backend` or `frontend`
4. Review n8n execution logs

## 🎉 Credits

- **n8n**: Workflow automation
- **OpenAI**: AI model (GPT-4o-mini)
- **Shadcn UI**: Component library
- **Lucide**: Icon library
- **Redis**: Message queueing
- **Supabase**: Database storage

---

Made with ❤️ for modern appointment scheduling
