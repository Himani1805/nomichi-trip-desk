'use client';

import { useState, useEffect, use } from 'react';

export default function LeadDetailPage({ params }) {
  // Extracting dynamic URL parameters using React.use() wrapper
  const resolvedParams = use(params);
  const leadId = resolvedParams.id;

  const [lead, setLead] = useState(null);
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Local state managers for administrative inputs
  const [status, setStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newLogNote, setNewLogNote] = useState('');
  const [submittingLog, setSubmittingLog] = useState(false);

  // AI intelligence automation responses container
  const [aiLoading, setAiLoading] = useState(false);
  const [vibeCheck, setVibeCheck] = useState('');
  const [whatsappDraft, setWhatsappDraft] = useState('');
  const [copied, setCopied] = useState(false);

  // Primary data synchronization loader block
  const fetchLeadDetails = async () => {
    try {
      const response = await fetch(`/api/enquiries/${leadId}`);
      if (!response.ok) throw new Error('Failed to retrieve client parameters.');
      const json = await response.json();
      
      if (json.data) {
        setLead(json.data);
        setStatus(json.data.status || 'new');
        setCallLogs(json.data.call_logs || []);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Connection anomaly detected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchLeadDetails();
    }
  }, [leadId]);

  // Modifies pipeline state context and commits back to operational table schema
  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/enquiries/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Status configuration change could not save.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update system state status.');
      fetchLeadDetails(); 
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Appends localized touchpoint interactions to chronological call record timeline
  const handleAddCallLog = async (e) => {
    e.preventDefault();
    if (!newLogNote.trim()) return;

    setSubmittingLog(true);
    try {
      const response = await fetch(`/api/enquiries/${leadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newLogNote.trim() })
      });
      if (!response.ok) throw new Error('Failed to serialize updated log metadata.');
      
      setNewLogNote('');
      await fetchLeadDetails();
    } catch (err) {
      setErrorMsg(err.message || 'Could not post conversational logs.');
    } finally {
      setSubmittingLog(false);
    }
  };

  // Connects with structural language processing nodes to process tone evaluations
  const handleGenerateAiInsights = async () => {
    setAiLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enquiryId: leadId })
      });
      if (!response.ok) throw new Error('Document intelligence execution failed.');
      
      const json = await response.json();
      setVibeCheck(json.vibeCheck || 'Analysis generated clear alignment profiles.');
      setWhatsappDraft(json.whatsappDraft || '');
    } catch (err) {
      setErrorMsg(err.message || 'AI insight gathering sequence timed out.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!whatsappDraft) return;
    navigator.clipboard.writeText(whatsappDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] text-[#1C1B1A] flex items-center justify-center font-sans">
        <p className="text-xs tracking-widest uppercase animate-pulse">Parsing operational records</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1C1B1A] font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation administrative link back module */}
        <div className="flex items-center justify-between border-b border-[#D1B788]/30 pb-4">
          <div>
            <button 
              onClick={() => window.location.href = '/admin'}
              className="text-xs font-bold uppercase tracking-widest text-[#45471D] hover:text-[#D55D27] transition"
            >
              ← Back to Desk
            </button>
            <h1 className="text-2xl font-bold tracking-tight uppercase mt-2">Lead Matrix Profile</h1>
          </div>
          {updatingStatus && <span className="text-xs font-medium text-[#45471D] animate-pulse">Syncing state</span>}
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Global structured two-column layout setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Area Panel: Consumer Core Information Matrix and Communication Log */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Lead Metadata Information Block */}
            <div className="bg-white p-6 rounded border border-[#D1B788]/40 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#FFFBF5] pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1C1B1A]">{lead?.name}</h2>
                  <span className="text-xs text-[#45471D] capitalize mt-0.5 inline-block bg-[#FFFBF5] px-2 py-0.5 rounded border border-[#D1B788]/20">
                    Arrangement Type: {lead?.group_type || 'Solo'}
                  </span>
                </div>
                
                {/* Pipeline Context State Configuration Dropdown */}
                <div className="w-full sm:w-44">
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[#45471D]">Lifecycle State</label>
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full p-2 border border-[#D1B788]/50 rounded text-xs bg-[#FFFBF5] font-bold text-[#45471D] focus:outline-none focus:border-[#D55D27] transition"
                  >
                    <option value="new">New Record</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Specific tabular alignment fields metadata lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block font-bold text-[#45471D]/70 uppercase tracking-wide mb-0.5">Email Destination</span>
                  <span className="font-medium tracking-wide text-sm">{lead?.email}</span>
                </div>
                <div>
                  <span className="block font-bold text-[#45471D]/70 uppercase tracking-wide mb-0.5">Mobile Reference</span>
                  <span className="font-medium tracking-wide text-sm">{lead?.phone}</span>
                </div>
                <div>
                  <span className="block font-bold text-[#45471D]/70 uppercase tracking-wide mb-0.5">Requested Itinerary</span>
                  <span className="font-bold text-[#D55D27] text-sm">{lead?.trips?.name || 'Unmapped Selection'}</span>
                </div>
                <div>
                  <span className="block font-bold text-[#45471D]/70 uppercase tracking-wide mb-0.5">Expected Timeline Target</span>
                  <span className="font-medium text-sm">{lead?.preferred_month || 'Flexible Schedule'}</span>
                </div>
              </div>

              {/* Expressive intention parameters block interpretation section */}
              <div className="bg-[#FFFBF5] p-4 rounded border border-[#D1B788]/20">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#45471D] mb-1.5">User Psychological & Atmosphere Context Note</span>
                <p className="text-sm text-[#1C1B1A] leading-relaxed italic">
                  "{lead?.note || 'No specific parameters or environmental expectations dictated during transmission.'}"
                </p>
              </div>
            </div>

            {/* Conversation Call Tracking Log Timeline Component Matrix */}
            <div className="bg-white p-6 rounded border border-[#D1B788]/40 shadow-sm space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#45471D]">Touchpoint Interaction Timeline</h3>
              
              {/* Appending interface engine input framework form tool */}
              <form onSubmit={handleAddCallLog} className="space-y-3">
                <textarea
                  rows="2"
                  value={newLogNote}
                  onChange={(e) => setNewLogNote(e.target.value)}
                  placeholder="Record summary notes regarding recent communications or adjustments made with this client."
                  className="w-full p-2.5 border border-[#D1B788]/50 rounded text-xs bg-[#FFFBF5] focus:outline-none focus:border-[#D55D27] transition resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingLog || !newLogNote.trim()}
                    className="px-4 py-2 bg-[#1C1B1A] hover:bg-[#D55D27] text-white font-bold uppercase tracking-widest text-[10px] rounded transition disabled:opacity-40"
                  >
                    {submittingLog ? 'Recording Interaction' : 'Log Communication Note'}
                  </button>
                </div>
              </form>

              {/* Incremental system logs lists map renderer execution layout block */}
              <div className="space-y-4 pt-2 border-t border-[#FFFBF5]">
                {callLogs.length === 0 ? (
                  <p className="text-xs text-[#45471D] italic">No touchpoints logged for this pipeline parameter yet.</p>
                ) : (
                  <div className="relative border-l border-[#D1B788]/30 pl-4 space-y-5">
                    {callLogs.map((log) => (
                      <div key={log.id} className="relative text-xs">
                        {/* Dot indicator marker structural alignment node token */}
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-[#D1B788] rounded-full border border-white" />
                        <div className="flex justify-between items-center text-[#45471D]/80 mb-0.5 font-medium">
                          <span>Agent Communication Profile</span>
                          <span>{new Date(log.created_at).toLocaleDateString('en-IN', {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
                        </div>
                        <p className="text-[#1C1B1A] bg-[#FFFBF5]/60 p-2.5 rounded border border-[#D1B788]/10 leading-relaxed">
                          {log.note}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Area Panel: Semantic AI Structuring Model Interpretations */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            <div className="bg-white p-6 rounded border border-[#D1B788]/40 shadow-sm space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#45471D]">Operational Intelligence Dashboard</h3>
                <p className="text-[11px] text-[#45471D]/80">Analyze context strings to draft appropriate response strategies matching house parameters.</p>
              </div>

              <button
                onClick={handleGenerateAiInsights}
                disabled={aiLoading}
                className="w-full py-2.5 bg-[#D55D27] hover:bg-[#1C1B1A] text-white font-bold uppercase tracking-widest text-xs rounded transition duration-200 disabled:opacity-40"
              >
                {aiLoading ? 'Processing Language Models' : 'Generate AI Insights & WhatsApp Draft'}
              </button>

              {/* Render Blocks: Open presentation panel structures showing evaluation vectors directly */}
              {vibeCheck && (
                <div className="space-y-4 pt-4 border-t border-[#D1B788]/20">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#45471D] block">Vibe Check Perspective</span>
                    <div className="p-3.5 bg-[#FFFBF5] rounded border border-[#D1B788]/30 text-xs text-[#1C1B1A] leading-relaxed font-medium">
                      {vibeCheck}
                    </div>
                  </div>
                </div>
              )}

              {whatsappDraft && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#45471D]">Tailored WhatsApp Blueprint Draft</span>
                    <button
                      onClick={handleCopyToClipboard}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#D55D27] hover:text-[#1C1B1A] transition"
                    >
                      {copied ? 'Copied Text' : 'Copy Template'}
                    </button>
                  </div>
                  <div className="p-4 bg-[#1C1B1A] text-[#FFFBF5] rounded text-xs font-mono leading-relaxed whitespace-pre-wrap selection:bg-[#D55D27]">
                    {whatsappDraft}
                  </div>
                </div>
              )}

              {!vibeCheck && !whatsappDraft && !aiLoading && (
                <div className="p-8 text-center text-xs text-[#45471D] italic border border-dashed border-[#D1B788]/30 rounded bg-[#FFFBF5]/30">
                  Run model engine evaluation to expose alignment trends and create message frameworks.
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}