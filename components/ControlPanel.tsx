import React from 'react';
import { AsciiOptions, DENSITY_MAPS } from '../types';
import { Sliders, Monitor, Type, Palette, ChevronDown } from 'lucide-react';
import { playButtonSound } from '../utils/soundEffects';

interface ControlPanelProps {
  options: AsciiOptions;
  setOptions: React.Dispatch<React.SetStateAction<AsciiOptions>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ options, setOptions }) => {
  const [activeSection, setActiveSection] = React.useState<'adjust' | 'style'>('adjust');

  const handleChange = (key: keyof AsciiOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleModeChange = (key: keyof AsciiOptions, value: any) => {
      playButtonSound();
      handleChange(key, value);
  }

  const toggleSection = (section: 'adjust' | 'style') => {
    playButtonSound();
    setActiveSection(prev => prev === section ? prev : section);
  };

  return (
    <div className="absolute bottom-0 z-30 w-full border-t border-green-900/50 bg-black/85 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm transition-all duration-300 sm:px-4 sm:py-4">
      <div className="mx-auto max-w-6xl font-mono text-[10px] text-green-500 sm:text-xs">
        <div className="mb-3 grid grid-cols-2 gap-2 sm:hidden">
          <button
            onClick={() => toggleSection('adjust')}
            className={`flex min-h-11 items-center justify-between rounded-md border px-3 py-2 text-left transition-colors ${
              activeSection === 'adjust'
                ? 'border-green-500 bg-green-500/15 text-green-300'
                : 'border-green-900 bg-black/40 text-green-700'
            }`}
          >
            <span className="flex items-center gap-2 uppercase">
              <Sliders className="h-3.5 w-3.5" />
              Adjust
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${activeSection === 'adjust' ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => toggleSection('style')}
            className={`flex min-h-11 items-center justify-between rounded-md border px-3 py-2 text-left transition-colors ${
              activeSection === 'style'
                ? 'border-green-500 bg-green-500/15 text-green-300'
                : 'border-green-900 bg-black/40 text-green-700'
            }`}
          >
            <span className="flex items-center gap-2 uppercase">
              <Palette className="h-3.5 w-3.5" />
              Style
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${activeSection === 'style' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="hidden items-start gap-4 overflow-x-auto sm:flex sm:justify-center sm:gap-6 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-green-900 [&::-webkit-scrollbar-track]:bg-transparent">
          {/* Font Size */}
          <div className="flex w-28 shrink-0 flex-col gap-1 sm:w-32">
            <div className="mb-1 flex items-center gap-2">
               <Type className="w-3 h-3" />
               <label>FONT SIZE: {options.fontSize}px</label>
            </div>
            <input 
              type="range" 
              min="6" 
              max="24" 
              value={options.fontSize} 
              onChange={(e) => handleChange('fontSize', Number(e.target.value))}
              className="h-1 cursor-pointer appearance-none rounded-lg bg-green-900 accent-green-500"
            />
          </div>

          {/* Brightness */}
          <div className="flex w-28 shrink-0 flex-col gap-1 sm:w-32">
             <div className="mb-1 flex items-center gap-2">
               <Sliders className="w-3 h-3" />
               <label>GAIN: {options.brightness.toFixed(1)}</label>
             </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.1" 
              value={options.brightness} 
              onChange={(e) => handleChange('brightness', Number(e.target.value))}
              className="h-1 cursor-pointer appearance-none rounded-lg bg-green-900 accent-green-500"
            />
          </div>

          {/* Contrast */}
          <div className="flex w-28 shrink-0 flex-col gap-1 sm:w-32">
             <div className="mb-1 flex items-center gap-2">
               <Monitor className="w-3 h-3" />
               <label>CONTRAST: {options.contrast.toFixed(1)}</label>
             </div>
            <input 
              type="range" 
              min="0.5" 
              max="3.0" 
              step="0.1" 
              value={options.contrast} 
              onChange={(e) => handleChange('contrast', Number(e.target.value))}
              className="h-1 cursor-pointer appearance-none rounded-lg bg-green-900 accent-green-500"
            />
          </div>

          {/* Color Mode */}
          <div className="flex shrink-0 flex-col gap-2">
              <div className="flex items-center gap-2">
                  <Palette className="w-3 h-3" />
                  <span>MODE</span>
              </div>
              <div className="flex flex-wrap gap-1 sm:flex-nowrap">
                  {(['matrix', 'bw', 'retro', 'color'] as const).map(mode => (
                      <button
                          key={mode}
                          onClick={() => handleModeChange('colorMode', mode)}
                          className={`border px-2 py-1 ${options.colorMode === mode ? 'bg-green-500 text-black border-green-500' : 'bg-transparent border-green-800 text-green-700 hover:border-green-500'} text-[10px] uppercase transition-colors`}
                      >
                          {mode}
                      </button>
                  ))}
              </div>
          </div>

          {/* Density Map */}
          <div className="flex shrink-0 flex-col gap-2">
              <div className="flex items-center gap-2">
                  <Type className="w-3 h-3" />
                  <span>CHARSET</span>
              </div>
              <div className="flex flex-wrap gap-1 sm:flex-nowrap">
                  {(Object.keys(DENSITY_MAPS) as Array<keyof typeof DENSITY_MAPS>).map(mode => (
                      <button
                          key={mode}
                          onClick={() => handleModeChange('density', mode)}
                          className={`border px-2 py-1 ${options.density === mode ? 'bg-green-500 text-black border-green-500' : 'bg-transparent border-green-800 text-green-700 hover:border-green-500'} text-[10px] uppercase transition-colors`}
                      >
                          {mode}
                      </button>
                  ))}
              </div>
          </div>
        </div>

        <div className="sm:hidden">
          {activeSection === 'adjust' && (
            <div className="grid grid-cols-1 gap-3 rounded-md border border-green-900/60 bg-black/40 p-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 uppercase">
                    <Type className="h-3.5 w-3.5" />
                    Font Size
                  </label>
                  <span>{options.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="24"
                  value={options.fontSize}
                  onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                  className="h-2 cursor-pointer appearance-none rounded-lg bg-green-900 accent-green-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 uppercase">
                    <Sliders className="h-3.5 w-3.5" />
                    Gain
                  </label>
                  <span>{options.brightness.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={options.brightness}
                  onChange={(e) => handleChange('brightness', Number(e.target.value))}
                  className="h-2 cursor-pointer appearance-none rounded-lg bg-green-900 accent-green-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 uppercase">
                    <Monitor className="h-3.5 w-3.5" />
                    Contrast
                  </label>
                  <span>{options.contrast.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={options.contrast}
                  onChange={(e) => handleChange('contrast', Number(e.target.value))}
                  className="h-2 cursor-pointer appearance-none rounded-lg bg-green-900 accent-green-500"
                />
              </div>
            </div>
          )}

          {activeSection === 'style' && (
            <div className="grid grid-cols-1 gap-3 rounded-md border border-green-900/60 bg-black/40 p-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 uppercase">
                  <Palette className="h-3.5 w-3.5" />
                  <span>Mode</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['matrix', 'bw', 'retro', 'color'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => handleModeChange('colorMode', mode)}
                      className={`min-h-11 rounded-md border px-3 py-2 text-center text-[10px] uppercase transition-colors ${
                        options.colorMode === mode
                          ? 'border-green-500 bg-green-500 text-black'
                          : 'border-green-800 bg-transparent text-green-700 hover:border-green-500'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 uppercase">
                  <Type className="h-3.5 w-3.5" />
                  <span>Charset</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(DENSITY_MAPS) as Array<keyof typeof DENSITY_MAPS>).map(mode => (
                    <button
                      key={mode}
                      onClick={() => handleModeChange('density', mode)}
                      className={`min-h-11 rounded-md border px-3 py-2 text-center text-[10px] uppercase transition-colors ${
                        options.density === mode
                          ? 'border-green-500 bg-green-500 text-black'
                          : 'border-green-800 bg-transparent text-green-700 hover:border-green-500'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
