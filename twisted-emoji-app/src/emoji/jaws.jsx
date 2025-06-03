import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import EnhancedCharacter from './character';
import { languages } from './constants/lang';
import { sampleTexts } from './constants/sample';
import { detectEmotion } from './api-handlers/detectEmotion';
import TranslationComponent from './translation';

// Scene Component
function Scene({ isAnimating, currentEmotion }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <group position={[0, 1.2, 0]}>
        <EnhancedCharacter isAnimating={isAnimating} currentEmotion={currentEmotion} />
      </group>

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
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState('en-US-natalie');
  const [text, setText] = useState('Hello! This is a test of the talking emoji animation.');
  const [audioUrl, setAudioUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('speak');
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);

  // Emotion states
  const [currentEmotion, setCurrentEmotion] = useState({
    emotion: 'neutral',
    emoji: '😐',
    sentiment_score: 0
  });
  const [isAnalyzingEmotion, setIsAnalyzingEmotion] = useState(false);

  const audioRef = useRef(null);
  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

  // Murf AI API integration
  const generateSpeech = async () => {
    if (!text.trim()) return;

    setIsLoading(true);

    // Only detect emotion for English text
    if (selectedLanguage === 'en-US') {
      setIsAnalyzingEmotion(true);
      try {
        const emotionResult = await detectEmotion(text);
        setCurrentEmotion(emotionResult);
      } catch (error) {
        console.error('Error detecting emotion:', error);
      } finally {
        setIsAnalyzingEmotion(false);
      }
    }


      const apiUrl = `${import.meta.env.VITE_APP_URL}speech/stream`;

    try {
 
      const apiKey = import.meta.env.VITE_APP_KEY;

      const requestBody = {
        text: text,
        voiceId: selectedVoice,
        format: "wav",
        sampleRate: 48000.0,
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

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

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
        setTimeout(() => {
          setCurrentEmotion({ emotion: 'neutral', emoji: '😐', sentiment_score: 0 });
        }, 1000);
      };

      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        fallbackToWebSpeech();
      };

    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      fallbackToWebSpeech();
    }
  };

  // Real-time emotion detection on text change
  useEffect(() => {
    // Only proceed if the selected language is English
    if (selectedLanguage !== 'en-US') return;

    const debounceTimer = setTimeout(async () => {
      if (text.trim() && text.length > 10) {
        setIsAnalyzingEmotion(true);
        const emotionResult = await detectEmotion(text);
        setCurrentEmotion(emotionResult);
        setIsAnalyzingEmotion(false);
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [text, selectedLanguage]);

  // Fallback function for Web Speech API
  const fallbackToWebSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();

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
      setIsPlaying(true);
      setIsLoading(false);
      setTimeout(() => {
        setIsPlaying(false);
      }, text.length * 50);
    }
  };

  const stopSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

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

  const handleTranslationResult = (translatedText, targetLanguage, detectedEmotion) => {
    setText(translatedText);
    // Optionally change the language to match the translation
    const lang = languages.find(l => l.code === targetLanguage);
    if (lang) {
      setSelectedLanguage(targetLanguage);
      if (lang.voices.length > 0) {
        setSelectedVoice(lang.voices[0]);
      }
    }
    if (detectedEmotion) {
      setCurrentEmotion(detectedEmotion);
    }
  };

  useEffect(() => {
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
    <div className="h-screen bg-gradient-to-br from-white-900 via-green-900 to-blue-900 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 text-center border-b border-white/10">
        <h1 className="text-3xl font-bold text-white mb-1">
          Twisted
        </h1>
        <p className="text-sm text-blue-200">
          Powered by Murf AI & Three.js
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 min-h-0">
        {/* 3D Scene - Left Side */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 backdrop-blur-sm rounded-2xl p-4 border border-white/10 w-full h-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <Suspense fallback={null}>
                <Scene isAnimating={isPlaying} currentEmotion={currentEmotion} />
              </Suspense>
            </Canvas>
          </div>

          {/* Status Bar */}
          <div className="flex-shrink-0 flex justify-center items-center gap-4 mt-4">
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

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isAnalyzingEmotion ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
              <span className="text-xl">{currentEmotion.emoji}</span>
              <span className="capitalize font-medium">{currentEmotion.emotion}</span>
              {isAnalyzingEmotion && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>}
            </div>
          </div>
        </div>

        {/* Controls Panel - Right Side */}
        <div className="w-full md:w-80 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex-shrink-0 flex bg-black/20 rounded-t-2xl">
            {[
              { id: 'speak', icon: '🎤', label: 'Speak' },
              { id: 'samples', icon: '📝', label: 'Samples' },
              { id: 'settings', icon: '⚙️', label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500/30 text-blue-300 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'speak' && (
              <div className="space-y-4 h-full flex flex-col">
                {/* Emotion Analysis */}
                <div className="flex-shrink-0 space-y-2">
                  <h3 className="text-lg font-semibold text-yellow-300">Current Emotion</h3>
                  <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentEmotion.emoji}</span>
                      <span className="capitalize font-medium text-blue-300">{currentEmotion.emotion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, (currentEmotion.sentiment_score + 1) * 14)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-300">{currentEmotion.sentiment_score}/6</span>
                    </div>
                  </div>
                </div>

                {/* Text Input */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">Text to Speech</h3>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to make the emoji speak..."
                    className="flex-1 bg-black/30 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    onClick={generateSpeech}
                    disabled={isLoading || isPlaying || !text.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 px-4 py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
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
            )}

            {activeTab === 'samples' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-yellow-300">Quick Samples</h3>
                <div className="space-y-2">
                  {Object.entries(sampleTexts).slice(0, 6).map(([code, sampleText]) => {
                    const lang = languages.find(l => l.code === code);
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          handleLanguageChange(code);
                          setActiveTab('speak');
                        }}
                        className="w-full text-left p-3 bg-black/20 hover:bg-black/40 rounded-lg border border-white/10 hover:border-white/30 transition-all"
                      >
                        <div className="font-medium text-blue-300 text-sm">{lang?.name}</div>
                        <div className="text-xs text-gray-300 truncate">{sampleText}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-300">Language & Voice</h3>

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

                <div className="pt-4 border-t border-white/20">
                  <button
                    onClick={() => setIsTranslatorOpen(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    🌐 Open Translator
                  </button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Translate text to any language
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Translation Component */}
      {isTranslatorOpen && (
        <div className="p-4">
          <TranslationComponent
            isOpen={isTranslatorOpen}
            onClose={() => setIsTranslatorOpen(false)}
            onTranslated={handleTranslationResult}
          />
        </div>
      )}
    </div>
  );
}
