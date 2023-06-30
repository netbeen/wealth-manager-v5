import { NextRequest, NextResponse } from 'next/server'
import { usingMiddleware } from '@/utils/serverCommon'
import { listTeamByUserId } from '@/utils/team'
import { User } from '@/utils/user'

async function handler(req: NextRequest, user?: User) {
  const teamList = await listTeamByUserId(user?.id ?? '')
  return NextResponse.json(teamList)
}

export const GET = usingMiddleware(handler)
