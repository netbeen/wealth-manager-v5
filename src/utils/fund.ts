import { kvGet, kvSet } from '@/utils/serverCommon'
import {
  BasicInfo,
  DateDividend,
  DatePrice,
  DateSplitRatio,
  fetchAccumulatedPriceByIdentifier,
  fetchBasicInfoByIdentifier,
  fetchDividendByIdentifier,
  fetchSplitByIdentifier,
  fetchUnitPriceByIdentifier,
} from 'fund-tools'

export enum AllowedAttribute {
  basicInfo = 'basic-info',
  unitPrice = 'unit-price',
  accumulatedPrice = 'accumulated-price',
  split = 'split',
  dividend = 'dividend',
}

export const isAllowedAttribute = (
  input: string
): input is AllowedAttribute => {
  return Object.values(AllowedAttribute).includes(input as AllowedAttribute)
}

const method: Record<AllowedAttribute, (identifier: string) => Promise<any>> = {
  [AllowedAttribute.basicInfo]: fetchBasicInfoByIdentifier,
  [AllowedAttribute.unitPrice]: fetchUnitPriceByIdentifier,
  [AllowedAttribute.accumulatedPrice]: fetchAccumulatedPriceByIdentifier,
  [AllowedAttribute.split]: fetchSplitByIdentifier,
  [AllowedAttribute.dividend]: fetchDividendByIdentifier,
}

const cacheExpireTime: Record<AllowedAttribute, number> = {
  [AllowedAttribute.basicInfo]: 3600 * 24 * 7,
  [AllowedAttribute.unitPrice]: 60 * 30,
  [AllowedAttribute.accumulatedPrice]: 60 * 30,
  [AllowedAttribute.split]: 60 * 30,
  [AllowedAttribute.dividend]: 60 * 30,
}

export type DataType = DatePrice | DateDividend | DateSplitRatio | BasicInfo

export const getFundData = async (id: string, attribute: AllowedAttribute) => {
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
