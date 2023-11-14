import { loginFormSchema } from "@/app/(auth)/(routes)/login/page";
import AxiosService from "./axios_service";
import { registerFormSchema } from "@/app/(auth)/(routes)/register/page";
import z from "zod";

const Register = (values: z.infer<typeof registerFormSchema>) => {
  return AxiosService.post("/api/auth/register", {
    name: values.firstName + " " + values.lastName,
    email: values.email,
    password: values.password,
  })
};

const Login = (values: z.infer<typeof loginFormSchema>) => {
  return AxiosService.post("/api/auth/authenticate", {
    email: values.email,
    password: values.password,
  })
};

const AuthService = {
    Register,
    Login
}

export default AuthService
