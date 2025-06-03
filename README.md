
# 🎭 Twisted Emoji App

A React application featuring a 3D animated emoji that speaks user input, detects emotional tone, and supports translation across languages.

---

## 🚀 Overview

**Twisted Emoji App** is a visually engaging web app that blends speech synthesis, emotion detection, and translation with 3D animation. Built using **React**, **Vite**, **Three.js**, and **Tailwind CSS**, it showcases:

- 🎥 **3D Animation:** A custom 3D emoji character animated in real time.
- 🗣️ **Speech Synthesis:** Integrates **Murf AI API** (with fallback to Web Speech API) to vocalize user input.
- 😄 **Emotion Detection:** Optionally analyzes emotional content via an external API.
- 🌐 **Translation:** Translates user input text into various languages using external APIs.

---

## 📁 File Structure

```

twisted-emoji-app/
├── LICENSE
├── README.md
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── public/
│   ├── vite.svg
│   ├── vite1.svg
│   └── vite2.svg
├── src/
│   ├── App.css                # Global app styles
│   ├── App.jsx                # Root app component
│   ├── assets/
│   │   └── react.svg
│   ├── emoji/
│   │   ├── api-handlers/
│   │   │   └── detectEmotion.js  # Handles emotion detection API
│   │   ├── character.jsx         # 3D emoji character (Three.js)
│   │   ├── constants/
│   │   │   ├── lang.js
│   │   │   ├── sample.js
│   │   │   └── translation.js
│   │   ├── jaws.jsx              # Main speaking UI component
│   │   └── translation.jsx       # Translation UI component
│   ├── index.css              # Global Tailwind CSS
│   └── main.jsx               # Application entry point
└── vite.config.js             # Vite configuration

````

---

## ⚙️ Technical Stack

| Feature              | Tech Used               |
|----------------------|-------------------------|
| UI Framework         | React                   |
| Build Tool           | Vite                    |
| 3D Rendering         | Three.js                |
| Styling              | Tailwind CSS            |
| Speech Synthesis     | Murf AI API / Web API   |
| Emotion Detection    | External API            |
| Translation          | Axios + External API    |

---

## 🧠 Key Components

- **`character.jsx`**  
  Contains Three.js code for the 3D emoji model. Animates facial expressions based on emotional cues.

- **`jaws.jsx`**  
  Core speaking interface. Manages user input, triggers speech synthesis, handles UI state and error feedback.

- **`detectEmotion.js`**  
  Handles emotion analysis through a dedicated API. Parses and returns sentiment data.

- **`translation.jsx`**  
  UI for translating user input. Supports multilingual output using an external translation API.

---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone <repository_url>
cd twisted-emoji-app
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the root directory with the following:

```env
VITE_APP_EMOTION_API=<Your_Emotion_API_Endpoint>
VITE_APP_URL=<Your_Murf_API_URL>
VITE_APP_KEY=<Your_Murf_API_Key>
```

> ⚠️ `VITE_APP_KEY` is **critical** for Murf AI speech functionality.

### 4. Run Development Server

```bash
npm run dev
```

### 5. Open in Browser

Visit: [http://localhost:3000](http://localhost:3000)

### 6. Visit deployed URL

URL: https://twisted-mu.vercel.app/



## 📄 License

This project is licensed under the MIT License.


