'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // Filter state management parameters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tripFilter, setTripFilter] = useState('');

  // Initial load for global analytics metrics payload
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/dashboard');
        const json = await response.json();
        setMetrics(json);
      } catch (err) {
        console.error('Error gathering dashboard metrics:', err);
      } finally {
        setLoadingMetrics(false);
      }
    }
    fetchMetrics();
  }, []);

  // Isolated fetch trigger for lead tables synchronized with state filters
  useEffect(() => {
    async function fetchLeads() {
      setLoadingLeads(true);
      try {
        const queryParams = new URLSearchParams();
        if (search.trim()) queryParams.append('search', search.trim());
        if (statusFilter) queryParams.append('status', statusFilter);
        if (tripFilter) queryParams.append('trip_id', tripFilter);

        const response = await fetch(`/api/enquiries?${queryParams.toString()}`);
        const json = await response.json();
        if (json.data) {
          setLeads(json.data);
        } else {
          setLeads([]);
        }
      } catch (err) {
        console.error('Error fetching filtered records:', err);
      } finally {
        setLoadingLeads(false);
      }
    }

    // Debounce framework simulation for text inputs to prevent network flooding
    const delayDebounce = setTimeout(() => {
      fetchLeads();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, tripFilter]);

  // Status utility style badge generator mapped against brand standards
  const getStatusBadgeClass = (status) => {
    const base = 'text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ';
    switch (status?.toLowerCase()) {
      case 'new':
        return `${base} bg-blue-50 border-blue-200 text-blue-700`;
      case 'contacted':
        return `${base} bg-amber-50 border-amber-200 text-amber-700`;
      case 'converted':
        return `${base} bg-emerald-50 border-emerald-200 text-emerald-700`;
      case 'cancelled':
        return `${base} bg-stone-100 border-stone-300 text-stone-600`;
      default:
        return `${base} bg-[#FFFBF5] border-[#D1B788]/40 text-[#1C1B1A]`;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1C1B1A] font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Core Administrative branding panel */}
        <header className="border-b border-[#D1B788]/30 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#D55D27] uppercase">Nomichi Trip Desk</h1>
            <p className="text-xs text-[#45471D] font-medium uppercase tracking-widest mt-1">Operational Performance Management Console</p>
          </div>
        </header>

        {/* Section 1: Dashboard Top Level Summary Components */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#45471D] mb-4">Performance Metrics Overview</h2>
          
          {loadingMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white h-32 rounded border border-[#D1B788]/20 animate-pulse" />
              ))}
            </div>
          ) : metrics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Total volume collection module */}
              <div className="bg-white p-6 rounded border border-[#D1B788]/40 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#45471D]/70">Total Enquiries</span>
                <span className="text-4xl font-bold text-[#D55D27] mt-2">{metrics.totalLeads || 0}</span>
              </div>

              {/* Grid status distributions representation card */}
              <div className="bg-white p-6 rounded border border-[#D1B788]/40 shadow-sm space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#45471D]/70 block">Leads by System Stage</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {metrics.leadsByStage && Object.entries(metrics.leadsByStage).map(([stage, count]) => (
                    <div key={stage} className="bg-[#FFFBF5] border border-[#D1B788]/20 px-3 py-1.5 rounded flex justify-between items-center">
                      <span className="text-xs font-medium capitalize text-[#1C1B1A]">{stage}</span>
                      <span className="text-xs font-bold text-[#45471D]">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group interest allocations block configuration */}
              <div className="bg-white p-6 rounded border border-[#D1B788]/40 shadow-sm space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#45471D]/70 block">Pipeline Distribution Per Journey</span>
                <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
                  {metrics.leadsPerTrip && metrics.leadsPerTrip.map((trip, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs border-b border-[#FFFBF5] pb-1">
                      <span className="text-[#1C1B1A] truncate max-w-[180px] font-medium">{trip.tripName}</span>
                      <span className="text-[#D55D27] font-bold bg-[#FFFBF5] px-1.5 py-0.5 rounded border border-[#D1B788]/20">{trip.count}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <p className="text-sm text-[#45471D] italic">Metrics calculation profile unavailable.</p>
          )}
        </section>

        {/* Section 2: Data Queries and Pipeline Manipulation Controllers */}
        <section className="bg-white p-5 rounded border border-[#D1B788]/40 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            
            {/* Realtime text pattern matcher filter */}
            <div className="w-full md:flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#45471D]">Search Contact Name / Email</label>
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type profile parameters to match records..."
                className="w-full p-2.5 border border-[#D1B788]/50 rounded text-sm bg-[#FFFBF5] focus:outline-none focus:border-[#D55D27] transition"
              />
            </div>

            {/* Categorization pipeline process controller dropdown */}
            <div className="w-full md:w-48">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#45471D]">System Pipeline Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2.5 border border-[#D1B788]/50 rounded text-sm bg-[#FFFBF5] focus:outline-none focus:border-[#D55D27] transition"
              >
                <option value="">All Stages</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Selected trajectory target constraints picker logic context */}
            <div className="w-full md:w-64">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#45471D]">Target Itinerary</label>
              <select
                value={tripFilter}
                onChange={(e) => setTripFilter(e.target.value)}
                className="w-full p-2.5 border border-[#D1B788]/50 rounded text-sm bg-[#FFFBF5] focus:outline-none focus:border-[#D55D27] transition"
              >
                <option value="">All Registered Journeys</option>
                {metrics?.leadsPerTrip?.map((t, idx) => (
                  <option key={idx} value={t.tripId || t.tripName}>{t.tripName}</option>
                ))}
              </select>
            </div>

          </div>
        </section>

        {/* Section 3: Master Data Output Table for Lead Profiles */}
        <section className="bg-white rounded border border-[#D1B788]/40 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D1B788]/30 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#45471D]">Registered Expressions of Interest</h3>
            <span className="text-xs font-medium text-[#45471D]/80">Showing {leads.length} matched records</span>
          </div>

          <div className="overflow-x-auto">
            {loadingLeads ? (
              <div className="p-12 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-[#FFFBF5] rounded animate-pulse w-full border border-[#D1B788]/10" />
                ))}
              </div>
            ) : leads.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#45471D] italic">
                No client records match the selected database query parameters.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFFBF5] border-b border-[#D1B788]/30 text-xs font-bold uppercase tracking-wider text-[#45471D]">
                    <th className="py-3 px-6">Candidate Profile</th>
                    <th className="py-3 px-6">Communication Channels</th>
                    <th className="py-3 px-6">Target Destination</th>
                    <th className="py-3 px-6">Lifecycle Phase</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D1B788]/20 text-sm">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#FFFBF5]/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#1C1B1A]">{lead.name}</div>
                        <span className="text-xs text-[#45471D] capitalize bg-[#FFFBF5] border border-[#D1B788]/20 rounded px-1.5 py-0.5 mt-0.5 inline-block">
                          {lead.group_type || 'Solo'}
                        </span>
                      </td>
                      <td className="py-4 px-6 space-y-0.5">
                        <div className="text-xs tracking-wide font-medium">{lead.email}</div>
                        <div className="text-xs text-[#45471D]">{lead.phone}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-[#1C1B1A]">{lead.trips?.name || 'Unassigned Destination'}</div>
                        {lead.preferred_month && (
                          <span className="text-xs text-[#45471D]/80">Window: {lead.preferred_month}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 vertical-align-middle">
                        <span className={getStatusBadgeClass(lead.status)}>
                          {lead.status || 'New'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => window.location.href = `/admin/enquiries/${lead.id}`}
                          className="text-xs font-bold uppercase tracking-widest text-[#D55D27] hover:text-[#1C1B1A] border border-[#D55D27]/40 hover:border-[#1C1B1A] px-3 py-1.5 rounded bg-white transition duration-200"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}