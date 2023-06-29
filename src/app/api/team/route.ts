import prisma from '@@/lib/prisma';
import jwt from 'jsonwebtoken';
import {NextRequest, NextResponse} from 'next/server'
import {
    StatusCodes,
} from 'http-status-codes';
import {SESSION_TOKEN_COOKIE_NAME} from "@/constants";

export async function GET(req: NextRequest) {
    throw new Error('123')
}
