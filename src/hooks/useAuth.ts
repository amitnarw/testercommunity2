import {
  emailVerification,
  fetchUser,
  login,
  register,
  // updateProfile
} from "@/lib/apiCalls";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from "@tanstack/react-query";

export function useUser(id: string) {
  return useQuery({ queryKey: ["user", id], queryFn: () => fetchUser(id) });
}

// export function useUpdateUser() {
//   return useMutation({ mutationFn: updateProfile });
// }

// Input variables types for register mutation
// interface RegisterUserInput {
//   email: string;
//   password: string;
//   name: string;
// }

// // Output data type returned from register
// interface RegisterUserOutput {
//   token: string | null;
//   user: {
//     id: string;
//     email: string;
//     name: string;
//     image?: string | null;
//     emailVerified: boolean;
//     createdAt: string;
//     updatedAt: string;
//   };
// }

// // Mutation hook implementation
// export function useRegisterUser(): UseMutationResult<
//   RegisterUserOutput,
//   Error,
//   RegisterUserInput
// > {
//   return useMutation<RegisterUserOutput, Error, RegisterUserInput>({
//     mutationFn: (variables) => register(variables),
//   });
// }

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type RegisterResponse = {
  success: true | false;
  data?: string;
  error?: string;
};

export function useRegisterUser() {
  const mutation = useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: (payload) => register(payload),
    onSuccess: (data) => {
      console.log("Register success: ", data);
    },
    onError: (error) => {
      console.error("Register failed: ", error);
    },
  });

  return mutation;
}

export function useEmailVerification() {
  const mutation = useMutation({
    mutationFn: (payload: { token: string }) => emailVerification(payload),
    onSuccess: (data) => {
      console.log("Email verified successfully: ", data);
    },
    onError: (error) => {
      console.log("Email verification failed: " + error);
    },
  });

  return mutation;
}

export function useLoginUser(options?: UseMutationOptions<any, any, any>) {
  const mutation = useMutation({
    mutationFn: (payload: {
      email: string;
      password: string;
      rememberMe: boolean;
    }) => login(payload),
    onSuccess: (data) => {
      console.log("Login success: " + data);
    },
    onError: (data) => {
      console.log("Login failed: " + data);
    },
    ...options,
  });

  return mutation;
}
