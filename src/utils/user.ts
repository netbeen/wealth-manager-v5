import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";

export const getLoginUserByJwtToken = async (jwtToken?: string) => {
    if(!jwtToken){
        return null;
    }
    const decodedJwt = jwt.verify(jwtToken, process.env.JWT_SECRET ?? '');
    // @ts-ignore
    const userId = decodedJwt.userId
    const targetUser = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });
    if(!targetUser){
        return null;
    }else{
        return {
            ...targetUser,
            password: null,
        }
    }
};
