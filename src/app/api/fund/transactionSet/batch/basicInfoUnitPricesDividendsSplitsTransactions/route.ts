import { NextRequest, NextResponse } from 'next/server'
import { getFundTransactions } from '@/utils/fundTransacation'
import { AllowedAttribute, getFundData } from '@/utils/fund'
import { getTransactionSetById } from '@/utils/fundTransacationSet'

async function handler(req: NextRequest) {
  const transactionSetIds =
    new URL(req.url).searchParams.get('transactionSetIds')?.split(',') ?? []
  const result = []
  for (const transactionSetId of transactionSetIds) {
    const fundTransactionSet = await getTransactionSetById(transactionSetId)
    result.push({
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
    })
  }
  return NextResponse.json({
    data: result,
  })
}

export const GET = handler
