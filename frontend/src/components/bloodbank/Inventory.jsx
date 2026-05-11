import React, { useState } from 'react'
import { Plus, Minus, Save } from 'lucide-react'
import PageHeader from '../layout/PageHeader'
import { Card } from '../ui/index'
import Button from '../ui/Button'
import { useNotification } from '../../context/NotificationContext'
import { BLOOD_TYPES, getBloodTypeColor } from '../../utils/constants'

const INITIAL = { 'A+': 45, 'A-': 8, 'B+': 32, 'B-': 5, 'AB+': 18, 'AB-': 3, 'O+': 60, 'O-': 12 }

const Inventory = () => {
  const { addNotification } = useNotification()
  const [inventory, setInventory] = useState(INITIAL)
  const [loading, setLoading] = useState(false)

  const adjust = (type, delta) => {
    setInventory(prev => ({ ...prev, [type]: Math.max(0, (prev[type] || 0) + delta) }))
  }

  const handleSave = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    addNotification('Inventory updated successfully!', 'success')
    setLoading(false)
  }

  const getStatus = (units) => {
    if (units === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' }
    if (units < 10) return { label: 'Critical', color: 'bg-red-50 text-red-600' }
    if (units < 25) return { label: 'Low', color: 'bg-amber-100 text-amber-700' }
    return { label: 'Adequate', color: 'bg-green-100 text-green-700' }
  }

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader
        title="Blood Inventory"
        subtitle="Manage your blood bank stock levels"
        action={<Button icon={Save} loading={loading} onClick={handleSave}>Save Changes</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BLOOD_TYPES.map((type) => {
          const units = inventory[type] || 0
          const status = getStatus(units)
          const pct = Math.min((units / 80) * 100, 100)
          return (
            <Card key={type} className={`p-5 ${units < 10 ? 'border-red-200 bg-red-50/20' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`badge ${getBloodTypeColor(type)} font-bold text-base px-3 py-1.5`}>{type}</span>
                <span className={`badge ${status.color} text-xs`}>{status.label}</span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>0</span>
                  <span className="font-semibold text-slate-700 text-lg">{units}u</span>
                  <span>80</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${units === 0 ? 'bg-slate-300' : units < 10 ? 'bg-red-500' : units < 25 ? 'bg-amber-400' : 'bg-green-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => adjust(type, -1)}
                  className="flex-1 h-8 bg-slate-100 hover:bg-red-100 hover:text-red-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  min="0"
                  value={units}
                  onChange={(e) => setInventory(prev => ({ ...prev, [type]: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className="w-16 text-center border border-slate-200 rounded-lg py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => adjust(type, 1)}
                  className="flex-1 h-8 bg-slate-100 hover:bg-green-100 hover:text-green-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Summary */}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-900 mb-3">Inventory Summary</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-900">{Object.values(inventory).reduce((a, b) => a + b, 0)}</p>
            <p className="text-xs text-slate-500 mt-1">Total Units</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{Object.values(inventory).filter(v => v < 10).length}</p>
            <p className="text-xs text-slate-500 mt-1">Critical Types</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{Object.values(inventory).filter(v => v >= 10 && v < 25).length}</p>
            <p className="text-xs text-slate-500 mt-1">Low Types</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{Object.values(inventory).filter(v => v >= 25).length}</p>
            <p className="text-xs text-slate-500 mt-1">Adequate Types</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Inventory
