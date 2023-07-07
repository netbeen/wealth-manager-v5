import { kvGet, kvSet } from '@/utils/serverCommon'
import {
  fetchUnitPriceByIdentifier,
  fetchSplitByIdentifier,
  fetchDividendByIdentifier,
  fetchAccumulatedPriceByIdentifier,
  fetchBasicInfoByIdentifier,
  DatePrice,
  DateDividend,
  DateSplitRatio,
  BasicInfo,
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

export type DataType = DatePrice | DateDividend | DateSplitRatio | BasicInfo

export const getFundData = async (id: string, attribute: string) => {
  const validAttribute = Object.values(AllowedAttribute).includes(
    attribute as AllowedAttribute
  )
  if (!validAttribute) {
    throw new Error(`无效的基金 attribute: ${attribute}`)
  }
  const cacheKey = `${id}_${attribute}`
  const cachedData = await kvGet<{
    data: DataType[]
    kvUpdatedAt: string
    kvHit: boolean
  }>(cacheKey)
  if (cachedData) {
    return cachedData
  }
  const networkData = {
    data: (await method[attribute as AllowedAttribute](id)) as DataType[],
  }
  await kvSet(
    cacheKey,
    networkData,
    cacheExpireTime[attribute as AllowedAttribute]
  )
  return {
    ...networkData,
    kvHit: false,
  }
}
