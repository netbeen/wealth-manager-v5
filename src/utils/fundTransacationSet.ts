import {
  FundTransactionSet as PrismaFundTransactionSet,
  FundTransactionSetStatus as PrismaFundTransactionSetStatus,
} from '.prisma/client/index'
import prismaClient from '../../lib/prismaClient'
import { Team } from '@/utils/team'

export type FundTransactionSet = PrismaFundTransactionSet

export const FundTransactionSetStatus = PrismaFundTransactionSetStatus

export const isFundTransactionSetStatus = (
  input: string
): input is PrismaFundTransactionSetStatus => {
  return Object.keys(FundTransactionSetStatus).includes(input)
}

export const findOrCreateFundTransactionSet = async ({
  fundId,
  team,
  shouldExist,
}: {
  fundId: string
  team: Team
  shouldExist: boolean
}): Promise<FundTransactionSet> => {
  const existFundTransactionSet =
    await prismaClient.fundTransactionSet.findFirst({
      where: {
        teamId: team.id,
        fundId,
        status: FundTransactionSetStatus.HOLDING,
      },
    })
  if (existFundTransactionSet) {
    return existFundTransactionSet
  } else if (shouldExist) {
    throw new Error(
      `未找到 fundId=${fundId} 的 fundTransactionSet (shouldExist)`
    )
  }
  return await prismaClient.fundTransactionSet.create({
    data: {
      teamId: team.id,
      fundId,
      status: FundTransactionSetStatus.HOLDING,
    },
  })
}

export const getTransactionSets = async (
  team: Team,
  status: PrismaFundTransactionSetStatus
): Promise<FundTransactionSet[]> => {
  return await prismaClient.fundTransactionSet.findMany({
    where: {
      teamId: team.id,
      status,
    },
  })
}

export const getTransactionSetById = async (
  id: string
): Promise<FundTransactionSet> => {
  return await prismaClient.fundTransactionSet.findUniqueOrThrow({
    where: {
      id,
    },
  })
}
