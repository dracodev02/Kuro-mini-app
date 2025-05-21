

import { useMutation } from "@tanstack/react-query";
import axiosInstance from "~/lib/axios";
import { Round, RoundHistoryResponse } from "~/types/round";
export const useGetKuroHistory = () => {

  return useMutation({
    mutationKey:  ["GET_KURO_HISTORY"],
    mutationFn: async (body: {page?: number,  type: "youWin" | "all", limit?: number, address?: string}) => {

      let params: any = {
        page: body.page ? body.page : 1,
        limit: body.limit ? body.limit : 10,
      }

      if(body.type === "youWin") {
        if(body.address) {
          params.address = body.address
        } else {
          return { data: [] as Round[],
            message: "No data available",
            page: 1,
            size: 10,
            success: true,
            total: 0
          } as RoundHistoryResponse<Round>;
        }
      }

      const path = "/api/kuro";
      const { data } = await axiosInstance.post(path, {
            ...params
      })
      
      return data;
    },
})
};
