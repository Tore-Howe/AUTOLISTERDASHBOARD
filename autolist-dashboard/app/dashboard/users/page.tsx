'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type User = {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
  license_keys?: { key: string; is_active: boolean; last_used_at: string }[]
  listing_count?: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [orgId, setOrgId] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, role')
        .single()

      if (!profile?.organization_id) { setLoading(false); return }
      setOrgId(profile.organization_id)
      setIsOwner(profile.role === 'owner' || profile.role === 'admin')

      const { data: members } = await supabase
        .from('profiles')
        .select('*, license_keys(key, is_active, last_used_at)')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: true })

      // Get listing counts
      const { data: listingCounts } = await supabase
        .from('listings')
        .select('user_id')
        .eq('organization_id', profile.organization_id)

      const counts: Record<string, number> = {}
      listingCounts?.forEach(l => { counts[l.user_id] = (counts[l.user_id] || 0) + 1 })

      setUsers((members || []).map(m => ({ ...m, listing_count: counts[m.id] || 0 })))
      setLoading(false)
    }
    load()
  }, [])

  async function toggleKey(userId: string, keyId: string, currentActive: boolean) {
    const supabase = createClient()
    await supabase.from('license_keys').update({ is_active: !currentActive }).eq('id', keyId)
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      license_keys: u.license_keys?.map(k => k.key === keyId ? { ...k, is_active: !currentActive } : k)
    } : u))
  }

  async function generateKey(userId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('license_keys')
      .insert({ user_id: userId, organization_id: orgId })
      .select()
      .single()
    if (data) {
      setUsers(prev => prev.map(u => u.id === userId ? {
        ...u,
        license_keys: [...(u.license_keys || []), data]
      } : u))
    }
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    // In production: call an API route that sends an invite email via Supabase
    // For now, show a success message
    await new Promise(r => setTimeout(r, 1000))
    setInviteSuccess(`Invite sent to ${inviteEmail}`)
    setInviteEmail('')
    setInviting(false)
    setTimeout(() => setInviteSuccess(''), 4000)
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 800 }}>Users</h1>
          <p style={{ fontSize: '14px', color: '#9aa0aa', marginTop: '4px' }}>{users.length} seat{users.length !== 1 ? 's' : ''} active</p>
        </div>
      </div>

      {/* Invite form */}
      {isOwner && (
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Invite a team member</h3>
          <form onSubmit={sendInvite} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required
              placeholder="colleague@dealership.com"
              style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '13px', fontFamily: 'inherit' }}
            />
            <button type="submit" disabled={inviting} style={{ background: '#1877f2', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: inviting ? 0.7 : 1 }}>
              {inviting ? 'Sending...' : 'Send invite'}
            </button>
          </form>
          {inviteSuccess && <p style={{ fontSize: '13px', color: '#22a65a', marginTop: '10px' }}>✓ {inviteSuccess}</p>}
        </div>
      )}

      {/* Users list */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9aa0aa' }}>Loading...</div>
        ) : users.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9aa0aa' }}>No users yet</div>
        ) : (
          users.map((user, i) => {
            const activeKey = user.license_keys?.find(k => k.is_active)
            const lastUsed = activeKey?.last_used_at ? new Date(activeKey.last_used_at).toLocaleDateString() : 'Never'
            return (
              <div key={user.id} style={{ padding: '16px 20px', borderBottom: i < users.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Avatar */}
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, color: '#1877f2', flexShrink: 0 }}>
                    {user.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || user.email[0].toUpperCase()}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontWeight: 500, fontSize: '14px' }}>{user.full_name || user.email}</p>
                      <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '99px', background: user.role === 'owner' ? '#fff8e1' : '#f5f6fa', color: user.role === 'owner' ? '#f59e0b' : '#9aa0aa', fontWeight: 500, textTransform: 'capitalize' }}>{user.role}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#9aa0aa', marginTop: '2px' }}>{user.email}</p>
                  </div>
                  {/* Stats */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 500 }}>{user.listing_count} listings</p>
                    <p style={{ fontSize: '12px', color: '#9aa0aa' }}>Last active: {lastUsed}</p>
                  </div>
                </div>

                {/* License key */}
                <div style={{ marginTop: '12px', background: '#f5f6fa', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#9aa0aa', textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>License key</span>
                  {activeKey ? (
                    <>
                      <code style={{ flex: 1, fontSize: '12px', color: '#5a6270', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                        {activeKey.key.slice(0, 16)}...{activeKey.key.slice(-8)}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(activeKey.key)}
                        style={{ fontSize: '12px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                        Copy
                      </button>
                      {isOwner && (
                        <button
                          onClick={() => toggleKey(user.id, activeKey.key, true)}
                          style={{ fontSize: '12px', background: '#fce8e8', color: '#e53935', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                          Revoke
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1, fontSize: '13px', color: '#9aa0aa' }}>No active key</span>
                      {isOwner && (
                        <button
                          onClick={() => generateKey(user.id)}
                          style={{ fontSize: '12px', background: '#1877f2', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit' }}>
                          Generate key
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
