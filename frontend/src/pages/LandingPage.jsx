import React from 'react'
import { Link } from 'react-router-dom'
import { Droplet, Heart, Ambulance, Building2, Zap, Shield, Clock, Users } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center">
            <Droplet size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">BloodLink</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-12 pt-20 pb-24 max-w-6xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            AI-Powered Emergency Response
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
            Every Second{' '}
            <span className="text-red-600">Counts.</span>
            <br />
            We're Here.
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            BloodLink connects patients, donors, blood banks, and ambulances in real-time. Our AI-powered platform ensures emergency blood requests reach the right people instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-emergency flex items-center gap-2 text-base px-8 py-3.5 rounded-2xl"
            >
              <Zap size={18} />
              Request Blood Now
            </Link>
            <Link
              to="/register?role=donor"
              className="btn-outline flex items-center gap-2 text-base px-8 py-3.5 rounded-2xl"
            >
              <Heart size={18} />
              Become a Donor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 py-12 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '15K+', label: 'Lives Saved' },
            { value: '8K+', label: 'Active Donors' },
            { value: '200+', label: 'Blood Banks' },
            { value: '< 5 min', label: 'Avg Response Time' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-white mb-1">{value}</p>
              <p className="text-slate-400 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="px-6 lg:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Who Uses BloodLink?</h2>
          <p className="text-slate-500">A unified platform for every stakeholder in emergency blood care</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Users, title: 'Patients', desc: 'Create emergency blood requests and track them in real-time', color: 'text-red-600 bg-red-50' },
            { icon: Heart, title: 'Donors', desc: 'Respond to nearby emergencies and track your donation impact', color: 'text-rose-600 bg-rose-50' },
            { icon: Building2, title: 'Blood Banks', desc: 'Manage inventory and respond to blood requests efficiently', color: 'text-blue-600 bg-blue-50' },
            { icon: Ambulance, title: 'Ambulance', desc: 'Coordinate emergency pickups with live map tracking', color: 'text-amber-600 bg-amber-50' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-card transition-all bg-white">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-red-600 py-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Why BloodLink?</h2>
            <p className="text-red-100">Built for speed, reliability, and saving lives</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Instant Alerts', desc: 'Real-time push notifications to nearest compatible donors within seconds.' },
              { icon: Shield, title: 'AI-Powered Matching', desc: 'Our AI matches blood type, location, and urgency for optimal response.' },
              { icon: Clock, title: '24/7 Emergency Line', desc: 'Round-the-clock AI chatbot support for immediate guidance.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-white/10 border border-white/20 text-white">
                <Icon size={22} className="mb-4 text-red-200" />
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-red-100 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-12 py-20 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Join the Network Today</h2>
        <p className="text-slate-500 mb-8">Be part of an ecosystem that saves lives every single day.</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all text-base"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-6 lg:px-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Droplet size={16} className="text-red-600" />
          <span className="font-bold text-slate-700">BloodLink</span>
        </div>
        <p className="text-slate-400 text-sm">© 2025 BloodLink Emergency Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage
