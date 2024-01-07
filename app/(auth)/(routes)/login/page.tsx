"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingCircle from "@/components/ui/loading_circle";
import Preloader from "@/components/ui/preloader";
import { useToast } from "@/components/ui/use-toast";
import AuthService from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50)
    .regex(
      new RegExp(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      ),
      "Invalid email address",
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be 50 characters maximum"),
});

export default function LogIn() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoggingIn(true);
    AuthService.Login(values)
      .then((response) => {
        router.push("/overview");
      })
      .catch((error) => {
        if (error.response) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.response.data.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "Something has gone wrong, you can report it to developers!",
          });
        }
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  }

  return (
    <div className="z-10 flex h-auto flex-col rounded-md bg-white bg-opacity-100 p-8 shadow-[0px_0px_10px_3px_#94a3b8]">
      <h4 className="text-lg font-bold">Log in</h4>
      <p className="mb-6 text-sm text-gray-500">
        to continue to start using website
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Email address</FormLabel>
                <FormControl>
                  <Input className="w-[300px]" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Password</FormLabel>
                <FormControl>
                  <Input className="w-full" type="password" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="my-4 w-full bg-indigo-400 text-sm uppercase text-white hover:bg-indigo-600"
            disabled={isLoggingIn}
          >
            Log In
            <LoadingCircle
              className={"ml-4 !w-4 " + (isLoggingIn ? "" : "hidden")}
            />
          </Button>
        </form>
      </Form>
      <p className="ml-auto mr-6 text-xs">
        No account?{" "}
        <Link className="font-bold text-blue-500 underline" href={"/register"}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
