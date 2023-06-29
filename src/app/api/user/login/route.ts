import prisma from '../../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import {NextRequest, NextResponse} from 'next/server'
import {SESSION_TOKEN_COOKIE_NAME} from "@/constants";
import {usingMiddleware} from "@/utils/serverCommon";

async function handler(req: NextRequest) {
    const {username, password} = await req.json();
    if(username && password){
        const targetUser = await prisma.user.findFirst({
            where: {
                name: username,
                password: password,
            },
        });
        if(targetUser){
            const res = NextResponse.json({
                ...targetUser,
                password: '',
            });
            res.cookies.set(SESSION_TOKEN_COOKIE_NAME, jwt.sign({ userId: targetUser.id }, process.env.JWT_SECRET ?? '', {
                expiresIn: '1d',
            }), {
                httpOnly: true,
                expires: Date.now() + 1000 * 3600 * 24
            })
            return res;
        }
    }
    throw new Error('用户名或密码错误')
}

export const POST = usingMiddleware(handler);
