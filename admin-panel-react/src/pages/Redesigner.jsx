import React, { useState, useCallback } from 'react';
import { 
  FileUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  X, 
  FileText,
  Loader2,
  RefreshCcw,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Redesigner.css';

const Redesigner = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, complete, error
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState([]);

  const steps = [
    { id: 1, label: 'Extracting Text', icon: FileText },
    { id: 2, label: 'Parsing Questions', icon: Search },
    { id: 3, label: 'AI Redesigning', icon: Sparkles }
  ];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        handleFile(droppedFile);
      }
    }
  }, []);

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    startProcessing();
  };

  const startProcessing = () => {
    setStatus('processing');
    setProgress(0);
    setCurrentStep(0);
    
    // Simulate processing pipeline with progress updates
    let currentP = 0;
    const interval = setInterval(() => {
      currentP += Math.random() * 15;
      if (currentP >= 100) {
        currentP = 100;
        clearInterval(interval);
        setStatus('complete');
        setResults([
          {
            id: 1,
            original: "What is power?",
            redesigned: "Define electrical power and explain its relationship with voltage and current in a DC circuit.",
            difficulty: "easy",
            objectives: "Understanding basic power definitions"
          },
          {
            id: 2,
            original: "Explain Ohm's Law.",
            redesigned: "Formulate Ohm's Law and demonstrate how it is applied to calculate resistance in a series circuit with multiple components.",
            difficulty: "medium",
            objectives: "Application of Ohm's Law in circuit analysis"
          }
        ]);
      }
      
      setProgress(currentP);
      if (currentP < 33) setCurrentStep(0);
      else if (currentP < 66) setCurrentStep(1);
      else setCurrentStep(2);
      
    }, 600);
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setResults([]);
    setProgress(0);
  };

  return (
    <div className="redesigner-page fade-in">
      <div className="page-header">
        <div className="header-content">
          <div className="qr-hero-icon-wrap">
            <Sparkles size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="page-title">AI Question Redesigner</h1>
            <p className="page-desc">Transform static test papers into high-quality, redesigned assessment modules using Gemini 1.5 Flash.</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="ai-badge">
            <Sparkles size={14} />
            <span>Gemini AI 2.0</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="qr-upload-section"
          >
            <div 
              className={`qr-drop-zone ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input 
                type="file" 
                id="file-input" 
                accept=".pdf" 
                className="hidden" 
                onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
              />
              <div className="drop-content">
                <div className="upload-icon-circle">
                  <FileUp size={48} className="text-muted" />
                </div>
                <h3>Drag & drop your PDF test paper here</h3>
                <p className="hint">or click to browse your files</p>
                <div className="file-constraints">
                  <span>PDF format only</span>
                  <span className="dot"></span>
                  <span>Max 50MB</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'processing' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="qr-processing-section"
          >
            <div className="processing-card card">
              <div className="card-top">
                <div className="status-indicator">
                  <Loader2 size={24} className="animate-spin text-primary" />
                  <h3>Processing your questions...</h3>
                </div>
                <span className="percentage">{Math.round(progress)}%</span>
              </div>
              
              <div className="progress-track">
                <motion.div 
                  className="progress-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <div className="steps-row">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === index;
                  const isDone = currentStep > index;
                  
                  return (
                    <div key={step.id} className={`step-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      <div className="step-icon">
                        {isDone ? <CheckCircle2 size={18} /> : <span>{step.id}</span>}
                      </div>
                      <span className="step-label">{step.label}</span>
                    </div>
                  );
                })}
              </div>
              
              <p className="processing-hint">Gemini is analyzing context and improving clarity...</p>
            </div>
          </motion.div>
        )}

        {status === 'complete' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="qr-results-section"
          >
            <div className="results-header">
              <div className="results-title">
                <div className="check-icon">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h2>Redesign Complete</h2>
                  <p>{results.length} questions successfully processed</p>
                </div>
              </div>
              <div className="results-actions">
                <button className="btn btn-secondary" onClick={reset}>
                  <RefreshCcw size={18} />
                  Start New
                </button>
                <button className="btn btn-primary">
                  <Download size={18} />
                  Export to JSON
                </button>
              </div>
            </div>

            <div className="results-list">
              {results.map((result) => (
                <motion.div 
                  key={result.id} 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: result.id * 0.1 }}
                  className="result-card card"
                >
                  <div className="result-head">
                    <span className="q-number">Question {result.id}</span>
                    <span className={`difficulty-badge ${result.difficulty}`}>
                      {result.difficulty.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="result-grid">
                    <div className="q-box original">
                      <label>Original Statement</label>
                      <p>{result.original}</p>
                    </div>
                    <div className="q-box redesigned">
                      <label>✨ Redesigned Statement</label>
                      <p>{result.redesigned}</p>
                    </div>
                  </div>

                  <div className="result-footer">
                    <div className="meta-item">
                      <label>🎯 Learning Objective</label>
                      <p>{result.objectives}</p>
                    </div>
                    <button className="action-circle-btn" title="Edit Manually">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Redesigner;
