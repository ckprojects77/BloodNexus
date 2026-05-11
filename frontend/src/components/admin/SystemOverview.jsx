import React from 'react'
import { Server, Database, Activity, Shield, Wifi, Clock } from 'lucide-react'
import PageHeader from '../layout/PageHeader'
import { Card, StatCard } from '../ui/index'

const SERVICE_STATUS = [
  { name: 'API Server', status: 'operational', uptime: '99.98%', latency: '45ms' },
  { name: 'Database', status: 'operational', uptime: '99.99%', latency: '12ms' },
  { name: 'AI Chat Service', status: 'operational', uptime: '99.92%', latency: '320ms' },
  { name: 'SMS Notifications', status: 'degraded', uptime: '98.7%', latency: '850ms' },
  { name: 'Maps Service', status: 'operational', uptime: '99.95%', latency: '80ms' },
  { name: 'Auth Service', status: 'operational', uptime: '100%', latency: '20ms' },
]

const SystemOverview = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="System Overview" subtitle="Platform health and performance" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Server} label="Server Uptime" value="99.97%" color="green" />
        <StatCard icon={Activity} label="Avg Latency" value="58ms" color="blue" />
        <StatCard icon={Database} label="DB Queries/s" value="1,240" color="purple" />
        <StatCard icon={Shield} label="Security Score" value="A+" color="amber" />
      </div>

      <Card>
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Service Health</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {SERVICE_STATUS.map((svc) => (
            <div key={svc.name} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${svc.status === 'operational' ? 'bg-green-500' : svc.status === 'degraded' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
                <p className="font-medium text-slate-800 text-sm">{svc.name}</p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-slate-500 text-xs">Uptime: <span className="font-semibold text-slate-700">{svc.uptime}</span></span>
                <span className="text-slate-500 text-xs">Latency: <span className="font-semibold text-slate-700">{svc.latency}</span></span>
                <span className={`badge text-xs ${svc.status === 'operational' ? 'bg-green-100 text-green-700' : svc.status === 'degraded' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                  {svc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">System Configuration</h3>
          <div className="space-y-3 text-sm">
            {[
              { key: 'API Version', value: 'v2.4.1' },
              { key: 'Node.js', value: '20.x LTS' },
              { key: 'Database', value: 'MongoDB 7.0' },
              { key: 'AI Model', value: 'GPT-4 Turbo' },
              { key: 'Region', value: 'ap-south-1 (Mumbai)' },
              { key: 'Environment', value: 'Production' },
            ].map(({ key, value }) => (
              <div key={key} className="flex justify-between">
                <span className="text-slate-500">{key}</span>
                <span className="font-medium text-slate-800 font-mono text-xs">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Incidents</h3>
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 text-xs font-semibold">SMS Service Degraded</p>
              <p className="text-amber-600 text-xs mt-0.5">Increased latency on outbound SMS. Team investigating.</p>
              <p className="text-amber-400 text-xs mt-1">2 hours ago</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 text-xs font-semibold">Database Maintenance — Resolved</p>
              <p className="text-green-600 text-xs mt-0.5">Scheduled maintenance completed successfully.</p>
              <p className="text-green-400 text-xs mt-1">2 days ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SystemOverview
