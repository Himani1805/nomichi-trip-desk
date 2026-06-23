'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/utils/adminApi';

const JOURNEY_STAGES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'VIBE CHECK SENT',
  'CONFIRMED',
  'NOT A FIT',
];

export default function AdminDashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      setLoadError('');
      try {
        const [metricsResponse, leadsResponse, tripsResponse] = await Promise.all([
          adminFetch('/api/admin/metrics'),
          adminFetch('/api/admin/leads'),
          adminFetch('/api/admin/trips'),
        ]);

        const metricsJson = await metricsResponse.json();
        const leadsJson = await leadsResponse.json();
        const tripsJson = await tripsResponse.json();

        if (!metricsResponse.ok || !leadsResponse.ok || !tripsResponse.ok) {
          throw new Error('Could not load the admin overview. Please refresh your session.');
        }

        if (!metricsJson.success || !leadsJson.success || !tripsJson.success) {
          throw new Error(metricsJson.error || leadsJson.error || tripsJson.error || 'Could not load the admin overview.');
        }

        setMetrics(metricsJson.data);
        setRecentLeads((leadsJson.data || []).slice(0, 5));
        setTrips(tripsJson.data || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setLoadError(err.message || 'Could not load the admin overview.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const openTrips = trips.filter((trip) => String(trip.status || 'open').toLowerCase() === 'open').length;
  const closedTrips = Math.max(trips.length - openTrips, 0);
  const stageEntries = JOURNEY_STAGES.map((stage) => [stage, metrics?.leadsByStage?.[stage] || 0]);
  const activeLeadCount = stageEntries
    .filter(([stage]) => !['CONFIRMED', 'NOT A FIT'].includes(stage))
    .reduce((total, [, count]) => total + count, 0);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-20 rounded-3xl border border-[#1C1B1A]/5 bg-white animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 rounded-3xl border border-[#1C1B1A]/5 bg-white animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-[#1C1B1A]/5 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D55D27]">Dashboard</p>
          <h1 className="mt-2 text-2xl font-light tracking-tight text-[#1C1B1A] sm:text-3xl">
            Nomichi overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-light leading-6 text-[#1C1B1A]/55">
            A calm view of enquiry volume, journey stages, and traveller interest.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push('/admin/leads')}
            className="min-h-11 rounded-xl bg-[#D55D27] px-5 text-xs font-semibold uppercase tracking-wider text-[#FFFBF5] transition hover:bg-[#1C1B1A]"
          >
            Review Leads
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/trips')}
            className="min-h-11 rounded-xl border border-[#D55D27]/25 bg-[#FFFBF5] px-5 text-xs font-semibold uppercase tracking-wider text-[#D55D27] transition hover:bg-[#D55D27] hover:text-[#FFFBF5]"
          >
            Manage Trips
          </button>
        </div>
      </div>

      {loadError && (
        <div className="rounded-3xl border border-[#D55D27]/20 bg-[#FFFBF5] p-5 text-sm font-light text-[#1C1B1A]">
          {loadError}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-[#1C1B1A]/5 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/40">Total Leads</span>
          <strong className="mt-3 block text-4xl font-light text-[#D55D27]">{metrics?.totalLeads || 0}</strong>
        </div>
        <div className="rounded-3xl border border-[#1C1B1A]/5 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/40">Active Leads</span>
          <strong className="mt-3 block text-4xl font-light text-[#1C1B1A]">{activeLeadCount}</strong>
        </div>
        <div className="rounded-3xl border border-[#1C1B1A]/5 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/40">Open Trips</span>
          <strong className="mt-3 block text-4xl font-light text-[#1C1B1A]">{openTrips}</strong>
        </div>
        <div className="rounded-3xl border border-[#1C1B1A]/5 bg-white p-5 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]/40">Closed Trips</span>
          <strong className="mt-3 block text-4xl font-light text-[#1C1B1A]">{closedTrips}</strong>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-[#1C1B1A]/5 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#1C1B1A]/45">Journey stages</h2>
            <span className="text-xs font-light text-[#1C1B1A]/45">{metrics?.totalLeads || 0} total</span>
          </div>
          <div className="space-y-3">
            {stageEntries.map(([stage, count]) => {
              const percentage = metrics?.totalLeads ? Math.round((count / metrics.totalLeads) * 100) : 0;
              return (
                <div key={stage} className="grid gap-2 sm:grid-cols-[150px_1fr_44px] sm:items-center">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1C1B1A]/60">{stage}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F4EFE6]">
                    <div className="h-full rounded-full bg-[#D55D27]" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-right text-xs font-semibold text-[#1C1B1A]">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-[#1C1B1A]/5 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#1C1B1A]/45">Leads by trip</h2>
          <div className="space-y-3">
            {metrics?.leadsPerTrip?.length ? (
              metrics.leadsPerTrip.map((trip) => (
                <div key={trip.tripName} className="flex min-h-11 items-center justify-between gap-4 rounded-2xl bg-[#FFFBF5] px-4 py-3">
                  <span className="min-w-0 truncate text-sm font-light text-[#1C1B1A]/75">{trip.tripName}</span>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1C1B1A]">{trip.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm font-light text-[#1C1B1A]/45">No trip demand data yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#1C1B1A]/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#1C1B1A]/45">Recent activity</h2>
          <button
            type="button"
            onClick={() => router.push('/admin/leads')}
            className="min-h-11 rounded-xl border border-[#D55D27]/20 px-4 text-xs font-semibold uppercase tracking-wider text-[#D55D27] transition hover:bg-[#D55D27] hover:text-[#FFFBF5]"
          >
            Open Leads
          </button>
        </div>
        <div className="grid gap-3">
          {recentLeads.length ? (
            recentLeads.map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => router.push(`/admin/leads/${lead.id}`)}
                className="grid min-h-16 gap-2 rounded-2xl border border-[#1C1B1A]/5 bg-[#FFFBF5] p-4 text-left transition hover:border-[#1C1B1A]/30 md:grid-cols-[1fr_auto_auto] md:items-center"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-[#1C1B1A]">{lead.name || 'Anonymous lead'}</span>
                  <span className="block truncate text-xs font-light text-[#1C1B1A]/45">{lead.email || lead.phone || 'No contact detail'}</span>
                </span>
                <span className="text-xs font-light text-[#1C1B1A]/50">{lead.trips?.name || lead.trip_interest || 'General interest'}</span>
                <span className="w-fit rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#1C1B1A]">
                  {lead.status || 'NEW'}
                </span>
              </button>
            ))
          ) : (
            <p className="text-sm font-light text-[#1C1B1A]/45">No recent lead activity yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
