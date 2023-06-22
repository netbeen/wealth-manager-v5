import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma';
import {restrictMethod} from "@/utils";
import {response200, response403} from "@/utils/response";
import {HTTP_METHOD} from "@/constants";
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    restrictMethod(req, res, HTTP_METHOD.POST)
    const {username, password} = req.body;
    if(username && password){
        const targetUser = await prisma.user.findFirst({
            where: {
                username: username,
                password: password,
            },
        });
        if(targetUser){
            response200(res, {
                ...targetUser,
                password: null,
                jwtToken: jwt.sign({ userId: targetUser.id }, process.env.JWT_SECRET ?? '', {
                    expiresIn: '7d',
                })
            });
            return;
        }
    }
    response403(res, '用户名或密码错误')
}
