import { NextRequest, NextResponse } from 'next/server'
import { usingMiddleware } from '@/utils/serverCommon'
import { getFundData } from '@/utils/fund'

async function handler(
  req: NextRequest,
  { params }: { params: { id: string; attribute: string } }
) {
  const { attribute, id } = params
  return NextResponse.json(await getFundData(id, attribute))
}

export const GET = usingMiddleware(handler)
