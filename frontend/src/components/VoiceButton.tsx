import { useState, useRef } from 'react';
interface VoiceButtonProps {
  isPro: boolean;
  onTranscript: (text: string) => void;
  onUpgrade: () => void;
  disabled?: boolean;
}

export function VoiceButton({ isPro, onTranscript, onUpgrade, disabled }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleClick = () => {
    if (!isPro) {
      onUpgrade();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <button
      type="button"
      className={`btn-voice ${isListening ? 'btn-voice-active' : ''} ${!isPro ? 'btn-voice-locked' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      title={isPro ? (isListening ? 'Detener grabación' : 'Hablar') : '🔒 Solo plan Pro'}
    >
      {!isPro ? '🔒' : isListening ? '⏹' : '🎤'}
    </button>
  );
}
