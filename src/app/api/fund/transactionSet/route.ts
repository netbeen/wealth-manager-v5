import { NextRequest, NextResponse } from 'next/server'
import { usingMiddleware } from '@/utils/serverCommon'
import { User } from '@/utils/user'
import { Team } from '@/utils/team'
import { getHoldingTransactionSets } from '@/utils/fundTransacationSet'

async function handler(
  req: NextRequest,
  _useless: { params: { transactionSetId: string } },
  user?: User,
  team?: Team
) {
  return NextResponse.json({
    data: await getHoldingTransactionSets(team as Team),
  })
}

export const GET = usingMiddleware(handler)
