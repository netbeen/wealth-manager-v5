import {NextRequest, NextResponse} from "next/server";
import {usingMiddleware} from "@/utils/serverCommon";
import {User, Team} from ".prisma/client/index";

async function handler(req: NextRequest, user?: User, team?: Team) {
    return NextResponse.json(user);
}

export const GET = usingMiddleware(handler);
