import jwt from 'jsonwebtoken'
import { User as PrismaUser } from '.prisma/client/index'
import prismaClient from '../../lib/prismaClient'

export type User = PrismaUser
export const desensitizeUser: (input: User) => User = (input) => {
  return {
    ...input,
    password: '',
  }
}

export const getLoginUserByJwtToken: (
  jwtToken?: string
) => Promise<User | null> = async (jwtToken) => {
  if (!jwtToken) {
    return null
  }
  const decodedJwt = jwt.verify(jwtToken, process.env.JWT_SECRET ?? '')
  const { userId } = decodedJwt as { userId: string }
  const targetUser = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  })
  if (!targetUser) {
    return null
  } else {
    return desensitizeUser(targetUser)
  }
}
