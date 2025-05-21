
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "~/lib/axios";

const useGetUserInfo = () => {
    return useMutation({
        mutationFn: async () => {
            const path = '/api/user/profile';
            const res = await axiosInstance.get(path);
            return res.data;
        }
    });
};

export default useGetUserInfo; 