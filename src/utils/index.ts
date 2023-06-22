import {NextApiRequest, NextApiResponse} from "next";
import {HTTP_METHOD} from "@/constants";
import {response400} from "@/utils/response";

export const getValueFromQuery = (req: NextApiRequest, key: string)=>{
    const data = req.query[key];
    if(!data || typeof data === "string"){
        return data;
    }else{
        return data[0];
    }
}

export const restrictMethod = (req: NextApiRequest, res: NextApiResponse, method: HTTP_METHOD) => {
    if(req.method !== method){
        response400(res, `该接口仅接受 ${method} 方法`)
    }
}
