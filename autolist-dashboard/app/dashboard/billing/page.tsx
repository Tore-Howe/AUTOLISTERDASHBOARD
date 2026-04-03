'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

type Org = {
  name: string
  subscription_status: string
  subscription_plan: string
  seat_count: number
  trial_ends_at: string
  stripe_subscription_id: string
}

export default function BillingPage() {
  const [org, setOrg] = useState<Org | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('organizations(*)')
        .single()
      setOrg((profile?.organizations as any) || null)
      setLoading(false)
    }
    load()
  }, [])

  async function openBillingPortal() {
    setPortalLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setPortalLoading(false)
  }

  async function startSubscription(plan: string) {
    setPortalLoading(true)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setPortalLoading(false)
  }

  if (loading) return <div style={{ padding: '32px', color: '#9aa0aa' }}>Loading...</div>

  const isTrialing = org?.subscription_status === 'trialing'
  const isActive   = org?.subscription_status === 'active'
  const isPastDue  = org?.subscription_status === 'past_due'
  const isCanceled = org?.subscription_status === 'canceled'
  const trialDaysLeft = org?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(org.trial_ends_at).getTime() - Date.now()) / 86400000))
    : 0

  const pricePerSeat = org?.subscription_plan === 'dealership' ? 79 : 59
  const monthlyTotal = (org?.seat_count || 1) * pricePerSeat

  return (
    <div style={{ padding: '32px', maxWidth: '720px' }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 800, marginBottom: '28px' }}>Billing</h1>

      {/* Status banner */}
      {isTrialing && (
        <div style={{ background: '#fff8e1', border: '1px solid #f59e0b', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 500, color: '#92400e', fontSize: '14px' }}>Free trial — {trialDaysLeft} days remaining</p>
            <p style={{ fontSize: '13px', color: '#b45309', marginTop: '2px' }}>Add a payment method to continue after your trial ends</p>
          </div>
          <button onClick={() => startSubscription(org?.subscription_plan || 'pro')}
            style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
            Add payment method
          </button>
        </div>
      )}

      {isPastDue && (
        <div style={{ background: '#fce8e8', border: '1px solid #e53935', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 500, color: '#b71c1c', fontSize: '14px' }}>Payment failed</p>
            <p style={{ fontSize: '13px', color: '#c62828', marginTop: '2px' }}>Please update your payment method to keep your account active</p>
          </div>
          <button onClick={openBillingPortal}
            style={{ background: '#e53935', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
            Update payment
          </button>
        </div>
      )}

      {/* Plan card */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 700, textTransform: 'capitalize' }}>
                {org?.subscription_plan || 'Pro'} Plan
              </h2>
              <span style={{
                fontSize: '12px', padding: '3px 9px', borderRadius: '99px', fontWeight: 500,
                background: isActive ? '#e8f5e9' : isTrialing ? '#fff8e1' : isPastDue ? '#fce8e8' : '#f5f6fa',
                color: isActive ? '#22a65a' : isTrialing ? '#f59e0b' : isPastDue ? '#e53935' : '#9aa0aa',
                textTransform: 'capitalize',
              }}>{org?.subscription_status || 'inactive'}</span>
            </div>
            <p style={{ fontSize: '14px', color: '#9aa0aa' }}>
              {org?.seat_count || 1} seat{(org?.seat_count || 1) !== 1 ? 's' : ''} · ${pricePerSeat}/seat/month
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>${monthlyTotal}</p>
            <p style={{ fontSize: '13px', color: '#9aa0aa', marginTop: '2px' }}>per month</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {[
            ['Seats', `${org?.seat_count || 1} active`],
            ['Billing cycle', 'Monthly'],
            ['Next invoice', isActive ? 'Auto-renews monthly' : isTrialing ? `Trial ends in ${trialDaysLeft} days` : '—'],
            ['Plan', `AutoList ${org?.subscription_plan === 'dealership' ? 'Dealership' : 'Individual'}`],
          ].map(([label, value]) => (
            <div key={label} style={{ background: '#f5f6fa', borderRadius: '8px', padding: '12px 14px' }}>
              <p style={{ fontSize: '12px', color: '#9aa0aa', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>{value}</p>
            </div>
          ))}
        </div>

        {(isActive || isPastDue) && (
          <button onClick={openBillingPortal} disabled={portalLoading}
            style={{ background: '#f5f6fa', color: '#5a6270', border: '1px solid rgba(0,0,0,0.1)', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: portalLoading ? 0.7 : 1 }}>
            {portalLoading ? 'Loading...' : 'Manage subscription →'}
          </button>
        )}

        {(isTrialing || isCanceled) && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => startSubscription('pro')} disabled={portalLoading}
              style={{ background: '#f5f6fa', color: '#5a6270', border: '1px solid rgba(0,0,0,0.1)', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Individual — $59/mo
            </button>
            <button onClick={() => startSubscription('dealership')} disabled={portalLoading}
              style={{ background: '#1877f2', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              Dealership — $79/seat/mo
            </button>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Billing FAQ</h3>
        {[
          ['When am I charged?', 'You\'re billed monthly on the same date you subscribe. No charge during your free trial.'],
          ['Can I cancel anytime?', 'Yes. Cancel from the billing portal and you\'ll keep access until the end of your current billing period.'],
          ['How do seats work?', 'Each person on your team needs one seat. Seat count is set when you subscribe and can be changed in the billing portal.'],
          ['What happens if payment fails?', 'We\'ll retry 3 times over 7 days and send email reminders. After that, accounts are paused until payment is updated.'],
        ].map(([q, a]) => (
          <div key={q as string} style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{q}</p>
            <p style={{ fontSize: '13px', color: '#9aa0aa', lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
