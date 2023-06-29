import {NextRequest, NextResponse} from 'next/server'
import {usingMiddleware} from "@/utils/serverCommon";
import {listTeamByUserId} from "@/utils/team";
import {User, Team} from ".prisma/client/index";

async function handler(req: NextRequest, user?: User, team?: Team) {
    const teamList = await listTeamByUserId(user?.id ?? '');
    return NextResponse.json(teamList);
}

export const GET = usingMiddleware(handler);
