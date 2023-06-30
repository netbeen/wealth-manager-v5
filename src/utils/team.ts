import prisma from '@@/lib/prisma'

export const listTeamByUserId = async (userId: string) => {
  return await prisma.team.findMany({
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
  })
}
