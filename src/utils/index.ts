import {NextApiRequest} from "next";

export const getValueFromQuery = (req: NextApiRequest, key: string)=>{
    const data = req.query[key];
    if(!data || typeof data === "string"){
        return data;
    }else{
        return data[0];
    }
}
