import { NextRequest, NextResponse } from 'next/server'
import { usingMiddleware } from '@/utils/serverCommon'
import { TEAM_COOKIE_NAME } from '@/constants'

async function handler(req: NextRequest) {
  const { teamId } = await req.json()
  const res = NextResponse.json(teamId)
  res.cookies.set(TEAM_COOKIE_NAME, teamId, {
    httpOnly: true,
    expires: Date.now() + 1000 * 3600 * 24,
  })
  return res
}

export const POST = usingMiddleware(handler)
