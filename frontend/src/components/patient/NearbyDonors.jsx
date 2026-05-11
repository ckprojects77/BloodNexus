import React, { useState } from 'react'
import { MapPin, Phone, Heart, User } from 'lucide-react'
import PageHeader from '../layout/PageHeader'
import { Card, Badge } from '../ui/index'
import Button from '../ui/Button'
import { getBloodTypeColor } from '../../utils/constants'

const MOCK_DONORS = [
  { id: 1, name: 'Ravi Kumar', bloodType: 'O+', distance: '0.8 km', lastDonated: '3 months ago', available: true, phone: '+91 98765 43210' },
  { id: 2, name: 'Priya Sharma', bloodType: 'O+', distance: '1.2 km', lastDonated: '6 months ago', available: true, phone: '+91 87654 32109' },
  { id: 3, name: 'Arjun Reddy', bloodType: 'A+', distance: '1.9 km', lastDonated: '2 months ago', available: false, phone: '+91 76543 21098' },
  { id: 4, name: 'Meena Patel', bloodType: 'B+', distance: '2.3 km', lastDonated: '1 year ago', available: true, phone: '+91 65432 10987' },
  { id: 5, name: 'Suresh Babu', bloodType: 'AB+', distance: '3.1 km', lastDonated: '4 months ago', available: true, phone: '+91 54321 09876' },
]

const NearbyDonors = () => {
  const [filter, setFilter] = useState('all')

  const filtered = MOCK_DONORS.filter(d => {
    if (filter === 'available') return d.available
    return true
  })

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader title="Nearby Donors" subtitle="Compatible blood donors near your location" />

      {/* Map placeholder */}
      <Card className="overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center relative">
          <div className="text-center">
            <MapPin size={32} className="text-blue-500 mx-auto mb-2" />
            <p className="text-slate-600 font-medium text-sm">Interactive Map</p>
            <p className="text-slate-400 text-xs">Connect Google Maps API to enable live map view</p>
          </div>
          {/* Decorative pins */}
          {[
            { top: '30%', left: '25%', color: 'bg-red-500' },
            { top: '50%', left: '60%', color: 'bg-red-500' },
            { top: '65%', left: '40%', color: 'bg-green-500' },
            { top: '25%', left: '70%', color: 'bg-green-500' },
          ].map((pin, i) => (
            <div key={i} className={`absolute w-3 h-3 ${pin.color} rounded-full border-2 border-white shadow-md`} style={{ top: pin.top, left: pin.left }} />
          ))}
        </div>
      </Card>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'available'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-red-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {f === 'all' ? `All (${MOCK_DONORS.length})` : `Available (${MOCK_DONORS.filter(d => d.available).length})`}
          </button>
        ))}
      </div>

      {/* Donor List */}
      <div className="space-y-3">
        {filtered.map((donor) => (
          <Card key={donor.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900 text-sm">{donor.name}</p>
                  <span className={`badge ${getBloodTypeColor(donor.bloodType)} font-bold text-xs`}>{donor.bloodType}</span>
                  <Badge color={donor.available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}>
                    {donor.available ? '● Available' : '○ Unavailable'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={11} /> {donor.distance}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Heart size={11} /> Last donated: {donor.lastDonated}
                  </span>
                </div>
              </div>
              {donor.available && (
                <a href={`tel:${donor.phone}`}>
                  <Button variant="outline" size="sm" icon={Phone}>Call</Button>
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default NearbyDonors
