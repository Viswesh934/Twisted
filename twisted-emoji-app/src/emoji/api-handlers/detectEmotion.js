export const detectEmotion = async (text) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_EMOTION_API}/predict-emotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const emotionData = await response.json();
    return emotionData;
  } catch (error) {
    console.error('Emotion detection error:', error);
    return { emotion: 'neutral', emoji: '😐', sentiment_score: 0 };
  }
};
