import { useMutation } from "@tanstack/react-query";
import axiosInstance from "~/lib/axios";

const useClaimKuroRound = () => {
  return useMutation({
    mutationKey: ["KURO_CLAIM_ROUND"],
    mutationFn: async (body: { roundId: number; txHash: string }) => {
      const path = `/api/kuro/${body.roundId}/claim/`;
      const res = await axiosInstance.put(path, { txHash: body.txHash });
      return res.data;
    },
  });
};

export default useClaimKuroRound;
