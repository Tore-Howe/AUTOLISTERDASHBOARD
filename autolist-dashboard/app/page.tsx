import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f0ece4', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }

        .nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #fff; }
        .logo span { color: #1877f2; }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-links a { font-size: 14px; color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: #fff; }
        .nav-cta { background: #1877f2; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; text-decoration: none; }

        .hero { max-width: 900px; margin: 0 auto; padding: 100px 24px 80px; text-align: center; }
        .badge { display: inline-block; background: rgba(24,119,242,0.15); color: #6ba3f5; border: 1px solid rgba(24,119,242,0.3); padding: 5px 14px; border-radius: 99px; font-size: 12px; font-weight: 500; letter-spacing: 0.5px; margin-bottom: 28px; }
        .hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(40px, 6vw, 72px); font-weight: 800; line-height: 1.05; letter-spacing: -1px; margin-bottom: 20px; }
        .hero h1 span { color: #1877f2; }
        .hero p { font-size: 18px; color: rgba(255,255,255,0.55); max-width: 560px; margin: 0 auto 40px; line-height: 1.7; font-weight: 300; }
        .hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-primary { background: #1877f2; color: #fff; border: none; padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: inherit; text-decoration: none; transition: background 0.2s, transform 0.1s; display: inline-block; }
        .btn-primary:hover { background: #1565d8; transform: translateY(-1px); text-decoration: none; }
        .btn-secondary { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: inherit; text-decoration: none; transition: all 0.2s; display: inline-block; }
        .btn-secondary:hover { border-color: rgba(255,255,255,0.4); color: #fff; text-decoration: none; }

        .features { max-width: 1100px; margin: 0 auto; padding: 80px 24px; }
        .features-label { text-align: center; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 48px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .feature-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 28px; transition: border-color 0.2s; }
        .feature-card:hover { border-color: rgba(24,119,242,0.4); }
        .feature-icon { width: 40px; height: 40px; background: rgba(24,119,242,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 18px; }
        .feature-card h3 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #fff; }
        .feature-card p { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.6; font-weight: 300; }

        .pricing { max-width: 900px; margin: 0 auto; padding: 80px 24px; text-align: center; }
        .pricing h2 { font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800; margin-bottom: 12px; }
        .pricing > p { color: rgba(255,255,255,0.5); margin-bottom: 48px; font-weight: 300; }
        .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; }
        .pricing-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 32px; }
        .pricing-card.featured { background: rgba(24,119,242,0.1); border-color: rgba(24,119,242,0.4); }
        .plan-label { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 12px; }
        .plan-label.blue { color: #6ba3f5; }
        .plan-price { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; color: #fff; line-height: 1; margin-bottom: 4px; }
        .plan-price span { font-size: 16px; font-weight: 400; color: rgba(255,255,255,0.4); }
        .plan-desc { font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 24px; font-weight: 300; }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .plan-features li { font-size: 14px; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 8px; }
        .plan-features li::before { content: '✓'; color: #22a65a; font-weight: 600; }
        .plan-btn { width: 100%; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; border: none; text-align: center; text-decoration: none; display: block; }
        .plan-btn.primary { background: #1877f2; color: #fff; }
        .plan-btn.outline { background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); }

        .cta-section { text-align: center; padding: 80px 24px 100px; }
        .cta-section h2 { font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800; margin-bottom: 16px; }
        .cta-section p { color: rgba(255,255,255,0.5); margin-bottom: 32px; font-weight: 300; }

        .footer { border-top: 1px solid rgba(255,255,255,0.06); padding: 32px 48px; display: flex; align-items: center; justify-content: space-between; }
        .footer p { font-size: 13px; color: rgba(255,255,255,0.3); }

        @media (max-width: 640px) {
          .nav { padding: 16px 20px; }
          .pricing-grid { grid-template-columns: 1fr; }
          .nav-links { display: none; }
        }
      `}</style>

      {/* Nav */}
      <nav className="nav">
        <div className="logo">Auto<span>List</span></div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="mailto:tore@thresholddigital.com">Contact</a>
        </div>
        <Link href="/auth/login" className="nav-cta">Sign in</Link>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="badge">Built for car dealers</div>
        <h1>List cars on Facebook<br /><span>Marketplace in seconds</span></h1>
        <p>Scrape Autotrader listings, generate AI descriptions, and post to Facebook Marketplace — without copying a single field manually.</p>
        <div className="hero-ctas">
          <Link href="/auth/signup" className="btn-primary">Start free 14-day trial</Link>
          <a href="#features" className="btn-secondary">See how it works</a>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <p className="features-label">Everything you need</p>
        <div className="features-grid">
          {[
            { icon: '🔍', title: 'One-click scraping', desc: 'Navigate to any Autotrader listing and click one button. Year, make, model, price, mileage, photos — all captured instantly.' },
            { icon: '✨', title: 'AI descriptions', desc: 'Every listing gets a high-energy, hype-driven description written by AI. Hook, bullet points, call to action — ready to paste.' },
            { icon: '📸', title: 'Photo injection', desc: 'Vehicle photos load in a panel on the Facebook page. Click any thumbnail to inject it directly into the FB uploader.' },
            { icon: '📋', title: 'Copy panel', desc: 'All vehicle details — year, make, model, VIN, price — displayed with one-click copy buttons right on the Facebook listing page.' },
            { icon: '👥', title: 'Team management', desc: 'Add your entire sales team. See who listed what, track active listings, and manage seats from your dealer dashboard.' },
            { icon: '📊', title: 'Listing analytics', desc: 'Track active, sold, and pending listings across your whole dealership. Know your inventory\'s Marketplace presence at a glance.' },
          ].map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <h2>Simple pricing</h2>
        <p>No setup fees. Cancel anytime. 14-day free trial on all plans.</p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <p className="plan-label">Individual</p>
            <div className="plan-price">$59<span>/mo</span></div>
            <p className="plan-desc">For individual salespeople</p>
            <ul className="plan-features">
              <li>1 user seat</li>
              <li>Unlimited listings</li>
              <li>AI descriptions</li>
              <li>Photo injection</li>
              <li>Copy panel</li>
            </ul>
            <Link href="/auth/signup?plan=pro" className="plan-btn outline">Start free trial</Link>
          </div>
          <div className="pricing-card featured">
            <p className="plan-label blue">Dealership</p>
            <div className="plan-price">$79<span>/seat/mo</span></div>
            <p className="plan-desc">For dealership teams</p>
            <ul className="plan-features">
              <li>Unlimited seats</li>
              <li>Unlimited listings</li>
              <li>AI descriptions</li>
              <li>Photo injection</li>
              <li>Team dashboard</li>
              <li>Listing analytics</li>
              <li>Priority support</li>
            </ul>
            <Link href="/auth/signup?plan=dealership" className="plan-btn primary">Start free trial</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to list faster?</h2>
        <p>Join dealers saving hours every week on Facebook Marketplace.</p>
        <Link href="/auth/signup" className="btn-primary">Start your free 14-day trial</Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 AutoList by Threshold Digital</p>
        <p>Built for car dealers in St. Augustine, FL</p>
      </footer>
    </div>
  )
}
