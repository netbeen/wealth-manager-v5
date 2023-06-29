// import prisma from '../../../../../lib/prisma';
// import {NextRequest, NextResponse} from "next/server";
// import {StatusCodes} from "http-status-codes";
//
// export async function GET(req: NextRequest) {
//     const searchParams = req.nextUrl.searchParams
//     const username = searchParams.get('username')
//     const password = searchParams.get('password')
//     if(username && password){
//         const targetUser = await prisma.user.findFirst({
//             where: {
//                 username: username,
//                 password: password,
//             },
//         });
//         if(targetUser){
//             return NextResponse.json({
//                 ...targetUser,
//                 password: null,
//             })
//         }else{
//             return NextResponse.json(null, {status: StatusCodes.NOT_FOUND})
//         }
//     } else {
//         return NextResponse.json({
//             errorMessage: 'Query username 和 password 必填'
//         }, {
//             status: StatusCodes.BAD_REQUEST
//         })
//     }
// }
