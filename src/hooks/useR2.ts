import { useMutation } from "@tanstack/react-query";
import { createUploadUrl, uploadFileToR2 } from "../lib/apiCalls";

export const useR2 = () => {
  const createUploadUrlMutation = useMutation({
    mutationFn: createUploadUrl,
    onError: (error) => {
      console.error("Error creating upload URL:", error);
    },
  });

  const uploadFileToR2Mutation = useMutation({
    mutationFn: async ({
      file,
      uploadUrl,
      onProgress,
    }: {
      file: File;
      uploadUrl: string;
      onProgress?: (percent: number) => void;
    }) => {
      return uploadFileToR2(file, uploadUrl, onProgress);
    },
    onError: (error) => {
      console.error("Error uploading file to R2:", error);
    },
  });

  return {
    createUploadUrl: createUploadUrlMutation,
    isPendingCUU: createUploadUrlMutation.isPending,
    isSuccessCUU: createUploadUrlMutation.isSuccess,
    isErrorCUU: createUploadUrlMutation.isError,
    errorCUU: createUploadUrlMutation.error,
    resetCUU: () => {
      createUploadUrlMutation.reset();
    },
    uploadFileToR2: uploadFileToR2Mutation,
    isPendingUFR: uploadFileToR2Mutation.isPending,
    isSuccessUFR: uploadFileToR2Mutation.isSuccess,
    isErrorUFR: uploadFileToR2Mutation.isError,
    errorUFR: uploadFileToR2Mutation.error,
    resetUFR: () => {
      uploadFileToR2Mutation.reset();
    },
  };
};
