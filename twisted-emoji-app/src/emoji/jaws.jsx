import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import EnhancedCharacter from './character';



// Simple 3D Character Component
function Character({ isAnimating }) {
  const headRef = useRef();
  const jawRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  
  useFrame((state) => {
    if (isAnimating && jawRef.current) {
      // Animate jaw movement for talking
      const time = state.clock.getElapsedTime() * 8;
      jawRef.current.rotation.x = Math.sin(time) * 0.3 + 0.1;
    } else if (jawRef.current) {
      // Return jaw to closed position
      jawRef.current.rotation.x = THREE.MathUtils.lerp(jawRef.current.rotation.x, 0, 0.1);
    }
    
    // Add subtle head bob
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
    
    // Eye blink animation
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkTime = Math.sin(state.clock.getElapsedTime() * 0.3);
      if (blinkTime > 0.95) {
        leftEyeRef.current.scale.y = 0.1;
        rightEyeRef.current.scale.y = 0.1;
      } else {
        leftEyeRef.current.scale.y = 1;
        rightEyeRef.current.scale.y = 1;
      }
    }
  });

  return (
    <group>
      {/* Head */}
      <mesh ref={headRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      
      {/* Eyes */}
      <mesh ref={leftEyeRef} position={[-0.4, 0.3, 1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.4, 0.3, 1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0, 1.1]}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshStandardMaterial color="#FFB347" />
      </mesh>
      
      {/* Jaw */}
      <group ref={jawRef} position={[0, -0.3, 0]}>
        <mesh position={[0, -0.2, 0.8]}>
          <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        
        {/* Mouth */}
        <mesh position={[0, 0, 1]}>
          <sphereGeometry args={[0.3, 16, 8]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
        
        {/* Teeth */}
        <mesh position={[0, 0.1, 0.9]}>
          <boxGeometry args={[0.4, 0.1, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </group>
  );
}

// Scene Component
function Scene({ isAnimating }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <EnhancedCharacter isAnimating={isAnimating} />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={10}
        minDistance={2}
      />
    </>
  );
}

// Main App Component
export default function TalkingEmojiApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedVoice, setSelectedVoice] = useState('en-US-natalie');
  const [text, setText] = useState('Hello! This is a test of the talking emoji animation.');
  const [audioUrl, setAudioUrl] = useState(null);
  
  const audioRef = useRef(null);
  
  // Language options with Murf AI voice IDs
  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      voices: [
        'en-US-natalie', 'en-US-aria', 'en-US-davis', 'en-US-guy',
        'en-GB-charlotte', 'en-AU-olivia', 'en-CA-clara'
      ] 
    },
    { 
      code: 'es', 
      name: 'Español', 
      voices: ['es-ES-alvaro', 'es-ES-elvira', 'es-MX-diego', 'es-AR-tomas'] 
    },
    { 
      code: 'fr', 
      name: 'Français', 
      voices: ['fr-FR-alain', 'fr-FR-brigitte', 'fr-CA-felix', 'fr-FR-charlotte'] 
    },
    { 
      code: 'de', 
      name: 'Deutsch', 
      voices: ['de-DE-amala', 'de-DE-bernd', 'de-AT-jonas', 'de-CH-liam'] 
    },
    { 
      code: 'it', 
      name: 'Italiano', 
      voices: ['it-IT-benvenuto', 'it-IT-isabella', 'it-IT-giuseppe', 'it-IT-chiara'] 
    },
    { 
      code: 'pt', 
      name: 'Português', 
      voices: ['pt-BR-antonio', 'pt-BR-francisca', 'pt-PT-tiago', 'pt-BR-camila'] 
    },
    { 
      code: 'hi', 
      name: 'हिन्दी', 
      voices: ['hi-IN-aadhya', 'hi-IN-kiran', 'hi-IN-madhur', 'hi-IN-kavya'] 
    },
    { 
      code: 'ja', 
      name: '日本語', 
      voices: ['ja-JP-ai', 'ja-JP-daichi', 'ja-JP-mayu', 'ja-JP-naoki'] 
    },
    { 
      code: 'ko', 
      name: '한국어', 
      voices: ['ko-KR-bom', 'ko-KR-gook', 'ko-KR-nayeon', 'ko-KR-hyunsu'] 
    },
    { 
      code: 'zh', 
      name: '中文', 
      voices: ['zh-CN-alex', 'zh-CN-lina', 'zh-TW-wayne', 'zh-HK-danny'] 
    }
  ];
  
  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);
  
  // Sample texts for different languages
  const sampleTexts = {
    en: 'Hello! Welcome to our amazing talking emoji app. This is really cool!',
    es: '¡Hola! Bienvenido a nuestra increíble aplicación de emoji parlante.',
    fr: 'Bonjour! Bienvenue dans notre incroyable application emoji parlant.',
    de: 'Hallo! Willkommen bei unserer fantastischen sprechenden Emoji-App.',
    it: 'Ciao! Benvenuto nella nostra fantastica app emoji parlante.',
    pt: 'Olá! Bem-vindo ao nosso incrível aplicativo de emoji falante.',
    hi: 'नमस्ते! हमारे अद्भुत बोलने वाले इमोजी ऐप में आपका स्वागत है।',
    ja: 'こんにちは！素晴らしい話す絵文字アプリへようこそ。',
    ko: '안녕하세요! 놀라운 말하는 이모지 앱에 오신 것을 환영합니다.',
    zh: '你好！欢迎使用我们神奇的会说话的表情符号应用程序。'
  };
  
  // Murf AI API integration
  const generateSpeech = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Murf AI Stream API call

      const apiUrl = import.meta.env.VITE_APP_URL;
