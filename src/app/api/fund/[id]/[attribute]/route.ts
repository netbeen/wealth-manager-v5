import { NextRequest, NextResponse } from 'next/server'
import { kvGet, kvSet, usingMiddleware } from '@/utils/serverCommon'
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

const method: Record<AllowedAttribute, (identifier: string) => Promise<any>> = {
  [AllowedAttribute['basic-info']]: fetchBasicInfoByIdentifier,
  [AllowedAttribute['unit-price']]: fetchUnitPriceByIdentifier,
  [AllowedAttribute['accumulated-price']]: fetchAccumulatedPriceByIdentifier,
  [AllowedAttribute.split]: fetchSplitByIdentifier,
  [AllowedAttribute.dividend]: fetchDividendByIdentifier,
}

const cacheExpireTime: Record<AllowedAttribute, number> = {
  [AllowedAttribute['basic-info']]: 3600 * 24 * 7,
  [AllowedAttribute['unit-price']]: 60,
  [AllowedAttribute['accumulated-price']]: 60,
  [AllowedAttribute.split]: 60,
  [AllowedAttribute.dividend]: 60,
}

async function handler(
  req: NextRequest,
  { params }: { params: { id: string; attribute: string } }
) {
  const { attribute, id } = params
  const validAttribute = Object.values(AllowedAttribute).includes(
    attribute as AllowedAttribute
  )
  if (!validAttribute) {
    throw new Error(`无效的基金 attribute: ${attribute}`)
  }
  const cacheKey = `${id}_${attribute}`
  const cachedData = await kvGet<any>(cacheKey)
  if (cachedData) {
    return NextResponse.json(await cachedData)
  }
  const networkData = {
    data: await method[attribute as AllowedAttribute](id),
  }
  await kvSet(
    cacheKey,
    networkData,
    cacheExpireTime[attribute as AllowedAttribute]
  )
  return NextResponse.json({
    ...networkData,
    kvHit: false,
  })
}

export const GET = usingMiddleware(handler)
