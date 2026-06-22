// src/app/admin/leads/[id]/page.js (Updated with Owner Assignment Module)
'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

const ALLOWED_STAGES = ['NEW', 'CONTACTED', 'QUALIFIED', 'VIBE CHECK', 'SENT', 'CONFIRMED', 'NOT A FIT'];

// असाइनमेंट के लिए टीम मेंबर्स की लिस्ट (इसे आवश्यकतानुसार बदल सकती हैं)
const AVAILABLE_OWNERS = [
  'Unassigned',
  'Ananya Nair',
  'Kabir Thapar',
  'Rohan Mehta',
  'Sarah Khan'
];

export default function LeadDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const router = useRouter();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [ownerUpdating, setOwnerUpdating] = useState(false);
  
  // Notes State
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);

  useEffect(() => {
    async function fetchLeadData() {
      try {
        // Fetch Lead Details
        const leadRes = await fetch(`/api/admin/leads/${id}`);
        const leadResult = await leadRes.json();
        if (leadResult.success) setLead(leadResult.data);

        // Fetch Existing Notes
        const notesRes = await fetch(`/api/admin/leads/${id}/notes`);
        const notesResult = await notesRes.json();
        if (notesResult.success) setNotes(notesResult.data || []);
        
      } catch (err) {
        console.error("Error loading workspace data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeadData();
  }, [id]);

  // Status Change API Caller
  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) setLead(result.data);
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Owner Assignment API Caller (Task 3 Core)
  const handleOwnerChange = async (newOwner) => {
    setOwnerUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: newOwner === 'Unassigned' ? null : newOwner }),
      });
      const result = await res.json();
      if (result.success) setLead(result.data);
    } catch (err) {
      console.error("Owner assignment failed:", err);
    } finally {
      setOwnerUpdating(false);
    }
  };

  // Add Note Submit Handler
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotesLoading(true);

    try {
      const res = await fetch(`/api/admin/leads/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });
      const result = await res.json();
      if (result.success) {
        setNotes([result.data, ...notes]);
        setNewNote('');
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setNotesLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-sm font-light">Loading Lead Workspace...</div>;
  if (!lead) return <div className="p-8 text-sm text-red-500">Lead not found.</div>;

  return (
    <div className="min-h-screen bg-[#FFFBF5] p-8 font-poppins text-[#1C1B1A]">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={() => router.push('/admin/dashboard')} className="text-xs tracking-widest uppercase text-[#1C1B1A]/60 hover:text-[#D55D27]">
          ← Back to Dashboard
        </button>
        <span className="text-xs uppercase bg-[#D55D27]/10 text-[#D55D27] px-3 py-1 rounded-full font-medium">Workspace Active</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section: Information Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#1C1B1A]/5 p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-light tracking-tight">{lead.name || 'Anonymous User'}</h1>
              <p className="text-sm text-[#1C1B1A]/50 font-light mt-1">{lead.email}</p>
            </div>
            <hr className="border-[#1C1B1A]/5" />
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#1C1B1A]/40 mb-1">Phone</span>
                <span className="font-light">{lead.phone || 'Not Provided'}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#1C1B1A]/40 mb-1">Destination</span>
                <span className="font-light">{lead.destination || lead.trip_interest || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* CRM Call Notes & History Logs Module */}
          <div className="bg-white rounded-2xl border border-[#1C1B1A]/5 p-6 space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#D55D27]">Call Notes / Touchpoints</h3>
            
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log call details, user preferences, or follow-up timelines..."
                rows={3}
                className="w-full bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#D55D27] placeholder-[#1C1B1A]/30 resize-none font-light"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={notesLoading || !newNote.trim()}
                  className="rounded-lg bg-[#1C1B1A] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#D55D27] disabled:opacity-40 transition-colors"
                >
                  {notesLoading ? 'Saving...' : 'Add Log Entry'}
                </button>
              </div>
            </form>

            <div className="space-y-4 pt-2">
              <span className="block text-[10px] uppercase tracking-wider text-[#1C1B1A]/40">History Timeline</span>
              {notes.length === 0 ? (
                <p className="text-xs text-[#1C1B1A]/40 font-light italic">No timeline interactions logged yet.</p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-[#FFFBF5] border border-[#1C1B1A]/5 rounded-xl p-4 text-xs">
                      <p className="font-light text-[#1C1B1A]/80 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      <span className="block text-[9px] text-[#1C1B1A]/40 mt-2">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Pipeline & Control Center */}
        <div className="bg-white rounded-2xl border border-[#1C1B1A]/5 p-6 space-y-6">
          {/* 1. Status Section */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#D55D27] mb-3">Pipeline Status</h3>
            <div className="relative">
              <select
                value={lead.status || 'NEW'}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="w-full appearance-none bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#D55D27] disabled:opacity-50"
              >
                {ALLOWED_STAGES.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              {updating && <span className="absolute right-3 top-3.5 text-[9px] text-[#D55D27] animate-pulse">Saving...</span>}
            </div>
          </div>
          
          <hr className="border-[#1C1B1A]/5" />
          
          {/* 2. Owner Section (Task 3 Complete Implementation) */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#D55D27] mb-3">Lead Assignment</h3>
            <div className="relative">
              <select
                value={lead.owner || 'Unassigned'}
                onChange={(e) => handleOwnerChange(e.target.value)}
                disabled={ownerUpdating}
                className="w-full appearance-none bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#D55D27] disabled:opacity-50 font-light"
              >
                {AVAILABLE_OWNERS.map((owner) => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </select>
              {ownerUpdating && <span className="absolute right-3 top-3.5 text-[9px] text-[#D55D27] animate-pulse">Updating...</span>}
            </div>
            <p className="mt-2 text-[10px] font-light text-[#1C1B1A]/40 leading-relaxed">
              Assign a dedicated curator to handle this enquiry pipeline.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}