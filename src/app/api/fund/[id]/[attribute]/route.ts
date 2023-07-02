import { NextRequest, NextResponse } from 'next/server'
import { usingMiddleware } from '@/utils/serverCommon'
import {
  fetchUnitPriceByIdentifier,
  fetchSplitByIdentifier,
  fetchDividendByIdentifier,
  fetchAccumulatedPriceByIdentifier,
  fetchBasicInfoByIdentifier,
} from 'fund-tools'

enum AllowedAttribute {
  'basic-info' = 'basic-info',
  'unit-price' = 'unit-price',
  'accumulated-price' = 'accumulated-price',
  'split' = 'split',
  'dividend' = 'dividend',
}

const methods: Record<AllowedAttribute, (identifier: string) => Promise<any>> =
  {
    [AllowedAttribute['basic-info']]: fetchBasicInfoByIdentifier,
    [AllowedAttribute['unit-price']]: fetchUnitPriceByIdentifier,
    [AllowedAttribute['accumulated-price']]: fetchAccumulatedPriceByIdentifier,
    [AllowedAttribute.split]: fetchSplitByIdentifier,
    [AllowedAttribute.dividend]: fetchDividendByIdentifier,
  }

async function handler(
  req: NextRequest,
  { params }: { params: { id: string; attribute: string } }
) {
  const { attribute } = params
  const validAttribute = Object.values(AllowedAttribute).includes(
    attribute as AllowedAttribute
  )
  if (!validAttribute) {
    throw new Error(`无效的基金 attribute: ${attribute}`)
  }
  return NextResponse.json(
    await methods[attribute as AllowedAttribute](params.id)
  )
}

export const GET = usingMiddleware(handler)
