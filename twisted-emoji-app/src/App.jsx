import { Routes, Route } from 'react-router-dom';
import TalkingEmojiApp from './emoji/jaws'
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TalkingEmojiApp />} />
    </Routes>
  );
}

export default App;