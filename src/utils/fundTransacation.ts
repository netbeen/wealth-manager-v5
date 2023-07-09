import {
  FundTransaction as PrismaFundTransaction,
  FundTransactionDirection as PrismaPrismaFundTransaction,
} from '.prisma/client/index'
import prismaClient from '../../lib/prismaClient'
import { Team } from '@/utils/team'
import {
  findOrCreateFundTransactionSet,
  FundTransactionSetStatus,
} from '@/utils/fundTransacationSet'
import { calcVolume, DateSplitRatio } from 'fund-tools'
import dayjs from 'dayjs'
import { getFundData } from '@/utils/fund'
import { Operation } from 'fund-tools/src/return'
import almostEqual from 'almost-equal'

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
  if (direction === FundTransactionDirection.SELL) {
    // 检测是否已经清仓
    const existFundTransactions = await getFundTransactions(
      fundTransactionSet.id
    )
    const operationsForVolumeCheck = [
      ...existFundTransactions.map((fundTransaction) => ({
        date: dayjs(fundTransaction.date),
        direction: fundTransaction.direction,
        volume: fundTransaction.volume,
        commission: fundTransaction.commission,
      })),
      {
        date: dayjs(date),
        direction,
        volume,
        commission,
      },
    ] as Operation[]
    const splits = (await getFundData(fundId, 'split')).data as DateSplitRatio[]
    const totalVolume = calcVolume(splits, operationsForVolumeCheck)
    if (
      almostEqual(
        totalVolume,
        0,
        almostEqual.FLT_EPSILON,
        almostEqual.FLT_EPSILON
      )
    ) {
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
  return await prismaClient.fundTransaction.create({
    data: {
      fundTransactionSetId: fundTransactionSet.id,
      date,
      direction,
      volume,
      commission,
    },
  })
}

export const getFundTransactions = async (fundTransactionSetId: string) => {
  return await prismaClient.fundTransaction.findMany({
    where: {
      fundTransactionSetId,
    },
  })
}
