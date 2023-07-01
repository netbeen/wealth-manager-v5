import { NextRequest, NextResponse } from 'next/server'
import { usingMiddleware } from '@/utils/serverCommon'
import { Team } from '@/utils/team'
import { User } from '@/utils/user'

async function handler(req: NextRequest, user?: User, team?: Team) {
  return NextResponse.json(team)
}

export const GET = usingMiddleware(handler)
