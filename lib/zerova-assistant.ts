// lib/zerova-assistant.ts
// Core assistant logic — mode detection, prompt composition, API calls

import { buildBasePrompt } from './prompts/base'
import { getModeBlock, type SessionMode } from './prompts/modes'
import { DETECTION_PROMPT } from './prompts/detection'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface RelationalProfile {
  // From profiles table
  userName: string
  usageMode: string
  relationshipDuration: string
  relationshipStatus: string
  locale: string

  // From relational_profiles table
  dominantHorsemen: string[]
  attachmentStyle: string
  emotionalStyle: string
  primaryFrictionArea: string | null
  skillsInDevelopment: Record<string, string>
  pendingConversations: string[]
  recentEmotions: string[]

  // From get_temporal_context() function
  currentDate: string
  daysSinceLastSession: number | null
  lastSessionTopic: string | null
  lastSessionMode: string | null
  checkinStreak: number
  trialDaysRemaining: number
}

export interface TemporalContext {
  current_date: string
  days_since_last_session: number | null
  last_session_topic: string | null
  last_session_mode: string | null
  checkin_streak: number
  trial_days_remaining: number
}

// Language name map for prompt injection
const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish', en: 'English', pt: 'Portuguese',
  fr: 'French', de: 'German', it: 'Italian',
  nl: 'Dutch', pl: 'Polish', tr: 'Turkish',
  ja: 'Japanese', ko: 'Korean', ru: 'Russian',
  hi: 'Hindi', id: 'Indonesian', sv: 'Swedish', no: 'Norwegian',
  ar: 'Arabic',
}

// ─────────────────────────────────────────────────────────────
// CLINICAL PARAMETER MAPPERS
// Map stored profile values to typed clinical parameters
// for buildBasePrompt
// ─────────────────────────────────────────────────────────────

type DetectedHorseman = 'criticism' | 'contempt' | 'defensiveness' | 'stonewalling' | null
type DetectedCycle = 'pursue-withdraw' | 'attack-attack' | 'withdraw-withdraw' | null
type DetectedAttachment = 'anxious' | 'avoidant' | 'disorganized' | 'secure' | null
type DetectedCognition = 'absolutism' | 'mind-reading' | 'attribution' | 'catastrophizing' | 'standard' | 'assumption' | null

const HORSEMAN_MAP: Record<string, DetectedHorseman> = {
  'criticism':     'criticism',
  'contempt':      'contempt',
  'defensiveness': 'defensiveness',
  'stonewalling':  'stonewalling',
}

const ATTACHMENT_MAP: Record<string, DetectedAttachment> = {
  'anxious':       'anxious',
  'avoidant':      'avoidant',
  'disorganized':  'disorganized',
  'secure':        'secure',
}

// Extract the most clinically relevant horseman from the stored array
function mapDominantHorseman(horsemen: string[]): DetectedHorseman {
  if (!horsemen || horsemen.length === 0) return null
  // Priority order: contempt > criticism > defensiveness > stonewalling
  const priority: DetectedHorseman[] = ['contempt', 'criticism', 'defensiveness', 'stonewalling']
  for (const h of priority) {
    if (horsemen.includes(h!)) return h
  }
  return HORSEMAN_MAP[horsemen[0]] ?? null
}

function mapAttachmentStyle(style: string): DetectedAttachment {
  return ATTACHMENT_MAP[style?.toLowerCase()] ?? null
}

// Build the relational profile block for injection into Block 3
export function buildProfileBlock(profile: RelationalProfile): string {
  const horsemen = profile.dominantHorsemen.length > 0
    ? profile.dominantHorsemen.join(', ')
    : 'none identified yet'

  const skills = Object.keys(profile.skillsInDevelopment).length > 0
    ? Object.entries(profile.skillsInDevelopment)
        .map(([skill, stage]) => `${skill}: ${stage}`)
        .join(', ')
    : 'none started yet'

  const pending = profile.pendingConversations.length > 0
    ? profile.pendingConversations.join('; ')
    : 'none flagged'

  const recentEmotions = profile.recentEmotions.length > 0
    ? profile.recentEmotions.join(', ')
    : 'not yet recorded'

  const daysSince = profile.daysSinceLastSession !== null
    ? `${profile.daysSinceLastSession} days ago`
    : 'this is the first session'

  return `
NAME: ${profile.userName}
USAGE MODE: ${profile.usageMode || 'unknown'}
RELATIONSHIP DURATION: ${profile.relationshipDuration || 'unknown'}
CURRENT STATUS: ${profile.relationshipStatus}
PRIMARY FRICTION AREA: ${profile.primaryFrictionArea || 'unknown'}
EMOTIONAL STYLE: ${profile.emotionalStyle}

DOMINANT HORSEMEN IDENTIFIED: ${horsemen}
INFERRED ATTACHMENT STYLE: ${profile.attachmentStyle}
SKILLS IN DEVELOPMENT: ${skills}

LAST SESSION: ${daysSince}
LAST SESSION TOPIC: ${profile.lastSessionTopic || 'none'}
LAST SESSION MODE: ${profile.lastSessionMode || 'none'}
RECENT EMOTIONS REPORTED: ${recentEmotions}
PENDING CONVERSATIONS: ${pending}
CHECK-IN STREAK: ${profile.checkinStreak} days

CURRENT DATE: ${profile.currentDate}
TRIAL DAYS REMAINING: ${profile.trialDaysRemaining}
`.trim()
}

// Layer 1: Detect which mode to activate
export async function detectMode(userMessage: string): Promise<SessionMode> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 50,
        system: DETECTION_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    const data = await response.json()
    const text = data.content[0]?.text || ''
    const parsed = JSON.parse(text.trim())

    if (['safe_space', 'coach', 'checkin'].includes(parsed.mode)) {
      return parsed.mode as SessionMode
    }
  } catch (error) {
    console.error('Mode detection error:', error)
  }

  // Default: safe_space (safest fallback)
  return 'safe_space'
}

// Main: send message to Zerova with full context
export async function sendToZerova(
  userMessage: string,
  profile: RelationalProfile,
  mode: SessionMode,
  conversationHistory: Message[]
): Promise<string> {
  const languageName = LANGUAGE_NAMES[profile.locale] || 'English'
  const profileBlock = buildProfileBlock(profile)
  const modeBlock = getModeBlock(mode)

  // Map stored profile values to typed clinical parameters
  const detectedHorseman: DetectedHorseman = mapDominantHorseman(profile.dominantHorsemen)
  const detectedAttachment: DetectedAttachment = mapAttachmentStyle(profile.attachmentStyle)

  // Cycle detection is session-level — defaulting to null here.
  // Will be populated in a future layer when session-level pattern
  // detection is implemented.
  const detectedCycle: DetectedCycle = null

  // Cognition detection is conversation-level — defaulting to null here.
  // Zerova will detect and respond to cognitive patterns from the
  // CBCT block without needing a pre-classified type.
  const detectedCognition: DetectedCognition = null

  const systemPrompt = buildBasePrompt(
    profileBlock,
    modeBlock,
    languageName,
    detectedHorseman,
    detectedCycle,
    detectedAttachment,
    detectedCognition
  )

  // Keep last 10 messages for context (5 exchanges)
  // Older messages are summarized in the session_summary field of the profile
  const recentHistory = conversationHistory.slice(-10)

  const messages = recentHistory.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }))

  // Add current message
  messages.push({ role: 'user', content: userMessage })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error calling Claude API')
    }

    return data.content[0].text
  } catch (error) {
    console.error('Zerova API error:', error)
    throw error
  }
}
