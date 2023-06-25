import {NextRequest, NextResponse} from "next/server";
import {StatusCodes} from "http-status-codes";
import {SESSION_TOKEN_COOKIE_NAME} from "@/constants";
import {getLoginUserByJwtToken} from "@/utils/user";

export async function GET(req: NextRequest) {
    const jwtToken = req.cookies.get(SESSION_TOKEN_COOKIE_NAME)?.value
    const loginUser = await getLoginUserByJwtToken(jwtToken)
    if(!loginUser){
        return NextResponse.json(null, {
            status: StatusCodes.UNAUTHORIZED
        })
    }
    return NextResponse.json(loginUser);
}
