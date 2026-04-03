'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Listing = {
  id: string
  title: string
  year: string
  make: string
  model: string
  price: number
  miles: number
  vin: string
  status: string
  ai_description: string
  source_url: string
  created_at: string
  profiles?: { full_name: string }
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filtered, setFiltered] = useState<Listing[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Listing | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: profile } = await supabase.from('profiles').select('organization_id').single()
      if (!profile?.organization_id) { setLoading(false); return }
      const { data } = await supabase
        .from('listings')
        .select('*, profiles(full_name)')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })
      setListings(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let result = listings
    if (statusFilter !== 'all') result = result.filter(l => l.status === statusFilter)
    if (search) result = result.filter(l =>
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.vin?.toLowerCase().includes(search.toLowerCase()) ||
      l.make?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, statusFilter, listings])

  async function updateStatus(id: string, status: string) {
    const supabase = createClient()
    await supabase.from('listings').update({ status }).eq('id', id)
    setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  const statusColors: Record<string, { bg: string, color: string }> = {
    active:  { bg: '#e8f5e9', color: '#22a65a' },
    sold:    { bg: '#f5f6fa', color: '#9aa0aa' },
    pending: { bg: '#fff8e1', color: '#f59e0b' },
    removed: { bg: '#fce8e8', color: '#e53935' },
  }

  return (
    <div style={{ padding: '32px', display: 'flex', gap: '24px', height: '100%' }}>
      {/* Left — table */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 800 }}>Listings</h1>
          <span style={{ fontSize: '13px', color: '#9aa0aa' }}>{filtered.length} results</span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by vehicle, VIN, make..."
            style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '13px', background: '#fff', fontFamily: 'inherit' }}
          />
          {['all', 'active', 'pending', 'sold', 'removed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
              border: '1px solid', fontFamily: 'inherit', textTransform: 'capitalize',
              background: statusFilter === s ? '#1877f2' : '#fff',
              color: statusFilter === s ? '#fff' : '#5a6270',
              borderColor: statusFilter === s ? '#1877f2' : 'rgba(0,0,0,0.1)',
            }}>{s}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9aa0aa' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9aa0aa' }}>
              <p style={{ marginBottom: '8px' }}>No listings found</p>
              <p style={{ fontSize: '13px' }}>Use the AutoList extension on Autotrader to create your first listing</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  {['Vehicle', 'Price', 'Miles', 'User', 'Date', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', color: '#9aa0aa', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const sc = statusColors[l.status] || statusColors.active
                  return (
                    <tr key={l.id}
                      onClick={() => setSelected(l)}
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer', background: selected?.id === l.id ? '#f0f7ff' : 'transparent' }}>
                      <td style={{ padding: '11px 16px', fontWeight: 500, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</td>
                      <td style={{ padding: '11px 16px', color: '#22a65a', fontWeight: 500 }}>{l.price ? `$${l.price.toLocaleString()}` : '—'}</td>
                      <td style={{ padding: '11px 16px', color: '#5a6270' }}>{l.miles ? `${l.miles.toLocaleString()}` : '—'}</td>
                      <td style={{ padding: '11px 16px', color: '#5a6270' }}>{(l.profiles as any)?.full_name?.split(' ')[0] || '—'}</td>
                      <td style={{ padding: '11px 16px', color: '#9aa0aa' }}>{new Date(l.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{ display: 'inline-block', fontSize: '11px', padding: '3px 9px', borderRadius: '99px', fontWeight: 500, background: sc.bg, color: sc.color, textTransform: 'capitalize' }}>{l.status}</span>
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        <select
                          value={l.status}
                          onChange={e => { e.stopPropagation(); updateStatus(l.id, e.target.value) }}
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: '12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', padding: '3px 6px', fontFamily: 'inherit', cursor: 'pointer' }}>
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="sold">Sold</option>
                          <option value="removed">Removed</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Right — detail panel */}
      {selected && (
        <div style={{ width: '300px', flexShrink: 0 }}>
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', overflow: 'hidden', position: 'sticky', top: 0 }}>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 700 }}>Listing detail</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: '#9aa0aa', fontSize: '18px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontWeight: 600, fontSize: '14px' }}>{selected.title}</p>
              {[
                ['VIN', selected.vin],
                ['Price', selected.price ? `$${selected.price.toLocaleString()}` : null],
                ['Miles', selected.miles ? `${selected.miles.toLocaleString()} mi` : null],
                ['Listed', new Date(selected.created_at).toLocaleDateString()],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#9aa0aa' }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}

              {selected.ai_description && (
                <div style={{ marginTop: '8px' }}>
                  <p style={{ fontSize: '11px', color: '#9aa0aa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>AI Description</p>
                  <p style={{ fontSize: '12px', color: '#5a6270', lineHeight: 1.6, background: '#f5f6fa', padding: '10px', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>{selected.ai_description}</p>
                </div>
              )}

              {selected.source_url && (
                <a href={selected.source_url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '13px', color: '#1877f2', display: 'block', marginTop: '4px' }}>
                  View on Autotrader →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
