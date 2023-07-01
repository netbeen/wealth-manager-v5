import { NextResponse } from 'next/server'
import { SESSION_TOKEN_COOKIE_NAME, TEAM_COOKIE_NAME } from '@/constants'

async function handler() {
  const res = NextResponse.json(null)
  res.cookies.delete(SESSION_TOKEN_COOKIE_NAME)
  res.cookies.delete(TEAM_COOKIE_NAME)
  return res
}

export const POST = handler
