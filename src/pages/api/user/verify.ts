import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma';
import {getValueFromQuery, restrictMethod} from "@/utils";
import {response200, response400} from "@/utils/response";
import {HTTP_METHOD} from "@/constants";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    restrictMethod(req, res, HTTP_METHOD.GET)
    const username = getValueFromQuery(req, 'username')
    const password = getValueFromQuery(req, 'password')
    if(username && password){
        const targetUser = await prisma.user.findFirst({
            where: {
                username: username,
                password: password,
            },
        });
        response200(res, targetUser);
    } else {
        response400(res, 'Query username 和 password 必填')
    }
}
