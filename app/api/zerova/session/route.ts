// app/api/zerova/session/route.ts
// Create a new session (POST) or close/update an existing one (PATCH)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: Create new session
export async function POST(request: NextRequest) {
  try {
    const { mode } = await request.json()
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: session, error } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, mode })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Close session and save tracking data
export async function PATCH(request: NextRequest) {
  try {
    const {
      sessionId,
      emotionsDetected,
      horsemenIdentified,
      attachmentSignal,
      topic,
      skillWorked,
      skillStage,
      experimentAssigned,
      confidenceScore,
      connectionScore,
      patternSurfaced,
      sessionSummary,
    } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get session to calculate duration
    const { data: existingSession } = await supabase
      .from('sessions')
      .select('started_at')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    const durationSeconds = existingSession
      ? Math.floor(
          (new Date().getTime() - new Date(existingSession.started_at).getTime()) / 1000
        )
      : null

    // Update session
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        ended_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
        emotions_detected: emotionsDetected || [],
        horsemen_identified: horsemenIdentified || [],
        attachment_signal: attachmentSignal || null,
        topic: topic || null,
        skill_worked: skillWorked || null,
        skill_stage: skillStage || null,
        experiment_assigned: experimentAssigned || null,
        confidence_score: confidenceScore || null,
        connection_score: connectionScore || null,
        pattern_surfaced: patternSurfaced || null,
        session_summary: sessionSummary || null,
      })
      .eq('id', sessionId)
      .eq('user_id', user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Update relational profile counters and recent data
    const { data: relProfile } = await supabase
      .from('relational_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (relProfile) {
      // Update recent emotions (keep last 5)
      const updatedEmotions = emotionsDetected?.length
        ? [...(relProfile.recent_emotions || []), ...emotionsDetected].slice(-5)
        : relProfile.recent_emotions

      // Update dominant horsemen (add new ones detected)
      const updatedHorsemen = Array.from(
        new Set([
          ...(relProfile.dominant_horsemen || []),
          ...(horsemenIdentified || []),
        ])
      )

      // Update skills if worked
      const updatedSkills = { ...(relProfile.skills_in_development as Record<string, string> || {}) }
      if (skillWorked && skillStage) {
        updatedSkills[skillWorked] = skillStage
      }

      // Update session counters
      const modeField = {
        safe_space: 'safe_space_sessions',
        coach: 'coach_sessions',
        checkin: 'checkin_sessions',
      }

      await supabase
        .from('relational_profiles')
        .update({
          recent_emotions: updatedEmotions,
          dominant_horsemen: updatedHorsemen,
          skills_in_development: updatedSkills,
          total_sessions: (relProfile.total_sessions || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
