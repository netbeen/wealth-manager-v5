import prisma from '../../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import {NextRequest, NextResponse} from 'next/server'
import {
    StatusCodes,
} from 'http-status-codes';
import {SESSION_TOKEN_COOKIE_NAME} from "@/constants";

export async function POST(req: NextRequest) {
    const {username, password} = await req.json();
    if(username && password){
        const targetUser = await prisma.user.findFirst({
            where: {
                username: username,
                password: password,
            },
        });
        if(targetUser){
            const res = NextResponse.json({
                ...targetUser,
                password: null,
            });
            res.cookies.set(SESSION_TOKEN_COOKIE_NAME, jwt.sign({ userId: targetUser.id }, process.env.JWT_SECRET ?? '', {
                expiresIn: '1d',
            }), {
                httpOnly: true,
                expires: Date.now() + 3600 * 24
            })
            return res;
        }
    }
    return NextResponse.json({
        errorMessage: '用户名或密码错误'
    }, {
        status: StatusCodes.FORBIDDEN
    })
}
