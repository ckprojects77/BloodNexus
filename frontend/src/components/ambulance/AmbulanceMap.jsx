import React from 'react'
import { MapPin, Navigation, Ambulance } from 'lucide-react'
import PageHeader from '../layout/PageHeader'
import { Card, Badge } from '../ui/index'

const UNITS = [
  { id: 'UNIT-01', driver: 'Suresh D.', status: 'en_route', lat: 17.72, lng: 83.31, mission: 'AMB001' },
  { id: 'UNIT-02', driver: 'Arjun R.', status: 'available', lat: 17.73, lng: 83.33, mission: null },
  { id: 'UNIT-03', driver: 'Kumar V.', status: 'assigned', lat: 17.71, lng: 83.30, mission: 'AMB003' },
]

const AmbulanceMap = () => {
  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader title="Live Map" subtitle="Real-time ambulance tracking" />

      {/* Map Placeholder */}
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100" style={{ height: '380px' }}>
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <g key={i}>
                <line x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#94a3b8" strokeWidth="1" />
                <line x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#94a3b8" strokeWidth="1" />
              </g>
            ))}
          </svg>

          {/* Pins */}
          <div className="absolute" style={{ top: '35%', left: '30%' }}>
            <div className="relative">
              <div className="w-8 h-8 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                <Ambulance size={14} className="text-white" />
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold bg-white px-2 py-0.5 rounded shadow-sm">UNIT-01</div>
            </div>
          </div>

          <div className="absolute" style={{ top: '50%', left: '60%' }}>
            <div className="relative">
              <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <Ambulance size={14} className="text-white" />
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold bg-white px-2 py-0.5 rounded shadow-sm">UNIT-02</div>
            </div>
          </div>

          <div className="absolute" style={{ top: '65%', left: '45%' }}>
            <div className="relative">
              <div className="w-8 h-8 bg-amber-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <Ambulance size={14} className="text-white" />
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold bg-white px-2 py-0.5 rounded shadow-sm">UNIT-03</div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 text-xs text-slate-500 font-medium">
              Visakhapatnam, Andhra Pradesh — Connect Google Maps API for live tracking
            </div>
          </div>
        </div>
      </Card>

      {/* Unit Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {UNITS.map((unit) => (
          <Card key={unit.id} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${unit.status === 'en_route' ? 'bg-blue-100' : unit.status === 'available' ? 'bg-green-100' : 'bg-amber-100'}`}>
                <Ambulance size={16} className={unit.status === 'en_route' ? 'text-blue-600' : unit.status === 'available' ? 'text-green-600' : 'text-amber-600'} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{unit.id}</p>
                <p className="text-xs text-slate-500">{unit.driver}</p>
              </div>
            </div>
            <Badge status={unit.status} color={unit.status === 'available' ? 'bg-green-100 text-green-700' : unit.status === 'en_route' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}>
              {unit.status.replace('_', ' ')}
            </Badge>
            {unit.mission && <p className="text-xs text-slate-500 mt-1.5">Mission: {unit.mission}</p>}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AmbulanceMap
