import prisma from '../../../../../lib/prisma';
import jwt from 'jsonwebtoken';
import {NextRequest, NextResponse} from 'next/server'
import {SESSION_TOKEN_COOKIE_NAME, TEAM_COOKIE_NAME} from "@/constants";
import {usingMiddleware} from "@/utils/serverCommon";
import {listTeamByUserId} from "@/utils/team";

async function handler(req: NextRequest) {
    const {username, password} = await req.json();
    if(!username || !password){
        throw new Error('用户名和密码必填')
    }
    const targetUser = await prisma.user.findFirst({
        where: {
            name: username,
            password: password,
        },
    });
    if(!targetUser){
        throw new Error('用户名或密码错误')
    }
    const teamList = await listTeamByUserId(targetUser.id);
    if(teamList.length === 0){
        throw new Error('团队列表为空')
    }
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
    res.cookies.set(TEAM_COOKIE_NAME, teamList[0].id, {
        httpOnly: true,
        expires: Date.now() + 1000 * 3600 * 24
    })
    return res;
}

export const POST = usingMiddleware(handler);
