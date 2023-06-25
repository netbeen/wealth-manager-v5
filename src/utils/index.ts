// import {NextApiRequest, NextApiResponse} from "next";
// import {HTTP_METHOD} from "@/constants";
// import {response400} from "@/utils/response";
// @ts-ignore
import {Toast} from "antd-mobile/bundle/antd-mobile.cjs";

export const toastFail = (content: string) => {
    Toast.show({
        icon: 'fail',
        content,
    });
};

export const toastSuccess = (content: string) => {
    Toast.show({
        icon: 'success',
        content,
    });
};

