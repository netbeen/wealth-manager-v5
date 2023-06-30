import { NextRequest, NextResponse } from 'next/server'
import { SESSION_TOKEN_COOKIE_NAME } from '@/constants'
import { getLoginUserByJwtToken } from '@/utils/user'
import { StatusCodes } from 'http-status-codes'
import { User, Team } from '.prisma/client/index'

const pathWithoutAuthentication = ['/api/user/login']

export const usingMiddleware = (
  handler: (req: NextRequest, user?: User, team?: Team) => Promise<NextResponse>
) => {
  return async function (req: NextRequest) {
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

    try {
      return await handler(req, user, {} as Team)
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
