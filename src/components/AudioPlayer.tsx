import { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Info } from 'lucide-react';
import { Language } from '../types';

interface AudioPlayerProps {
  lang: Language;
}

export default function AudioPlayer({ lang }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.15); // Cozy low volume
  const [showInfo, setShowInfo] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Oscillators for accordion/café hum simulation
  const activeNodesRef = useRef<any[]>([]);
  const intervalsRef = useRef<any[]>([]);

  // Start synthesis
  const startSynth = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // 1. Accordion warm hum chords
      // We synthesize gentle, rich overlapping drone tones (e.g., F3, A3, C4 for F Major chord)
      // that sound like a distant soft accordion/harmonium chord.
      const frequencies = [174.61, 220.00, 261.63, 349.23]; // F3, A3, C4, F4
      const oscillators: any[] = [];

      frequencies.forEach((freq, idx) => {
        // Main warm triangle wave
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Subtly modulate pitch slightly to simulate hand-pumped bellows
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.3 + idx * 0.1, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        // Individual node gain to balance high/low frequencies
        const nodeGain = ctx.createGain();
        nodeGain.gain.setValueAtTime(idx === 0 ? 0.35 : 0.15, ctx.currentTime);

        // Slow warm fading filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        osc.connect(filter);
        filter.connect(nodeGain);
        nodeGain.connect(masterGain);

        osc.start();
        lfo.start();

        oscillators.push({ osc, lfo, nodeGain });
      });

      // 2. Faint randomized glass clinking ("les bruits de verres") to simulate bistro atmosphere
      const triggerGlassClink = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'suspended') return;
        
        const now = ctx.currentTime;
        const tintOsc = ctx.createOscillator();
        const tintGain = ctx.createGain();
        
        tintOsc.type = 'sine';
        // Random crystal tone pitch
        const baseFreq = 2500 + Math.random() * 1500;
        tintOsc.frequency.setValueAtTime(baseFreq, now);
        
        // Fast glassy envelope decay
        tintGain.gain.setValueAtTime(0, now);
        tintGain.gain.linearRampToValueAtTime(0.005 + Math.random() * 0.01, now + 0.01);
        tintGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        
        tintOsc.connect(tintGain);
        tintGain.connect(masterGain);
        
        tintOsc.start(now);
        tintOsc.stop(now + 0.4);
      };

      const glassInterval = setInterval(() => {
        if (Math.random() > 0.4) {
          triggerGlassClink();
        }
      }, 3000);

      activeNodesRef.current = oscillators;
      intervalsRef.current = [glassInterval];

    } catch (error) {
      console.error('Audio synthesis failed:', error);
    }
  };

  const stopSynth = () => {
    // Clear intervals
    intervalsRef.current.forEach(i => clearInterval(i));
    intervalsRef.current = [];

    // Stop and disconnect nodes
    activeNodesRef.current.forEach(node => {
      try {
        node.osc.stop();
        node.osc.disconnect();
        node.lfo.stop();
        node.lfo.disconnect();
        node.nodeGain.disconnect();
      } catch (e) {}
    });
    activeNodesRef.current = [];

    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopSynth();
      setIsPlaying(false);
    } else {
      startSynth();
      setIsPlaying(true);
    }
  };

  // Synchronize volume adjustment
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    }
  }, [volume]);

  // Clean up synthesis on unmount
  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);

  return (
    <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 py-1.5 px-3 rounded-full shadow-sm text-xs relative font-sans border border-neutral-200 dark:border-neutral-700">
      <button
        onClick={togglePlayback}
        className={`flex items-center gap-1.5 font-medium px-2 py-1 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
          isPlaying ? 'bg-blue-600 text-white animate-pulse' : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
        }`}
        id="bg-audio-toggle"
        aria-label="Toggle background atmosphere"
      >
        {isPlaying ? <Music className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        <span>
          {isPlaying 
            ? (lang === 'fr' ? 'Ambiance Active' : 'Atmosphere Active') 
            : (lang === 'fr' ? 'Activer Ambiance' : 'Activate Ambiance')
          }
        </span>
      </button>

      {isPlaying && (
        <div className="flex items-center gap-1">
          <Volume2 className="w-3 h-3 text-neutral-500" />
          <input
            type="range"
            min="0"
            max="0.4"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-12 h-1 accent-blue-600 rounded-lg cursor-pointer bg-neutral-300 dark:bg-neutral-600"
            aria-label="Volume"
          />
        </div>
      )}

      <button
        onClick={() => setShowInfo(!showInfo)}
        className="p-1 hover:text-blue-500 rounded-full focus:outline-none cursor-pointer"
        title="Info"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {showInfo && (
        <div className="absolute top-10 right-0 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 shadow-xl z-50 text-neutral-700 dark:text-neutral-300 animate-fade-in text-left">
          <p className="font-semibold text-xs mb-1 text-neutral-900 dark:text-white">
            {lang === 'fr' ? '✨ Ambiance Sonore Interactive' : '✨ Interactive Cozy Ambience'}
          </p>
          <p className="text-[11px] leading-relaxed">
            {lang === 'fr' 
              ? 'Générez en temps réel les doux murmures d’un accordéon parisien et le discret tintement des verres d’un bistrot traditionnel. Totalement optionnel.'
              : 'Synthesizes real-time soft notes of a Parisian accordion and the subtle sound of clinking glasses from a traditional brasserie. 100% offline & optional.'}
          </p>
        </div>
      )}
    </div>
  );
}
