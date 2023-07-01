import prismaClient from '@@/lib/prismaClient'
import { Team as PrismaTeam } from '.prisma/client/index'

export type Team = PrismaTeam

export const listTeamByUserId = async (userId: string) => {
  return (await prismaClient.team.findMany({
    where: {
      OR: [
        {
          admins: {
            has: userId,
          },
        },
        {
          collaborators: {
            has: userId,
          },
        },
        {
          visitors: {
            has: userId,
          },
        },
      ],
    },
  })) as Team[]
}
