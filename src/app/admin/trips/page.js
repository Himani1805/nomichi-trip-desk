'use client';

import { useState, useEffect } from 'react';
import { adminFetch } from '@/utils/adminApi';

const GST_RATE = 0.05;

function formatCurrency(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return '₹0';
  }

  return `₹${numericValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function getInclusivePriceBreakdown(price) {
  const numericValue = Number(price);

  if (Number.isNaN(numericValue) || numericValue <= 0) {
    return null;
  }

  const baseAmount = numericValue / (1 + GST_RATE);
  const gstAmount = numericValue - baseAmount;

  return {
    baseAmount,
    gstAmount,
  };
}

export default function TripCMSPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    price: '',
    total_seats: '',
    start_date: '',
    end_date: '',
    status: 'open',
    description: '',
  });

  const emptyForm = {
    name: '',
    destination: '',
    price: '',
    total_seats: '',
    start_date: '',
    end_date: '',
    status: 'open',
    description: '',
  };

  async function loadTrips() {
    try {
      const res = await adminFetch('/api/admin/trips');
      const result = await res.json();
      if (result.success) setTrips(result.data || []);
    } catch (err) {
      console.error("Failed to load trips:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTrips();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleEdit = (trip) => {
    setEditingId(trip.id);
    setFormData({
      name: trip.name || trip.title || '',
      destination: trip.destination || trip.location || '',
      price: trip.price || '',
      total_seats: trip.total_seats || '',
      start_date: trip.start_date || '',
      end_date: trip.end_date || '',
      status: String(trip.status || 'open').toLowerCase() === 'closed' ? 'closed' : 'open',
      description: trip.description || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await adminFetch('/api/admin/trips', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...formData, id: editingId } : formData),
      });
      const result = await res.json();
      if (result.success) {
        setFormData(emptyForm);
        setEditingId(null);
        loadTrips();
      }
    } catch (err) {
      console.error("Failed to save trip:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const isOpen = String(currentStatus || 'open').toLowerCase() === 'open';
    try {
      const res = await adminFetch('/api/admin/trips', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: isOpen ? 'closed' : 'open' }),
      });
      const result = await res.json();
      if (result.success) loadTrips();
    } catch (err) {
      console.error("Failed to update trip status:", err);
    }
  };

  const priceBreakdown = getInclusivePriceBreakdown(formData.price);

  if (loading) return <div className="text-sm font-light">Loading trips...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-[#1C1B1A]/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D55D27]">Journey Inventory</p>
          <h1 className="mt-2 text-2xl font-light tracking-tight">Trip Catalog</h1>
        </div>
        <span className="text-xs uppercase bg-[#D55D27]/10 text-[#D55D27] px-3 py-1 rounded-full font-medium">Trips</span>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="bg-white rounded-3xl border border-[#1C1B1A]/5 p-5 h-fit space-y-4 shadow-sm sm:p-6">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-[#D55D27]">
            {editingId ? 'Edit Trip' : 'Create Trip'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block mb-1 font-medium text-[#1C1B1A]/60">Trip Name</label>
              <input type="text" required value={formData.name} onChange={(e) => handleFieldChange('name', e.target.value)} className="min-h-11 w-full bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-xl p-3 text-sm outline-none" placeholder="e.g., The High Desert Horizon" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-[#1C1B1A]/60">Destination</label>
              <input type="text" required value={formData.destination} onChange={(e) => handleFieldChange('destination', e.target.value)} className="min-h-11 w-full bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-xl p-3 text-sm outline-none" placeholder="Spiti Valley" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-[#1C1B1A]/60">Price including GST</label>
              <p className="mb-2 text-[11px] leading-5 text-[#1C1B1A]/45">Enter the full trip price. The app will show the base amount and GST below.</p>
              <input type="number" required value={formData.price} onChange={(e) => handleFieldChange('price', e.target.value)} className="min-h-11 w-full bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-xl p-3 text-sm outline-none" placeholder="28000" />
              {priceBreakdown ? (
                <div className="mt-2 rounded-lg border border-[#D1B788]/35 bg-[#FFFBF5] p-2 text-[11px] leading-5 text-[#1C1B1A]/65">
                  <div className="mb-1 font-semibold text-[#1C1B1A]/75">GST breakdown</div>
                  <div>Base amount: {formatCurrency(priceBreakdown.baseAmount)}</div>
                  <div>GST: {formatCurrency(priceBreakdown.gstAmount)}</div>
                  <div className="mt-1 text-[#1C1B1A]/45">Calculated using the standard 5% GST rate for travel pricing.</div>
                </div>
              ) : (
                <div className="mt-2 rounded-lg border border-dashed border-[#D1B788]/35 bg-[#FFFBF5] p-2 text-[11px] leading-5 text-[#1C1B1A]/45">
                  Enter a price to see the GST split here.
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium text-[#1C1B1A]/60">Total Seats</label>
              <input type="number" value={formData.total_seats} onChange={(e) => handleFieldChange('total_seats', e.target.value)} className="min-h-11 w-full bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-xl p-3 text-sm outline-none" placeholder="10" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-[#1C1B1A]/60">Status</label>
              <select value={formData.status} onChange={(e) => handleFieldChange('status', e.target.value)} className="min-h-11 w-full bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-xl p-3 text-sm outline-none">
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-[#1C1B1A]/60">Start Date</label>
                <input type="date" value={formData.start_date} onChange={(e) => handleFieldChange('start_date', e.target.value)} className="min-h-11 w-full bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-xl p-3 text-sm outline-none" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-[#1C1B1A]/60">End Date</label>
                <input type="date" value={formData.end_date} onChange={(e) => handleFieldChange('end_date', e.target.value)} className="min-h-11 w-full bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-xl p-3 text-sm outline-none" />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-[#1C1B1A]/60">Description</label>
              <textarea required value={formData.description} onChange={(e) => handleFieldChange('description', e.target.value)} rows={3} className="w-full bg-[#FFFBF5] border border-[#1C1B1A]/10 rounded-xl p-3 text-sm outline-none resize-none" placeholder="What makes this trip feel special" />
            </div>
            <button type="submit" disabled={submitting} className="min-h-11 w-full rounded-xl bg-[#D55D27] py-3.5 text-xs font-semibold uppercase tracking-wider text-[#FFFBF5] hover:bg-[#1C1B1A] disabled:opacity-50 transition-colors">
              {submitting ? 'Saving...' : editingId ? 'Save Trip' : 'Create Trip'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="min-h-11 w-full rounded-xl border border-[#1C1B1A]/15 py-3 text-xs font-semibold uppercase tracking-wider text-[#1C1B1A] hover:bg-[#FFFBF5] transition-colors">
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="xl:col-span-2 bg-white rounded-3xl border border-[#1C1B1A]/5 p-5 space-y-4 shadow-sm sm:p-6">
          <h3 className="text-xs uppercase tracking-widest font-semibold text-[#D55D27]">Trips</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {trips.length === 0 ? (
              <p className="text-xs font-light text-[#1C1B1A]/40 italic">Inventory empty.</p>
            ) : (
              trips.map((trip) => (
                <div key={trip.id} className="flex flex-col gap-4 bg-[#FFFBF5] border border-[#1C1B1A]/5 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <h4 className="text-sm font-medium text-[#1C1B1A]">{trip.title || trip.name}</h4>
                    <p className="text-xs font-light text-[#1C1B1A]/50">{trip.location || trip.destination} &middot; &#8377;{Number(trip.price || 0).toLocaleString()} incl. GST</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${String(trip.status || 'open').toLowerCase() === 'open' ? 'bg-[#D55D27]/10 text-[#D55D27]' : 'bg-[#1C1B1A] text-[#FFFBF5]'}`}>
                      {String(trip.status || 'open').toLowerCase() === 'open' ? 'Open' : 'Closed'}
                    </span>
                    <button onClick={() => handleEdit(trip)} className="min-h-11 text-xs font-medium px-4 rounded-lg border border-[#1C1B1A]/15 text-[#1C1B1A] hover:bg-[#F4EFE6] transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleToggleStatus(trip.id, trip.status)} className={`min-h-11 text-xs font-medium px-4 rounded-lg border transition-colors ${String(trip.status || 'open').toLowerCase() === 'open' ? 'border-[#D55D27]/30 text-[#D55D27] hover:bg-[#D55D27] hover:text-[#FFFBF5]' : 'border-[#1C1B1A]/15 text-[#1C1B1A] hover:bg-[#1C1B1A] hover:text-[#FFFBF5]'}`}>
                      {String(trip.status || 'open').toLowerCase() === 'open' ? 'Close' : 'Open'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
