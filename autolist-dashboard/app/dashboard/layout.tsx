import Link from 'next/link'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#f5f6fa' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}a{text-decoration:none;}`}</style>

      <aside style={{ width: '220px', background: '#fff', borderRight: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Link href="/dashboard/overview" style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 800, color: '#0f1117' }}>
            Auto<span style={{ color: '#1877f2' }}>List</span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { href: '/dashboard/overview', label: 'Overview', icon: '▦' },
            { href: '/dashboard/listings', label: 'Listings', icon: '≡' },
            { href: '/dashboard/users',    label: 'Users',    icon: '⊹' },
            { href: '/dashboard/billing',  label: 'Billing',  icon: '$' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', fontSize: '14px', color: '#5a6270' }}>
              <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Link href="/auth/login" style={{ fontSize: '13px', color: '#9aa0aa' }}>Sign out</Link>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
