import { loginFormSchema } from "@/app/(auth)/(routes)/login/page";
import AxiosService from "./axiosService";
import { registerFormSchema } from "@/app/(auth)/(routes)/register/page";
import z from "zod";

const Register = (values: z.infer<typeof registerFormSchema>) => {
  return AxiosService.post(
    "/api/auth/register",
    {
      name: values.firstName + " " + values.lastName,
      email: values.email,
      password: values.password,
    },
    { withCredentials: true },
  );
};

const Login = (values: z.infer<typeof loginFormSchema>) => {
  return AxiosService.post(
    "/api/auth/authenticate",
    {
      email: values.email,
      password: values.password,
    },
    { withCredentials: true },
  );
};

const AuthService = {
  Register,
  Login,
};

export default AuthService;
