// app/api/zerova/chat/route.ts
// Main chat endpoint — detects mode, builds prompt, calls Claude, saves to DB

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { detectMode, sendToZerova, type RelationalProfile, type Message } from '@/lib/zerova-assistant'
import type { SessionMode } from '@/lib/prompts/modes'

export async function POST(request: NextRequest) {
  try {
    const { userMessage, sessionId, conversationHistory, forcedMode } =
      await request.json()

    if (!userMessage) {
      return NextResponse.json({ error: 'Missing userMessage' }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Verify auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Check access (trial or active subscription)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const hasAccess =
      profile.subscription_status === 'active' ||
      (profile.subscription_status === 'trial' &&
        new Date(profile.trial_ends_at) > new Date())

    if (!hasAccess) {
      return NextResponse.json({ error: 'TRIAL_EXPIRED' }, { status: 403 })
    }

    // 3. Get relational profile
    const { data: relProfile } = await supabase
      .from('relational_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // 4. Get temporal context from Supabase function
    const { data: temporalCtx } = await supabase
      .rpc('get_temporal_context', { p_user_id: user.id })

    // 5. Build profile object
    const assistantProfile: RelationalProfile = {
      userName: profile.full_name?.split(' ')[0] || 'there',
      usageMode: profile.usage_mode || 'unknown',
      relationshipDuration: profile.relationship_duration || 'unknown',
      relationshipStatus: profile.relationship_status || 'unknown',
      locale: profile.locale || 'en',
      dominantHorsemen: relProfile?.dominant_horsemen || [],
      attachmentStyle: relProfile?.attachment_style || 'unknown',
      emotionalStyle: relProfile?.emotional_style || 'unknown',
      primaryFrictionArea: relProfile?.primary_friction_area || null,
      skillsInDevelopment: (relProfile?.skills_in_development as Record<string, string>) || {},
      pendingConversations: relProfile?.pending_conversations || [],
      recentEmotions: relProfile?.recent_emotions || [],
      currentDate: temporalCtx?.current_date || new Date().toDateString(),
      daysSinceLastSession: temporalCtx?.days_since_last_session ?? null,
      lastSessionTopic: temporalCtx?.last_session_topic || null,
      lastSessionMode: temporalCtx?.last_session_mode || null,
      checkinStreak: temporalCtx?.checkin_streak || 0,
      trialDaysRemaining: temporalCtx?.trial_days_remaining || 0,
    }

    // 6. Layer 1: Detect mode (or use forced mode for continuation)
    const mode: SessionMode = forcedMode || await detectMode(userMessage)

    // 7. Call Zerova
    const assistantResponse = await sendToZerova(
      userMessage,
      assistantProfile,
      mode,
      conversationHistory || []
    )

    // 8. Save messages to DB
    if (sessionId) {
      await supabase.from('conversation_messages').insert([
        {
          session_id: sessionId,
          user_id: user.id,
          role: 'user',
          content: userMessage,
        },
        {
          session_id: sessionId,
          user_id: user.id,
          role: 'assistant',
          content: assistantResponse,
        },
      ])
    }

    // 9. Update trial session count
    if (profile.subscription_status === 'trial') {
      await supabase
        .from('profiles')
        .update({ trial_sessions_used: (profile.trial_sessions_used || 0) + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json({
      response: assistantResponse,
      mode,
    })

  } catch (error) {
    console.error('Chat endpoint error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
