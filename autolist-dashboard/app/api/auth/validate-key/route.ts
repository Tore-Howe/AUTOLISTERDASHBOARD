import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

// Called by the Chrome extension to validate a license key
export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json()
    if (!key) return NextResponse.json({ valid: false, error: 'No key provided' }, { status: 400 })

    const supabase = createAdminSupabaseClient()

    // Look up the license key
    const { data: license, error } = await supabase
      .from('license_keys')
      .select('*, profiles(*), organizations(*)')
      .eq('key', key)
      .eq('is_active', true)
      .single()

    if (error || !license) {
      return NextResponse.json({ valid: false, error: 'Invalid or inactive license key' }, { status: 401 })
    }

    // Check org subscription is active
    const org = license.organizations
    const validStatuses = ['active', 'trialing']
    if (!validStatuses.includes(org.subscription_status)) {
      return NextResponse.json({ valid: false, error: 'Subscription expired. Please renew at autolist.thresholddigital.com' }, { status: 402 })
    }

    // Update last used
    await supabase
      .from('license_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', license.id)

    return NextResponse.json({
      valid: true,
      user: {
        id: license.profiles.id,
        name: license.profiles.full_name,
        email: license.profiles.email,
      },
      org: {
        id: org.id,
        name: org.name,
        plan: org.subscription_plan,
      }
    })
  } catch (e: any) {
    return NextResponse.json({ valid: false, error: e.message }, { status: 500 })
  }
}
