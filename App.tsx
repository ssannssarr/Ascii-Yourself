import React, { useState, useCallback } from 'react';
import { AsciiCanvas } from './components/AsciiCanvas';
import { ControlPanel } from './components/ControlPanel';
import { AnalysisModal } from './components/AnalysisModal';
import { AsciiOptions, AnalysisResult } from './types';
import { analyzeImage } from './services/geminiService';
import { Terminal } from 'lucide-react';
import { playAnalysisStartSound, playAnalysisCompleteSound } from './utils/soundEffects';

const App: React.FC = () => {
  const [options, setOptions] = useState<AsciiOptions>({
    fontSize: 12,
    brightness: 1.0,
    contrast: 1.0,
    colorMode: 'matrix',
    density: 'complex',
    resolution: 0.2, // Factor of window size
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCapture = useCallback(async (imageData: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setIsModalOpen(true);
    playAnalysisStartSound();

    try {
      const result = await analyzeImage(imageData);
      setAnalysisResult(result);
      playAnalysisCompleteSound();
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisResult({
        description: "SYSTEM ERROR: Neural link connection failed.",
        tags: ["ERROR", "OFFLINE"],
        threatLevel: "UNKNOWN"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-black">
      {/* Header / HUD */}
      <header className="pointer-events-none absolute left-0 top-0 z-20 flex w-full flex-col gap-2 bg-gradient-to-b from-black/80 to-transparent p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="pointer-events-auto flex items-center gap-2 text-green-500">
          <Terminal className="w-6 h-6 animate-pulse" />
          <h1 className="text-lg font-bold uppercase tracking-[0.25em] sm:text-xl">
            CyberAscii<span className="ml-1 text-[10px] opacity-70 sm:text-xs">v1.0</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-green-800 sm:text-xs font-mono">
          <span>SYS.STATUS: ONLINE</span>
          <span>CAM.FEED: ACTIVE</span>
          <span className="animate-pulse">REC ●</span>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-grow relative z-10">
        <AsciiCanvas options={options} onCapture={handleCapture} />
      </main>

      {/* Controls */}
      <ControlPanel options={options} setOptions={setOptions} />

      {/* Loading/Analysis Modal */}
      {isModalOpen && (
        <AnalysisModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          isLoading={isAnalyzing}
          result={analysisResult}
        />
      )}
      
      {/* Decorative overlaid scanlines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
};

export default App;