const apiKey = import.meta.env.VITE_APP_KEY; // Replace with your actual API key
      
      
      const requestBody = {
        text: text,
        voiceId: selectedVoice,
        format: "wav", // or "mp3"
        sampleRate:  24000.0,
        bitRate: 320
      };
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get audio blob from response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      
      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onloadstart = () => {
        setIsLoading(true);
      };
      
      audio.oncanplaythrough = () => {
        setIsLoading(false);
        setIsPlaying(true);
        audio.play();
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      };
      
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        
        // Fallback to Web Speech API
        fallbackToWebSpeech();
      };
      
    } catch (error) {
      console.error('Murf AI API Error:', error);
      setIsLoading(false);
      
      // Fallback to Web Speech API
      fallbackToWebSpeech();
    }
  };
  
  // Fallback function for Web Speech API
  const fallbackToWebSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      
      // Try to find a voice that matches the selected language
      const voice = voices.find(v => v.lang.startsWith(selectedLanguage)) || voices[0];
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
      };
      
      speechSynthesis.speak(utterance);
    } else {
      // Final fallback: simulate speech duration
      setIsPlaying(true);
      setIsLoading(false);
      setTimeout(() => {
        setIsPlaying(false);
      }, text.length * 50);
    }
  };
  
  const stopSpeech = () => {
    // Stop Murf AI audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Stop Web Speech API if active
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    // Clean up audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    setIsPlaying(false);
  };
  
  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    const lang = languages.find(l => l.code === langCode);
    if (lang && lang.voices.length > 0) {
      setSelectedVoice(lang.voices[0]);
    }
    setText(sampleTexts[langCode] || sampleTexts.en);
  };
  
  useEffect(() => {
    // Load voices when component mounts
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        speechSynthesis.getVoices();
      };
      
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      loadVoices();
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-900 via-green-900 to-blue-900 text-white">
      {/* Header */}
      <div className="p-6 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r text-white bg-clip-text text-transparent mb-2">
          Twisted
        </h1>
        <p className="text-lg text-blue-200">
          Powered by Murf AI & Three.js
        </p>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 px-6 pb-6">
        {/* 3D Scene */}
        <div className="flex-1  backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="aspect-square w-full max-w-2xl mx-auto">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <Suspense fallback={null}>
                <Scene isAnimating={isPlaying} />
              </Suspense>
            </Canvas>
          </div>
          
          {/* Status Indicator */}
          <div className="text-center mt-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isPlaying ? 'bg-green-500/20 text-green-400' : 
              isLoading ? 'bg-yellow-500/20 text-yellow-400' : 
              'bg-gray-500/20 text-gray-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-green-400 animate-pulse' : 
                isLoading ? 'bg-yellow-400 animate-spin' : 
                'bg-gray-400'
              }`}></div>
              {isPlaying ? 'Speaking...' : isLoading ? 'Generating...' : 'Ready'}
            </div>
          </div>
        </div>
        
        {/* Controls Panel */}
        <div className="lg:w-96 space-y-6">
          {/* Language Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-yellow-300">Language & Voice</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">Language</label>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full bg-black/30 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className="bg-gray-800">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">Voice</label>
                <select 
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-black/30 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currentLanguage?.voices.map(voice => (
                    <option key={voice} value={voice} className="bg-gray-800">
                      {voice}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Text Input */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-yellow-300">Text to Speech</h3>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to make the emoji speak..."
              className="w-full h-32 bg-black/30 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={generateSpeech}
                disabled={isLoading || isPlaying || !text.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isLoading ? 'Generating...' : isPlaying ? 'Speaking...' : '🎤 Speak'}
              </button>
              
              {isPlaying && (
                <button
                  onClick={stopSpeech}
                  className="px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors transform hover:scale-105 active:scale-95"
                >
                  ⏹️
                </button>
              )}
            </div>
          </div>
          
          {/* Quick Samples */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-yellow-300">Quick Samples</h3>
            
            <div className="space-y-2">
              {Object.entries(sampleTexts).slice(0, 4).map(([code, sampleText]) => {
                const lang = languages.find(l => l.code === code);
                return (
                  <button
                    key={code}
                    onClick={() => {
                      handleLanguageChange(code);
                    }}
                    className="w-full text-left p-3 bg-black/20 hover:bg-black/40 rounded-lg border border-white/10 hover:border-white/30 transition-all"
                  >
                    <div className="font-medium text-blue-300">{lang?.name}</div>
                    <div className="text-sm text-gray-300 truncate">{sampleText}</div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 text-yellow-300">How to Use</h3>
            <div className="space-y-2 text-sm text-blue-200">
              <p>1. Select your preferred language and voice</p>
              <p>2. Enter text or use a quick sample</p>
              <p>3. Click "Speak" to animate the emoji</p>
              <p>4. Use mouse to rotate and zoom the 3D scene</p>
            </div>
            
            <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <p className="text-xs text-blue-200">
                <strong>Setup:</strong> Replace "YOUR_API_KEY" in the code with your actual Murf AI API key. 
                The app will fallback to Web Speech API if Murf API fails.
              </p>
            </div>
            
            <div className="mt-2 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
              <p className="text-xs text-green-200">
                <strong>Features:</strong> Real-time streaming, 30+ premium voices, jaw sync animation, 
                multi-language support with automatic fallback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}