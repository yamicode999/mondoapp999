# Mondo - Our Digital Love Journey 💕

A personal web application celebrating our relationship through interactive features and shared memories.

## 🌟 Features

- **Countdown Timer**: Track moments until our next meeting
- **Time Together Calculator**: Measure our journey since July 20, 2023
- **Sweet Notes**: Share private messages and thoughts
- **Bucket List**: Plan our future adventures together
- **PIN Security**: Protect our private content (default: 0720)
- **Interactive Cats**: Cute animations to brighten our day

## 🛠 Responsive Design

Fully responsive across all devices:
- **Mobile**: Optimized for phones with touch-friendly controls
- **Tablet**: Adaptive layout for medium-sized screens
- **Desktop**: Full-featured experience for larger displays
- **Features**:
  - Dynamic grid layouts
  - Flexible containers
  - Touch-optimized buttons
  - Adaptive font sizes
  - Responsive spacing
  - Mobile-friendly scrolling

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: Firebase/Firestore
- **Deployment**: Vercel/Docker
- **Animations**: Lottie

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Environment Setup

1. Firebase Setup:
   - Create a Firebase project
   - Enable Firestore Database
   - Add your domain to authorized domains
   - Set up security rules

2. Local Development:
   - Clone the repository
   - Install dependencies
   - Create `.env` file if needed
   - Start development server

## 📦 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Deploy from dashboard

### Docker
```bash
# Build image
docker build -t mondo-app .

# Run container
docker run -p 80:80 mondo-app
```

## 🔒 Security

- Private sections protected by PIN
- Data stored in Firestore
- Firestore security rules implemented
- HTTPS enabled

## 💝 Made with Love

Created by Koko for our special journey together.
