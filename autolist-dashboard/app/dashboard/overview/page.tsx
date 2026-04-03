import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function OverviewPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  const orgId = profile?.organization_id

  // Fetch stats
  const [listingsRes, usersRes] = await Promise.all([
    orgId ? supabase.from('listings').select('*', { count: 'exact' }).eq('organization_id', orgId) : { data: [], count: 0 },
    orgId ? supabase.from('profiles').select('*', { count: 'exact' }).eq('organization_id', orgId) : { data: [], count: 0 },
  ])

  const listings = listingsRes.data || []
  const totalListings = listingsRes.count || 0
  const activeListings = listings.filter(l => l.status === 'active').length
  const soldListings = listings.filter(l => l.status === 'sold').length
  const aiListings = listings.filter(l => l.ai_description).length
  const totalUsers = usersRes.count || 0
  const org = profile?.organizations

  // Monthly revenue estimate
  const monthlyRevenue = totalUsers * (org?.subscription_plan === 'dealership' ? 79 : 59)

  const stats = [
    { label: 'Active listings', value: activeListings, sub: `${soldListings} sold` },
    { label: 'Listed this month', value: totalListings, sub: 'all time' },
    { label: 'AI descriptions', value: aiListings, sub: `${totalListings - aiListings} fallback` },
    { label: 'Monthly revenue', value: `$${monthlyRevenue}`, sub: `${totalUsers} seat${totalUsers !== 1 ? 's' : ''}` },
  ]

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 800 }}>Overview</h1>
          <p style={{ fontSize: '14px', color: '#9aa0aa', marginTop: '4px' }}>
            {org?.subscription_status === 'trialing'
              ? `Free trial — ${Math.max(0, Math.ceil((new Date(org.trial_ends_at).getTime() - Date.now()) / 86400000))} days remaining`
              : 'Active subscription'}
          </p>
        </div>
        <a href="/api/license-key" style={{ background: '#1877f2', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>
          Get Extension Key
        </a>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#9aa0aa', marginBottom: '8px' }}>{s.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 500, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '12px', color: '#9aa0aa', marginTop: '4px' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent listings */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700 }}>Recent listings</h2>
          <a href="/dashboard/listings" style={{ fontSize: '13px', color: '#1877f2', textDecoration: 'none' }}>View all →</a>
        </div>

        {listings.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#9aa0aa' }}>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>No listings yet</p>
            <p style={{ fontSize: '13px' }}>Install the Chrome extension and list your first vehicle</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {['Vehicle', 'Price', 'Mileage', 'Listed', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: '11px', color: '#9aa0aa', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listings.slice(0, 8).map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '12px 20px', fontWeight: 500 }}>{l.title}</td>
                  <td style={{ padding: '12px 20px', color: '#22a65a', fontWeight: 500 }}>{l.price ? `$${l.price.toLocaleString()}` : '—'}</td>
                  <td style={{ padding: '12px 20px', color: '#5a6270' }}>{l.miles ? `${l.miles.toLocaleString()} mi` : '—'}</td>
                  <td style={{ padding: '12px 20px', color: '#9aa0aa', fontSize: '13px' }}>{new Date(l.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{
                      display: 'inline-block', fontSize: '12px', padding: '3px 10px', borderRadius: '99px', fontWeight: 500,
                      background: l.status === 'active' ? '#e8f5e9' : l.status === 'sold' ? '#f5f6fa' : '#fff8e1',
                      color: l.status === 'active' ? '#22a65a' : l.status === 'sold' ? '#9aa0aa' : '#f59e0b',
                    }}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
