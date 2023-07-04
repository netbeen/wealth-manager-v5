import {
  FundTransaction as PrismaFundTransaction,
  FundTransactionDirection as PrismaPrismaFundTransaction,
} from '.prisma/client/index'
import prismaClient from '../../lib/prismaClient'
import { Team } from '@/utils/team'
import {
  findOrCreateFundTransactionSet,
  FundTransactionSet,
  FundTransactionSetStatus,
} from '@/utils/fundTransacationSet'

export type FundTransaction = PrismaFundTransaction

export const FundTransactionDirection = PrismaPrismaFundTransaction

export const createFundTransaction = async ({
  fundId,
  team,
  date,
  direction,
  volume,
  commission,
}: {
  fundId: string
  team: Team
  date: Date
  direction: (typeof FundTransactionDirection)[keyof typeof FundTransactionDirection]
  volume: number
  commission: number
}): Promise<FundTransaction> => {
  const fundTransactionSet = await findOrCreateFundTransactionSet({
    fundId,
    team,
    shouldExist: direction === FundTransactionDirection.SELL,
  })
  const createResult = await prismaClient.fundTransaction.create({
    data: {
      fundTransactionSetId: fundTransactionSet.id,
      date,
      direction,
      volume,
      commission,
    },
  })
  if (direction === FundTransactionDirection.SELL) {
    // 检测是否已经清仓
    const fundTransactions = await getFundTransactions(fundTransactionSet.id)
    const totalVolume = fundTransactions.reduce((accumulator, item) => {
      if (item.direction === FundTransactionDirection.BUY) {
        return accumulator + item.volume
      } else {
        return accumulator - item.volume
      }
    }, 0)
    if (totalVolume === 0) {
      await prismaClient.fundTransactionSet.update({
        where: {
          id: fundTransactionSet.id,
        },
        data: {
          status: FundTransactionSetStatus.CLEARED,
        },
      })
    }
  }
  return createResult
}

export const getFundTransactions = async (fundTransactionSetId: string) => {
  return await prismaClient.fundTransaction.findMany({
    where: {
      fundTransactionSetId,
    },
  })
}
