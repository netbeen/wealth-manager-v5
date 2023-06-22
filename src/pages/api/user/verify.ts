import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma';
import {getValueFromQuery} from "@/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const username = getValueFromQuery(req, 'username')
    const password = getValueFromQuery(req, 'password')
    if(username && password){
        const targetUser = await prisma.user.findFirst({
            where: {
                username: username,
                password: password,
            },
        });
        res.json({
            result: targetUser
        })
    } else {
        res.json({
            result: null,
        })
    }
}
