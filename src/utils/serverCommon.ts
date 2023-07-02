import { NextRequest, NextResponse } from 'next/server'
import { SESSION_TOKEN_COOKIE_NAME, TEAM_COOKIE_NAME } from '@/constants'
import { getLoginUserByJwtToken } from '@/utils/user'
import { StatusCodes } from 'http-status-codes'
import { Team, User } from '.prisma/client/index'
import prismaClient from '@@/lib/prismaClient'
import { kv } from '@vercel/kv'

const pathWithoutAuthentication = ['/api/user/login']

export const usingMiddleware = (
  handler: (
    req: NextRequest,
    params: any,
    user?: User,
    team?: Team
  ) => Promise<NextResponse>
) => {
  return async function (req: NextRequest, params: any) {
    let user: User | undefined = undefined
    if (!pathWithoutAuthentication.includes(new URL(req.url).pathname)) {
      const jwtToken = req.cookies.get(SESSION_TOKEN_COOKIE_NAME)?.value
      const loginUser = await getLoginUserByJwtToken(jwtToken)
      if (!loginUser) {
        return NextResponse.json(
          {
            errorMessage: 'UNAUTHORIZED',
          },
          {
            status: StatusCodes.UNAUTHORIZED,
          }
        )
      } else {
        user = loginUser
      }
    }

    let team: Team | undefined = undefined
    const teamId = req.cookies.get(TEAM_COOKIE_NAME)?.value
    if (teamId) {
      team =
        (await prismaClient.team.findUnique({
          where: { id: teamId },
        })) ?? undefined
    }

    try {
      return await handler(req, params, user, team)
    } catch (e) {
      console.error('Error', e)
      return NextResponse.json(
        { errorMessage: (e as Error).message ?? '' },
        {
          status: StatusCodes.BAD_REQUEST,
        }
      )
    }
  }
}

export async function kvGet<T>(key: string): Promise<T | null> {
  return await kv.get<T>(key)
}

export async function kvSet<T>(
  key: string,
  value: T,
  ex: number // Set the specified expire time, in seconds. https://redis.io/commands/set/
): Promise<void> {
  await kv.set<T>(
    key,
    {
      ...value,
      kvUpdatedAt: new Date().toString(),
      kvHit: true,
    },
    { ex }
  )
}
