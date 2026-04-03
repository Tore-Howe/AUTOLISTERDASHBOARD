import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'

// Called by the Chrome extension to log a listing
export async function POST(req: NextRequest) {
  try {
    const { license_key, listing } = await req.json()
    if (!license_key) return NextResponse.json({ error: 'No license key' }, { status: 401 })

    const supabase = createAdminSupabaseClient()

    // Validate key
    const { data: license } = await supabase
      .from('license_keys')
      .select('user_id, organization_id')
      .eq('key', license_key)
      .eq('is_active', true)
      .single()

    if (!license) return NextResponse.json({ error: 'Invalid key' }, { status: 401 })

    // Save listing
    const { data, error } = await supabase
      .from('listings')
      .insert({
        user_id: license.user_id,
        organization_id: license.organization_id,
        title: listing.title,
        year: listing.year,
        make: listing.make,
        model: listing.model,
        trim: listing.trim,
        price: listing.price ? parseInt(listing.price) : null,
        miles: listing.miles ? parseInt(listing.miles.replace(/,/g, '')) : null,
        vin: listing.vin,
        color: listing.color,
        interior: listing.interior,
        engine: listing.engine,
        transmission: listing.transmission,
        condition: listing.condition,
        ai_description: listing.ai_description,
        image_urls: listing.imageUrls || [],
        source_url: listing.sourceUrl,
        status: 'active',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, listing_id: data.id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
