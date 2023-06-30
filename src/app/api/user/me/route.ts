import { NextRequest, NextResponse } from 'next/server'
import { usingMiddleware } from '@/utils/serverCommon'
import { User } from '@/utils/user'

async function handler(req: NextRequest, user?: User) {
  return NextResponse.json(user)
}

export const GET = usingMiddleware(handler)
