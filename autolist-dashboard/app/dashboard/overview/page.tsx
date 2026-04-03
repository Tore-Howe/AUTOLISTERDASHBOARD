export default function OverviewPage() {
  return (
    <div style={{ padding: '32px', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 800 }}>Overview</h1>
          <p style={{ fontSize: '14px', color: '#9aa0aa', marginTop: '4px' }}>Welcome to AutoList</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Active listings', value: '0', sub: 'Connect Supabase to track' },
          { label: 'Listed this month', value: '0', sub: 'Install extension to start' },
          { label: 'AI descriptions', value: '0', sub: 'Add API key in extension' },
          { label: 'Monthly revenue', value: '$0', sub: 'Connect Stripe to track' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#9aa0aa', marginBottom: '8px' }}>{s.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 500, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '12px', color: '#9aa0aa', marginTop: '4px' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>🚗 AutoList is deployed!</p>
        <p style={{ fontSize: '14px', color: '#9aa0aa', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
          Your dashboard is live. Next steps: connect Supabase for data, Stripe for billing, and install the Chrome extension.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: '1. Set up Supabase', href: 'https://supabase.com' },
            { label: '2. Set up Stripe', href: 'https://dashboard.stripe.com' },
            { label: '3. Install extension', href: '#' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ background: '#f5f6fa', border: '1px solid rgba(0,0,0,0.08)', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', color: '#0f1117', textDecoration: 'none', fontWeight: 500 }}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
