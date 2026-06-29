import { useState, useRef } from 'react';

export default function ResumeInput({ onSubmit, loading, onReset, hasResult }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [parsingError, setParsingError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const parseFile = async (selectedFile) => {
    if (!selectedFile) return;

    const isTxt = selectedFile.name.endsWith('.txt') || selectedFile.type === 'text/plain';
    const isPdf = selectedFile.name.endsWith('.pdf') || selectedFile.type === 'application/pdf';

    if (!isTxt && !isPdf) {
      setParsingError('Only .pdf and .txt files are supported. We do not roast images or docx files (yet!).');
      return;
    }

    setParsingError('');
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      parseFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleClearFile = () => {
    setFile(null);
    setParsingError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onReset();
  };

  const extractTextFromPdf = async (arrayBuffer) => {
    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    if (!pdfjsLib) {
      throw new Error('PDF reader script could not load. Try uploading a .txt file, or check your internet connection.');
    }
    
    // Set worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    try {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      if (!fullText.trim()) {
        throw new Error('This PDF has no readable text. Is it an scanned image/photo? We can only read text PDFs.');
      }
      
      return fullText;
    } catch (err) {
      console.error(err);
      throw new Error(err.message || 'Error extraction text from PDF file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || loading) return;

    try {
      setParsingError('');
      let text = '';

      if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        text = await extractTextFromPdf(arrayBuffer);
      } else {
        // Read text file
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (err) => reject(new Error('Failed to read the text file.'));
          reader.readAsText(file);
        });
      }

      onSubmit(file.name, file.size, text);
    } catch (err) {
      setParsingError(err.message || 'Failed to parse resume text.');
    }
  };

  return (
    <form className="resume-input" onSubmit={handleSubmit}>
      <input
        ref={fileInputRef}
        type="file"
        id="resume-file-upload"
        className="sr-only"
        accept=".pdf,.txt"
        onChange={handleChange}
        disabled={loading}
      />

      <div 
        className={`resume-input__dropzone ${dragActive ? 'resume-input__dropzone--active' : ''} ${file ? 'resume-input__dropzone--has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="resume-input__content">
            <span className="resume-input__icon" aria-hidden="true">📤</span>
            <p className="resume-input__text-main">Drag and drop your resume here</p>
            <p className="resume-input__text-sub">Supports PDF or TXT up to 10MB</p>
            <button 
              type="button" 
              className="btn btn--ghost resume-input__browse-btn" 
              onClick={onButtonClick}
              disabled={loading}
            >
              Browse Files
            </button>
          </div>
        ) : (
          <div className="resume-input__file-details">
            <span className="resume-input__icon" aria-hidden="true">📄</span>
            <div className="resume-input__meta">
              <span className="resume-input__filename">{file.name}</span>
              <span className="resume-input__filesize">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            {!loading && (
              <button 
                type="button" 
                className="resume-input__remove-btn" 
                onClick={handleClearFile}
                aria-label="Remove file"
              >
                ❌
              </button>
            )}
          </div>
        )}
      </div>

      {parsingError && (
        <div className="alert alert--error" role="alert" style={{ marginTop: '1rem', width: '100%', maxWidth: '500px', margin: '1rem auto 0' }}>
          <span className="alert__icon">⚠️</span>
          {parsingError}
        </div>
      )}

      <div className="resume-input__actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button 
          type="submit" 
          className="btn btn--primary" 
          disabled={loading || !file}
        >
          {loading ? 'Roasting…' : 'Roast My Resume'}
        </button>
        {hasResult && (
          <button 
            type="button" 
            className="btn btn--ghost" 
            onClick={handleClearFile} 
            disabled={loading}
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
