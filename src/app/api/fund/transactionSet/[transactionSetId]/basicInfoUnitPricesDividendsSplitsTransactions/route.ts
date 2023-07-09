import { NextRequest, NextResponse } from 'next/server'
import { FundTransaction, getFundTransactions } from '@/utils/fundTransacation'
import { AllowedAttribute, getFundData } from '@/utils/fund'
import { getTransactionSetById } from '@/utils/fundTransacationSet'
import { BasicInfo, DateDividend, DatePrice, DateSplitRatio } from 'fund-tools'

export interface BasicInfoUnitPricesDividendsSplitsTransactionsData {
  basicInfo: {
    kvHit: boolean
    data: BasicInfo
  }
  unitPrices: {
    kvHit: boolean
    data: DatePrice[]
  }
  dividends: {
    kvHit: boolean
    data: DateDividend[]
  }
  splits: {
    kvHit: boolean
    data: DateSplitRatio[]
  }
  transactions: FundTransaction[]
}

async function handler(
  req: NextRequest,
  { params }: { params: { transactionSetId: string } }
) {
  const { transactionSetId } = params
  const fundTransactionSet = await getTransactionSetById(transactionSetId)
  return NextResponse.json({
    data: {
      basicInfo: await getFundData(
        fundTransactionSet.fundId,
        AllowedAttribute.basicInfo
      ),
      unitPrices: await getFundData(
        fundTransactionSet.fundId,
        AllowedAttribute.unitPrice
      ),
      dividends: await getFundData(
        fundTransactionSet.fundId,
        AllowedAttribute.dividend
      ),
      splits: await getFundData(
        fundTransactionSet.fundId,
        AllowedAttribute.split
      ),
      transactions: await getFundTransactions(transactionSetId),
    },
  })
}

export const GET = handler
