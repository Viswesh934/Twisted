import React, { useState } from 'react';
import axios from 'axios';
import {translationLanguages} from './constants/translation'

// Available languages for translation


export default function TranslationComponent({ isOpen, onClose, onTranslated }) {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es-ES');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  const appUrl= `${import.meta.env.VITE_APP_URL}text/translate`

  const translateText = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    setError('');

    const options = {
      method: "POST",
      url: "https://api.murf.ai/v1/text/translate",
      headers: {
        "api-key": import.meta.env.VITE_APP_KEY, // Make sure to set this in your .env file
        "Content-Type": "application/json",
      },
      data: {
        targetLanguage: targetLanguage,
        texts: [sourceText],
      },
    };

    try {
      const response = await axios.request(options);
      console.log('Translation response:', response.data);
      
      if (response.data && response.data.translations && response.data.translations.length > 0) {
        const translated = response.data.translations[0].translated_text;
        setTranslatedText(translated);
        
        // Call the callback function to send translated text back to parent
        if (onTranslated) {
          onTranslated(translated, targetLanguage);
        }
      } else {
        setError('Translation failed. Please try again.');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setError('Translation service unavailable. Please try again later.');
    } finally {
      setIsTranslating(false);
    }
  };

  const clearAll = () => {
    setSourceText('');
    setTranslatedText('');
    setError('');
  };

  const useTranslation = () => {
    if (translatedText && onTranslated) {
      onTranslated(translatedText, targetLanguage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-xl">🌐</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Text Translator</h2>
              <p className="text-sm text-blue-200">Powered by Murf AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blue-200">
              Translate to:
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full bg-black/30 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {translationLanguages.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-gray-800">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source Text Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blue-200">
              Text to translate:
            </label>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text you want to translate..."
              className="w-full h-32 bg-black/30 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Translation Result */}
          {translatedText && (
            <div>
              <label className="block text-sm font-medium mb-2 text-green-300">
                Translation result:
              </label>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-100">
                {translatedText}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={translateText}
              disabled={isTranslating || !sourceText.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {isTranslating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Translating...
                </div>
              ) : (
                '🔄 Translate'
              )}
            </button>

            <button
              onClick={clearAll}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold text-white transition-colors"
            >
              🗑️ Clear
            </button>

            {translatedText && (
              <button
                onClick={useTranslation}
                className="px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                ✓ Use
              </button>
            )}
          </div>

          {/* Quick Translation Examples */}
          <div className="border-t border-white/20 pt-4">
            <h3 className="text-sm font-medium text-blue-200 mb-3">Quick Examples:</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Hello, how are you today?",
                "Thank you for your help!",
                "What time is it?",
                "I love this application!"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setSourceText(example)}
                  className="text-left p-2 bg-black/20 hover:bg-black/40 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}