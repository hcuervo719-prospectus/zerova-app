// app/api/zerova/profile/route.ts
// Save onboarding data to profiles and relational_profiles

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { usageMode, relationshipDuration, relationshipStatus, primaryFrictionArea } =
      await request.json()

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update profiles table
    await supabase
      .from('profiles')
      .update({
        usage_mode: usageMode,
        relationship_duration: relationshipDuration,
        relationship_status: relationshipStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    // Update relational_profiles table
    await supabase
      .from('relational_profiles')
      .update({
        primary_friction_area: primaryFrictionArea,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
