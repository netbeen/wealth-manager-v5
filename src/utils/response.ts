import {NextApiResponse} from "next";
import {
    StatusCodes,
} from 'http-status-codes';

export const response200 = (res: NextApiResponse, data: any) => {
    res.status(StatusCodes.OK).json({ data })
}
export const response400 = (res: NextApiResponse, errorMessage: string) => {
    res.status(StatusCodes.BAD_REQUEST).json({ errorMessage })
}

export const response403 = (res: NextApiResponse, errorMessage: string) => {
    res.status(StatusCodes.FORBIDDEN).json({ errorMessage })
}
