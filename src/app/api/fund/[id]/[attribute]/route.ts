import { NextRequest, NextResponse } from 'next/server'
import { usingMiddleware } from '@/utils/serverCommon'
import { getFundData, isAllowedAttribute } from '@/utils/fund'

async function handler(
  req: NextRequest,
  { params }: { params: { id: string; attribute: string } }
) {
  const { attribute, id } = params
  if (isAllowedAttribute(attribute)) {
    return NextResponse.json(await getFundData(id, attribute))
  } else {
    throw new Error(`无效的基金 attribute: ${attribute}`)
  }
}

export const GET = usingMiddleware(handler)
