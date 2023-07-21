import { NextRequest, NextResponse } from 'next/server'
import { usingMiddleware } from '@/utils/serverCommon'
import { User } from '@/utils/user'
import { Team } from '@/utils/team'
import {
  getTransactionSets,
  isFundTransactionSetStatus,
} from '@/utils/fundTransacationSet'

async function handler(
  req: NextRequest,
  _useless: { params: { transactionSetId: string } },
  user?: User,
  team?: Team
) {
  const status = new URL(req.url).searchParams.get('status')
  if (!status || !isFundTransactionSetStatus(status)) {
    throw new Error(`status 非法, status=${status}`)
  }
  return NextResponse.json({
    data: await getTransactionSets(team as Team, status),
  })
}

export const GET = usingMiddleware(handler)
