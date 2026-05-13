import React, { useState } from 'react';

const LANGUAGES = ['English','Assamese','Meitei','Mizo','Bodo'];
const SAMPLES = {
  English:  'Trump claims election was stolen with no evidence provided to courts',
  Assamese: 'ট্ৰাম্প মিছা বাতৰি মিডিয়া নিৰ্বাচন চৰকাৰ',
  Meitei:   'ꯂꯩꯉꯥꯛ ꯈꯪꯕ ꯃꯦꯗꯤꯌꯥ ꯁꯔꯀꯥꯔ',
  Mizo:     'Dik lo thupui sorkar votu media',
  Bodo:     'मिथ्या खबर सरकार मीडिया निर्वाचन'
};

export default function Detect() {
  const [lang, setLang]       = useState('English');
  const [text, setText]       = useState(SAMPLES.English);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleLang = l => {
    setLang(l);
    setText(SAMPLES[l]);
    setResult(null);
    setError('');
  };

  const detect = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setResult(data);

      // Save to history
      const hist = JSON.parse(localStorage.getItem('fakeNewsHistory') || '[]');
      hist.unshift({
        text:  text.slice(0, 80),
        label: data.label,
        conf:  data.confidence,
        lang:  data.language,
        time:  new Date().toLocaleTimeString()
      });
      localStorage.setItem('fakeNewsHistory', JSON.stringify(hist.slice(0,50)));

    } catch (err) {
      setError('Backend not connected! Make sure Flask is running: cd backend → python app.py');
    }
    setLoading(false);
  };

  return (
    <div style={{padding:'24px',maxWidth:'700px'}}>
      
      {/* Language Selector */}
      <div style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',padding:'20px',marginBottom:'16px'}}>
        <p style={{fontSize:'13px',color:'#6b7280',marginBottom:'12px',fontWeight:'500'}}>Select language</p>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'16px'}}>
          {LANGUAGES.map(l => (
            <button key={l} onClick={()=>handleLang(l)} style={{
              padding:'6px 16px',borderRadius:'20px',border:'2px solid',
              cursor:'pointer',fontSize:'13px',fontWeight:'500',
              borderColor: lang===l?'#3b82f6':'#e5e7eb',
              background:  lang===l?'#eff6ff':'white',
              color:       lang===l?'#1d4ed8':'#6b7280'
            }}>{l}</button>
          ))}
        </div>

        {/* Text Input */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={5}
          placeholder="Paste your news article here..."
          style={{
            width:'100%',border:'1px solid #e5e7eb',borderRadius:'8px',
            padding:'12px',fontSize:'14px',resize:'none',
            boxSizing:'border-box',fontFamily:'inherit',
            color:'#111827',outline:'none',lineHeight:'1.6',
            background:'#f9fafb'
          }}
        />

        {/* Buttons */}
        <div style={{display:'flex',gap:'10px',marginTop:'12px'}}>
          <button
            onClick={detect}
            disabled={loading}
            style={{
              padding:'10px 24px',
              background: loading ? '#93c5fd' : '#2563eb',
              color:'white',border:'none',borderRadius:'8px',
              fontSize:'14px',cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight:'600',display:'flex',alignItems:'center',gap:'8px'
            }}>
            {loading ? '⏳ Analyzing...' : '🔍 Detect'}
          </button>
          <button
            onClick={()=>{setText('');setResult(null);setError('');}}
            style={{
              padding:'10px 20px',border:'1px solid #e5e7eb',
              borderRadius:'8px',background:'white',
              fontSize:'14px',cursor:'pointer',color:'#6b7280'
            }}>Clear</button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background:'#fefce8',border:'1px solid #fde047',
          borderRadius:'10px',padding:'12px 16px',
          fontSize:'13px',color:'#854d0e',marginBottom:'16px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          background: result.label==='FAKE' ? '#fef2f2' : '#f0fdf4',
          border:`2px solid ${result.label==='FAKE'?'#fca5a5':'#86efac'}`,
          borderRadius:'12px',padding:'20px'
        }}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
            <span style={{fontSize:'36px'}}>
              {result.label==='FAKE' ? '🔴' : '🟢'}
            </span>
            <div>
              <div style={{
                fontSize:'20px',fontWeight:'700',
                color: result.label==='FAKE' ? '#dc2626' : '#16a34a'
              }}>
                {result.label==='FAKE' ? 'Fake News Detected!' : 'Real News Verified!'}
              </div>
              <div style={{fontSize:'13px',color:'#6b7280',marginTop:'4px'}}>
                🌏 Language: <b style={{color:'#111827'}}>{result.language}</b>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                📊 Confidence: <b style={{color:'#111827'}}>{result.confidence}%</b>
              </div>
            </div>
          </div>

          {/* Confidence Bar */}
          <div style={{height:'10px',background:'rgba(0,0,0,0.06)',borderRadius:'5px',overflow:'hidden'}}>
            <div style={{
              height:'100%',
              width:`${result.confidence}%`,
              background: result.label==='FAKE' ? '#ef4444' : '#22c55e',
              borderRadius:'5px',
              transition:'width 1s ease'
            }}/>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:'4px'}}>
            <span style={{fontSize:'11px',color:'#9ca3af'}}>0%</span>
            <span style={{fontSize:'11px',color:'#9ca3af'}}>100%</span>
          </div>
        </div>
      )}
    </div>
  );
}