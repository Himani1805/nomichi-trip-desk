'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/utils/adminApi';

const ALLOWED_STAGES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'VIBE CHECK',
  'SENT',
  'CONFIRMED',
  'NOT A FIT'
];

const AVAILABLE_OWNERS = [
  'Unassigned',
  'Ananya Nair',
  'Kabir Thapar',
  'Rohan Mehta',
  'Sarah Khan'
];

export default function AdminDashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tripFilter, setTripFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');

  useEffect(() => {
    async function loadTrips() {
      try {
        const res = await adminFetch('/api/admin/trips');
        
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error('Trips response was not valid JSON');
        }
        
        const result = await res.json();
        if (result.success) setTrips(result.data || []);
      } catch (err) {
        console.error("Failed to load trips:", err);
      }
    }
    loadTrips();
  }, []);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await adminFetch('/api/admin/metrics');
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const json = await response.json();
        if (json.success) setMetrics(json.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoadingMetrics(false);
      }
    }
    fetchMetrics();
  }, []);

  useEffect(() => {
    async function fetchLeads() {
      setLoadingLeads(true);
      try {
        const queryParams = new URLSearchParams();
        if (search.trim()) queryParams.append('search', search.trim());
        if (statusFilter) queryParams.append('status', statusFilter);
        if (tripFilter) queryParams.append('trip_id', tripFilter);
        if (ownerFilter) queryParams.append('owner', ownerFilter);

        const response = await adminFetch(`/api/admin/leads?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch leads');
        const json = await response.json();
        if (json.success && json.data) {
          setLeads(json.data);
        } else {
          setLeads([]);
        }
      } catch (err) {
        console.error('Failed to load leads:', err);
      } finally {
        setLoadingLeads(false);
      }
    }

    const delayDebounce = setTimeout(() => {
      fetchLeads();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, tripFilter, ownerFilter]);

  const getStatusBadgeClass = (status) => {
    const base = 'text-[10px] font-bold tracking-wider px-2.5 py-1 rounded border ';
    switch (status?.toUpperCase()) {
      case 'NEW':
        return `${base} bg-blue-50 border-blue-200 text-blue-700`;
      case 'CONTACTED':
        return `${base} bg-amber-50 border-amber-200 text-amber-700`;
      case 'CONFIRMED':
        return `${base} bg-emerald-50 border-emerald-200 text-emerald-700`;
      case 'NOT A FIT':
        return `${base} bg-red-50 border-red-200 text-red-600`;
      default:
        return `${base} bg-stone-50 border-stone-200 text-stone-700`;
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-light tracking-tight text-[#1C1B1A]">Nomichi CRM Console</h1>
        <p className="text-[10px] text-[#D55D27] font-semibold uppercase tracking-widest mt-1">Lead pipeline workspace</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#1C1B1A]/40">Dashboard overview</h2>
        {loadingMetrics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white h-24 rounded-2xl border border-[#1C1B1A]/5 animate-pulse" />
            ))}
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#1C1B1A]/5 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/40">Total Enquiries</span>
              <span className="text-3xl font-light text-[#D55D27] mt-2">{metrics.totalLeads || 0}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#1C1B1A]/5 shadow-sm space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/40 block">Leads by stage</span>
              <div className="grid grid-cols-2 gap-1.5 max-h-24 overflow-y-auto pr-1">
                {metrics.leadsByStage && Object.entries(metrics.leadsByStage).map(([stage, count]) => (
                  <div key={stage} className="bg-[#FFFBF5] border border-[#1C1B1A]/5 px-2.5 py-1 rounded-lg flex justify-between items-center text-[11px]">
                    <span className="font-light truncate uppercase text-[#1C1B1A]/70">{stage}</span>
                    <span className="font-semibold text-[#1C1B1A]">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#1C1B1A]/5 shadow-sm space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/40 block">Leads per journey</span>
              <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {metrics.leadsPerTrip && metrics.leadsPerTrip.map((trip, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-[#FFFBF5] pb-1">
                    <span className="text-[#1C1B1A]/80 truncate max-w-[180px] font-light">{trip.tripName}</span>
                    <span className="text-[#D55D27] font-semibold bg-[#FFFBF5] px-1.5 py-0.5 rounded border border-[#1C1B1A]/5">{trip.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#1C1B1A]/40 italic">Metrics are unavailable right now.</p>
        )}
      </section>

      <section className="bg-white p-5 rounded-2xl border border-[#1C1B1A]/5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:flex-1">
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2 text-[#1C1B1A]/50">Search name, email, or phone</label>
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads"
              className="w-full p-3 border border-[#1C1B1A]/10 rounded-xl text-sm bg-[#FFFBF5] focus:outline-none focus:border-[#D55D27] transition font-light"
            />
          </div>

          <div className="w-full md:w-56">
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2 text-[#1C1B1A]/50">Pipeline status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-3 border border-[#1C1B1A]/10 rounded-xl text-sm bg-[#FFFBF5] focus:outline-none focus:border-[#D55D27] transition font-light"
            >
              <option value="">All Allowed Stages</option>
              {ALLOWED_STAGES.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2 text-[#1C1B1A]/50">Journey</label>
            <select
              value={tripFilter}
              onChange={(e) => setTripFilter(e.target.value)}
              className="w-full p-3 border border-[#1C1B1A]/10 rounded-xl text-sm bg-[#FFFBF5] focus:outline-none focus:border-[#D55D27] transition font-light"
            >
              <option value="">All Registered Journeys</option>
              {trips.map((t) => (
                  <option key={t.id} value={t.id}>{t.title || t.name}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-56">
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2 text-[#1C1B1A]/50">Owner</label>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="w-full p-3 border border-[#1C1B1A]/10 rounded-xl text-sm bg-[#FFFBF5] focus:outline-none focus:border-[#D55D27] transition font-light"
            >
              <option value="">All owners</option>
              {AVAILABLE_OWNERS.filter((owner) => owner !== 'Unassigned').map((owner) => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#1C1B1A]/5 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1C1B1A]/5 flex justify-between items-center">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A]/50">Registered Expressions of Interest</h3>
          <span className="text-xs font-light text-[#1C1B1A]/50">Showing {leads.length} matched records</span>
        </div>

        <div className="overflow-x-auto">
          {loadingLeads ? (
            <div className="p-12 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-[#FFFBF5] rounded-xl animate-pulse w-full border border-[#1C1B1A]/5" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#1C1B1A]/40 italic">
              No leads match these filters.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFBF5] border-b border-[#1C1B1A]/5 text-[10px] font-bold uppercase tracking-wider text-[#1C1B1A]/40">
                  <th className="py-3 px-6">Candidate Profile</th>
                  <th className="py-3 px-6">Communication Channels</th>
                  <th className="py-3 px-6">Lifecycle Phase</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1B1A]/5 text-sm">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#FFFBF5]/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-[#1C1B1A]">{lead.name}</div>
                      <span className="text-[10px] text-[#1C1B1A]/50 uppercase tracking-wider font-semibold bg-[#FFFBF5] border border-[#1C1B1A]/5 rounded-md px-1.5 py-0.5 mt-1 inline-block">
                        {lead.group_type || 'Solo'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs font-light tracking-wide">{lead.email}</div>
                      <div className="text-xs text-[#1C1B1A]/40 font-light mt-0.5">{lead.phone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getStatusBadgeClass(lead.status)}>
                        {lead.status || 'NEW'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => router.push(`/admin/leads/${lead.id}`)}
                        className="text-[11px] font-semibold uppercase tracking-widest text-[#D55D27] hover:text-[#1C1B1A] border border-[#D55D27]/20 hover:border-[#1C1B1A] px-3 py-2 rounded-xl bg-white transition duration-200"
                      >
                        Workspace
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
  );
}
