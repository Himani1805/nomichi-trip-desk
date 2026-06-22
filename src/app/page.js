'use client';

import { useState, useEffect, useRef } from 'react';

export default function PublicEnquiryPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    trip_id: '',
    group_type: 'solo',
    preferred_month: '',
    note: ''
  });

  const formRef = useRef(null);
  const tripsSectionRef = useRef(null);

  const scrollToSection = (elementRef) => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    async function fetchOpenTrips() {
      try {
        const response = await fetch('/api/trips?status=open');
        const json = await response.json();
        if (json.data) {
          setTrips(json.data);
          if (json.data.length > 0) {
            setFormData(prev => ({ ...prev, trip_id: json.data[0].id }));
          }
        }
      } catch (err) {
        setErrorMsg('Could not load current journeys. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }
    fetchOpenTrips();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('Please fill in your name and phone number.');
      setSubmitting(false);
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid phone number.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to send your enquiry.');
      }

      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] text-[#1C1B1A] flex items-center justify-center font-sans">
        <p className="text-sm tracking-widest uppercase opacity-60">Loading Nomichi Journeys</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1C1B1A] font-sans antialiased relative overflow-x-hidden">
      
      {/* Navbar Section */}
      <nav className="max-w-7xl mx-auto px-6 sm:px-12 h-24 flex items-center justify-between relative z-20">
        <span className="text-xl font-bold tracking-[0.25em] text-[#1C1B1A]">NOMICHI</span>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={() => window.location.href = '/admin'}
            className="text-xs font-semibold uppercase tracking-widest text-[#1C1B1A]/60 hover:text-[#1C1B1A] transition-colors"
          >
            Admin Dashboard
          </button>
          <button 
            onClick={() => scrollToSection(formRef)}
            className="text-xs font-semibold uppercase tracking-widest border border-[#1C1B1A] px-6 py-3 rounded-xl hover:bg-[#1C1B1A] hover:text-[#FFFBF5] transition-all duration-300"
          >
            Enquire Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 sm:px-12 pt-4 pb-16 md:py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-4 md:space-y-6 text-left z-10">
            <h5 className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#D55D27]">
              BEST DESTINATIONS AROUND THE WORLD
            </h5>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1C1B1A] leading-[1.15]">
             Travel, enjoy and live a new and full life
            </h1>
            <p className="text-base md:text-lg text-[#1C1B1A]/70 leading-relaxed max-w-xl font-light">
              Built Wicket longer admire do barton vanity itself do in it. Preferred to sportsmen it engrossed listening. Park gate sell they west hard for the.
            </p>

            {/* <div className="flex items-center gap-6 pt-2">
              <button 
                onClick={() => scrollToSection(formRef)}
                className="bg-[#D55D27] hover:bg-[#1C1B1A] text-white font-semibold text-sm px-8 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Send an Enquiry
              </button>
              <button 
                onClick={() => scrollToSection(tripsSectionRef)}
                className="text-sm font-bold tracking-wide text-[#1C1B1A] hover:text-[#D55D27] transition-colors"
              >
                View Open Trips
              </button>
            </div> */}
            <div className="flex items-center gap-6 pt-2">
              <button 
                onClick={() => scrollToSection(formRef)}
                className="bg-[#D55D27] hover:bg-[#1C1B1A] text-white font-semibold text-sm px-8 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Send an Enquiry
              </button>
              <button 
                onClick={() => scrollToSection(tripsSectionRef)}
                className="flex items-center gap-3 text-sm font-bold tracking-wide text-[#1C1B1A] group"
              >
                <span className="w-10 h-10 rounded-full bg-[#D55D27]/10 flex items-center justify-center text-[#D55D27] group-hover:bg-[#D55D27] group-hover:text-white transition-all duration-300">
                  <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </span>
                <span className="group-hover:text-[#D55D27] transition-colors">View Open Trips</span>
              </button>
            </div>
          </div>


          {/* Right Column Layout Frame - Image Expanded to Match Jadoo Structure */}
          <div className="lg:col-span-6 relative w-full h-[500px] md:h-[600px] flex items-end justify-center">
            {/* Organic soft backdrop asset alignment base shape */}
            <div className="absolute inset-0 top-12 bottom-0 bg-[#F4EFE6] rounded-[50px_120px_40px_140px] transform rotate-1 opacity-90 pointer-events-none z-0" />
            
            {/* Expanded asset block alignment framework scaling up naturally and baseline-aligned */}
            <img 
              src="/hero-traveler.png" 
              alt="Nomichi Traveler" 
              className="absolute bottom-0 h-[135%] min-h-[500px] md:min-h-[650px] object-contain  object-bottom max-w-full drop-shadow-xl z-20 pointer-events-none select-none transition-all hover:-translate-y-4"

              //  h-[135%] min-h-[500px] md:min-h-[650px]  object-bottom drop-shadow-2xl z-20 transition-all 
            />
          </div>
        </div>
      </header>

      {/* Open Trips List Section */}
      <section ref={tripsSectionRef} className="max-w-7xl mx-auto px-6 sm:px-12 py-16 scroll-mt-24 space-y-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#45471D] border-b border-[#1C1B1A]/10 pb-3">
          Open Journeys
        </h2>
        
        {trips.length === 0 ? (
          <p className="text-sm text-[#45471D] italic">
            New journeys coming soon. Tell us where you want to go below.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {trips.map(trip => (
              <article 
                key={trip.id} 
                onClick={() => {
                  setFormData(prev => ({ ...prev, trip_id: trip.id }));
                  scrollToSection(formRef);
                }}
                className={`group p-8 bg-white rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 ${
                  formData.trip_id === trip.id 
                    ? 'border-[#D55D27] ring-1 ring-[#D55D27]' 
                    : 'border-[#D1B788]/30 hover:border-[#D1B788]'
                }`}
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#45471D]">{trip.destination}</span>
                  <h3 className="font-bold text-xl tracking-tight text-[#1C1B1A]">{trip.name}</h3>
                  <p className="text-sm text-[#1C1B1A]/70 leading-relaxed font-light">{trip.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#1C1B1A]/5 text-xs text-[#45471D] font-semibold">
                  <span>{new Date(trip.start_date).toLocaleDateString('en-IN', {month: 'long', year: 'numeric'})}</span>
                  <span className="text-[#1C1B1A] font-bold">₹{Number(trip.price).toLocaleString('en-IN')} incl. GST</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Enquiry Form Section */}
      <section ref={formRef} className="max-w-2xl mx-auto px-6 py-16 scroll-mt-24">
        <div className="bg-white rounded-2xl border border-[#D1B788]/30 p-8 md:p-12 shadow-sm space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Plan a Journey</h2>
            <p className="text-xs text-[#45471D]">Share your preferences and we will reach out to schedule a chat.</p>
          </div>

          {success ? (
            <div className="py-6 space-y-3 text-left">
              <h3 className="text-lg font-bold text-[#D55D27]">Thank you for reaching out</h3>
              <p className="text-sm text-[#45471D] leading-relaxed font-light">
                We have received your request. A member of our team will read through your preferences and get in touch with you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#45471D]">Full Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#D1B788]/40 rounded-lg text-sm bg-[#FFFBF5]/30 focus:outline-none focus:border-[#D55D27] transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#45471D]">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      placeholder="Enter your number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#D1B788]/40 rounded-lg text-sm bg-[#FFFBF5]/30 focus:outline-none focus:border-[#D55D27] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#45471D]">Email Address (Optional)</label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#D1B788]/40 rounded-lg text-sm bg-[#FFFBF5]/30 focus:outline-none focus:border-[#D55D27] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#45471D]">Select Your Trip</label>
                    <select 
                      name="trip_id"
                      value={formData.trip_id}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#D1B788]/40 rounded-lg text-sm bg-[#FFFBF5]/30 focus:outline-none focus:border-[#D55D27] transition-colors text-[#1C1B1A]"
                    >
                      {trips.length === 0 ? (
                        <option value="">No active trips open</option>
                      ) : (
                        trips.map(trip => (
                          <option key={trip.id} value={trip.id}>{trip.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#45471D]">Who is travelling?</label>
                    <select 
                      name="group_type"
                      value={formData.group_type}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[#D1B788]/40 rounded-lg text-sm bg-[#FFFBF5]/30 focus:outline-none focus:border-[#D55D27] transition-colors text-[#1C1B1A]"
                    >
                      <option value="solo">Solo</option>
                      <option value="friends">With Friends</option>
                      <option value="couple">As a Couple</option>
                      <option value="family">With Family</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#45471D]">Preferred Month</label>
                  <input 
                    type="text" 
                    name="preferred_month"
                    placeholder="e.g. October"
                    value={formData.preferred_month}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#D1B788]/40 rounded-lg text-sm bg-[#FFFBF5]/30 focus:outline-none focus:border-[#D55D27] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#45471D]">What are you hoping this trip feels like?</label>
                  <textarea 
                    name="note"
                    rows="4"
                    placeholder="Tell us a bit about the pace or atmosphere you enjoy."
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#D1B788]/40 rounded-lg text-sm bg-[#FFFBF5]/30 focus:outline-none focus:border-[#D55D27] transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-4 bg-[#D55D27] hover:bg-[#1C1B1A] text-white font-bold uppercase tracking-widest text-xs rounded-lg transition-colors duration-300 disabled:opacity-40 shadow-sm"
              >
                {submitting ? 'Sending Enquiry...' : 'Send Enquiry'}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}