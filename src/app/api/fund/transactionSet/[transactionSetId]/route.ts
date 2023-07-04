import { NextRequest, NextResponse } from 'next/server'
import { getFundTransactions } from '@/utils/fundTransacation'

async function handler(
  req: NextRequest,
  { params }: { params: { transactionSetId: string } }
) {
  return NextResponse.json({
    data: await getFundTransactions(params.transactionSetId),
  })
}

export const GET = handler
