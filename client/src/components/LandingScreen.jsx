import React, { useRef, useState } from 'react';
import { Camera, Upload, AlertCircle, FileText, HelpCircle } from 'lucide-react';

export default function LandingScreen({ onImageSelected, onError }) {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    // Validate that it is an image
    if (!file.type.startsWith('image/')) {
      onError('Unsupported file type. Please upload a valid food label image (JPEG/PNG).');
      return;
    }

    // Read the file as base64 data URI
    const reader = new FileReader();
    reader.onload = (event) => {
      onImageSelected(event.target.result);
    };
    reader.onerror = () => {
      onError('Failed to read the image file. Please try again or take another photo.');
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col justify-between relative bg-radial-glow">
      {/* Decorative ambient background glows */}
      <div className="absolute top-12 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header/Tagline Area */}
      <div className="text-center space-y-3 mt-4 z-10">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
          Know what's <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            really
          </span> in it.
        </h1>
        <p className="text-sm text-slate-400 max-w-xs mx-auto font-medium">
          Decode product ingredients instantly. Demystify food labels in plain English.
        </p>
      </div>

      {/* Upload/Camera Zone */}
      <div className="my-8 z-10">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          id="label-image-upload"
        />

        <div
          onDragEnter={onDrag}
          onDragOver={onDrag}
          onDragLeave={onDrag}
          onDrop={onDrop}
          onClick={triggerFileInput}
          className={`relative aspect-square w-full max-w-[340px] mx-auto rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 select-none ${
            isDragActive
              ? 'border-emerald-400 bg-emerald-500/10 scale-102 shadow-lg shadow-emerald-500/5'
              : 'border-slate-800 bg-slate-900/40 glass-panel hover:border-slate-700 active:scale-98'
          }`}
        >
          {/* Pulsing camera aura */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/5 to-teal-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          
          <div className="space-y-4 relative z-10 flex flex-col items-center">
            {/* Camera Icon Container */}
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 border border-white/5 text-emerald-400 shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Camera className="h-9 w-9 stroke-[1.5]" />
            </div>

            <div className="space-y-1">
              <p className="font-display text-base font-bold text-white">
                Snap or Upload Label
              </p>
              <p className="text-xs text-slate-400 px-4">
                Position the camera close so the text is clear and readable
              </p>
            </div>
            
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 border border-white/5 px-3 py-1.5 text-[10px] font-semibold text-slate-400 mt-2">
              <Upload className="h-3 w-3" />
              JPEG, PNG, HEIC
            </div>
          </div>
        </div>
      </div>

      {/* Guide & Disclaimer Area */}
      <div className="space-y-5 z-10">
        {/* Simple features grid */}
        <div className="grid grid-cols-2 gap-3 max-w-[340px] mx-auto">
          <div className="flex items-start gap-2 p-3 rounded-2xl bg-slate-900/30 border border-white/5 text-left">
            <FileText className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-white">Full OCR</p>
              <p className="text-[9px] text-slate-400 leading-tight">Extracts complete ingredient text</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-2xl bg-slate-900/30 border border-white/5 text-left">
            <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold text-white">Plain English</p>
              <p className="text-[9px] text-slate-400 leading-tight">No alarmist, scary terminology</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex gap-2 p-3 rounded-2xl bg-slate-950 border border-white/5 max-w-sm mx-auto text-left">
          <AlertCircle className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-[9px] leading-relaxed text-slate-500">
            <strong>Food Literacy Resource:</strong> LabelLens helps translate label chemistry. It is not diagnostic and does not constitute medical, dietary, or health advice.
          </p>
        </div>
      </div>
    </div>
  );
}
