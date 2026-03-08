// app/api/paddle/webhook/route.ts
// Handles Paddle subscription events for Zerova

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventType = body.event_type
    const data = body.data

    console.log('Paddle webhook received:', eventType)

    const supabase = await createClient()

    // Subscription activated (after trial or direct subscribe)
    if (eventType === 'subscription.activated') {
      const userId = data.custom_data?.userId
      if (!userId) {
        return NextResponse.json({ error: 'No userId' }, { status: 400 })
      }

      await supabase.from('subscriptions').insert({
        user_id: userId,
        paddle_subscription_id: data.id,
        paddle_customer_id: data.customer_id,
        status: 'active',
        amount: data.items?.[0]?.price?.unit_price?.amount / 100,
        currency: data.currency_code,
        billing_cycle: 'month',
        current_period_start: data.current_billing_period?.starts_at,
        current_period_end: data.current_billing_period?.ends_at,
      })

      await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_id: data.id,
          subscription_ends_at: data.current_billing_period?.ends_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
    }

    // Subscription renewed
    if (eventType === 'subscription.updated') {
      const subscriptionId = data.id

      await supabase
        .from('subscriptions')
        .update({
          status: data.status,
          current_period_start: data.current_billing_period?.starts_at,
          current_period_end: data.current_billing_period?.ends_at,
          updated_at: new Date().toISOString(),
        })
        .eq('paddle_subscription_id', subscriptionId)

      await supabase
        .from('profiles')
        .update({
          subscription_status: data.status === 'active' ? 'active' : data.status,
          subscription_ends_at: data.current_billing_period?.ends_at,
          updated_at: new Date().toISOString(),
        })
        .eq('subscription_id', subscriptionId)
    }

    // Subscription cancelled
    if (eventType === 'subscription.cancelled') {
      const subscriptionId = data.id

      await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq('paddle_subscription_id', subscriptionId)

      await supabase
        .from('profiles')
        .update({
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('subscription_id', subscriptionId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
