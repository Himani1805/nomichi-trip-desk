'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/utils/adminApi';

const ALLOWED_STAGES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'VIBE CHECK SENT',
  'CONFIRMED',
  'NOT A FIT',
];

const AVAILABLE_OWNERS = [
  'Unassigned',
  'Ananya Nair',
  'Kabir Thapar',
  'Rohan Mehta',
  'Sarah Khan',
];

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tripFilter, setTripFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function loadTrips() {
      try {
        const res = await adminFetch('/api/admin/trips');
        const result = await res.json();
        if (result.success) setTrips(result.data || []);
      } catch (err) {
        console.error('Failed to load trips:', err);
      }
    }

    loadTrips();
  }, []);

  useEffect(() => {
    async function loadLeads() {
      setLoading(true);
      setLoadError('');
      try {
        const queryParams = new URLSearchParams();
        if (search.trim()) queryParams.append('search', search.trim());
        if (statusFilter) queryParams.append('status', statusFilter);
        if (tripFilter) queryParams.append('trip_id', tripFilter);
        if (ownerFilter) queryParams.append('owner', ownerFilter);

        const response = await adminFetch(`/api/admin/leads?${queryParams.toString()}`);
        const json = await response.json();
        if (!response.ok || !json.success) {
          throw new Error(json.error || 'Could not load traveller enquiries.');
        }
        setLeads(json.data || []);
      } catch (err) {
        console.error('Failed to load leads:', err);
        setLoadError(err.message || 'Could not load traveller enquiries.');
        setLeads([]);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadLeads, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, tripFilter, ownerFilter]);

  const updateLead = async (id, payload) => {
    setUpdatingId(id);
    try {
      const response = await adminFetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (json.success) {
        setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, ...json.data } : lead)));
      }
    } catch (err) {
      console.error('Failed to update lead:', err);
    } finally {
      setUpdatingId('');
    }
  };

  const statusClass = (status) => {
    const base = 'rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ';
    switch (status) {
      case 'NEW':
        return `${base}bg-[#D55D27]/10 text-[#D55D27]`;
      case 'CONFIRMED':
        return `${base}bg-[#D1B788]/25 text-[#1C1B1A]`;
      case 'NOT A FIT':
        return `${base}bg-[#1C1B1A] text-[#FFFBF5]`;
      default:
        return `${base}bg-[#F4EFE6] text-[#1C1B1A]/65`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-[#1C1B1A]/5 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D55D27]">Traveller Desk</p>
          <h1 className="mt-2 text-2xl font-light tracking-tight text-[#1C1B1A] sm:text-3xl">
            Manage traveller enquiries
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-light leading-6 text-[#1C1B1A]/55">
            Review each enquiry, assign a curator, and guide travellers with care.
          </p>
        </div>
        <span className="w-fit rounded-full bg-[#F4EFE6] px-4 py-2 text-xs font-medium text-[#1C1B1A]/65">
          {leads.length} matched leads
        </span>
      </div>

      <section className="rounded-3xl border border-[#1C1B1A]/5 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_220px_240px_220px]">
          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/50">
              Search name, email, or phone
            </span>
            <input
              aria-label="Search leads by name email or phone"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads"
              className="min-h-11 w-full rounded-xl border border-[#1C1B1A]/10 bg-[#FFFBF5] px-4 text-sm font-light outline-none transition focus:border-[#D55D27] focus:ring-4 focus:ring-[#D55D27]/5"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/50">
              Journey stage
            </span>
            <select
              aria-label="Filter leads by journey stage"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-[#1C1B1A]/10 bg-[#FFFBF5] px-4 text-sm font-light outline-none transition focus:border-[#D55D27] focus:ring-4 focus:ring-[#D55D27]/5"
            >
              <option value="">All stages</option>
              {ALLOWED_STAGES.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/50">
              Journey
            </span>
            <select
              aria-label="Filter leads by journey"
              value={tripFilter}
              onChange={(e) => setTripFilter(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-[#1C1B1A]/10 bg-[#FFFBF5] px-4 text-sm font-light outline-none transition focus:border-[#D55D27] focus:ring-4 focus:ring-[#D55D27]/5"
            >
              <option value="">All journeys</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>{trip.title || trip.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/50">
              Owner
            </span>
            <select
              aria-label="Filter leads by owner"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-[#1C1B1A]/10 bg-[#FFFBF5] px-4 text-sm font-light outline-none transition focus:border-[#D55D27] focus:ring-4 focus:ring-[#D55D27]/5"
            >
              <option value="">All owners</option>
              {AVAILABLE_OWNERS.filter((owner) => owner !== 'Unassigned').map((owner) => (
                <option key={owner} value={owner}>{owner}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {loadError && (
        <div className="rounded-3xl border border-[#D55D27]/20 bg-[#FFFBF5] p-5 text-sm font-light text-[#1C1B1A]">
          {loadError}
        </div>
      )}

      <section className="rounded-3xl border border-[#1C1B1A]/5 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#1C1B1A]/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1C1B1A]/50">
            Traveller list
          </h2>
          <span className="text-xs font-light text-[#1C1B1A]/45">
            Stage and curator changes save immediately
          </span>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-20 rounded-2xl bg-[#FFFBF5] animate-pulse" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="p-10 text-center text-sm font-light text-[#1C1B1A]/45">
            No leads match these filters.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#FFFBF5] text-[10px] font-bold uppercase tracking-wider text-[#1C1B1A]/40">
                    <th className="px-3 py-3">Traveller</th>
                    <th className="px-3 py-3">Contact</th>
                    <th className="px-3 py-3">Journey</th>
                    <th className="w-[132px] px-3 py-3">Status</th>
                    <th className="w-[150px] px-3 py-3">Owner</th>
                    <th className="w-[92px] px-3 py-3 text-right">Open</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1B1A]/5 text-sm">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#FFFBF5]/55">
                      <td className="min-w-[150px] px-3 py-4">
                        <span className="block font-medium text-[#1C1B1A]">{lead.name || 'Anonymous lead'}</span>
                        <span className="mt-1 inline-flex rounded-full bg-[#F4EFE6] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/45">
                          {lead.group_type || 'Solo'}
                        </span>
                      </td>
                      <td className="min-w-[170px] px-3 py-4">
                        <span className="block text-xs font-light text-[#1C1B1A]/75">{lead.email || 'No email'}</span>
                        <span className="block text-xs font-light text-[#1C1B1A]/45">{lead.phone || 'No phone'}</span>
                      </td>
                      <td className="max-w-[190px] px-3 py-4 text-xs font-light text-[#1C1B1A]/60">
                        <span className="block truncate">{lead.trips?.name || lead.trip_interest || 'General interest'}</span>
                      </td>
                      <td className="w-[132px] px-3 py-4">
                        <select
                          aria-label={`Update status for ${lead.name || 'traveller'}`}
                          value={lead.status || 'NEW'}
                          disabled={updatingId === lead.id}
                          onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                          className="min-h-11 w-full rounded-xl border border-[#1C1B1A]/10 bg-[#FFFBF5] px-2 text-[11px] font-medium outline-none focus:border-[#D55D27] focus:ring-4 focus:ring-[#D55D27]/5"
                        >
                          {ALLOWED_STAGES.map((stage) => (
                            <option key={stage} value={stage}>{stage}</option>
                          ))}
                        </select>
                      </td>
                      <td className="w-[150px] px-3 py-4">
                        <select
                          aria-label={`Assign curator for ${lead.name || 'traveller'}`}
                          value={lead.assigned_owner || 'Unassigned'}
                          disabled={updatingId === lead.id}
                          onChange={(e) => updateLead(lead.id, { owner: e.target.value === 'Unassigned' ? null : e.target.value })}
                          className="min-h-11 w-full rounded-xl border border-[#1C1B1A]/10 bg-[#FFFBF5] px-2 text-[11px] font-medium outline-none focus:border-[#D55D27] focus:ring-4 focus:ring-[#D55D27]/5"
                        >
                          {AVAILABLE_OWNERS.map((owner) => (
                            <option key={owner} value={owner}>{owner}</option>
                          ))}
                        </select>
                      </td>
                      <td className="w-[92px] px-3 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/leads/${lead.id}`)}
                          className="min-h-11 whitespace-nowrap rounded-xl border border-[#D55D27]/25 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#D55D27] transition hover:bg-[#D55D27] hover:text-[#FFFBF5]"
                        >
                          Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {leads.map((lead) => (
                <article key={lead.id} className="overflow-hidden rounded-2xl border border-[#1C1B1A]/5 bg-[#FFFBF5] p-4">
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-medium text-[#1C1B1A]">{lead.name || 'Anonymous lead'}</h3>
                      <p className="mt-1 truncate text-sm font-light text-[#1C1B1A]/55">{lead.email || lead.phone || 'No contact detail'}</p>
                    </div>
                    <span className={`${statusClass(lead.status || 'NEW')} shrink-0`}>{lead.status || 'NEW'}</span>
                  </div>
                  <p className="mt-3 break-words text-sm font-light text-[#1C1B1A]/60">
                    {lead.trips?.name || lead.trip_interest || 'General interest'}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <select
                      aria-label={`Update status for ${lead.name || 'traveller'}`}
                      value={lead.status || 'NEW'}
                      disabled={updatingId === lead.id}
                      onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                      className="min-h-11 w-full rounded-xl border border-[#1C1B1A]/10 bg-white px-3 text-sm outline-none focus:border-[#D55D27] focus:ring-4 focus:ring-[#D55D27]/5"
                    >
                      {ALLOWED_STAGES.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                    <select
                      aria-label={`Assign curator for ${lead.name || 'traveller'}`}
                      value={lead.assigned_owner || 'Unassigned'}
                      disabled={updatingId === lead.id}
                      onChange={(e) => updateLead(lead.id, { owner: e.target.value === 'Unassigned' ? null : e.target.value })}
                      className="min-h-11 w-full rounded-xl border border-[#1C1B1A]/10 bg-white px-3 text-sm outline-none focus:border-[#D55D27] focus:ring-4 focus:ring-[#D55D27]/5"
                    >
                      {AVAILABLE_OWNERS.map((owner) => (
                        <option key={owner} value={owner}>{owner}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}
                    className="mt-4 min-h-11 w-full rounded-xl bg-[#D55D27] px-4 text-xs font-semibold uppercase tracking-wider text-[#FFFBF5] transition hover:bg-[#1C1B1A]"
                  >
                    Open Profile
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
