"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRightCircle } from "lucide-react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import AuthService from "@/services/auth_service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import LoadingCircle from "@/components/ui/loading_circle";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50)
    .regex(
      new RegExp(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      ),
      "Invalid email address"
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
    <div className="flex flex-col h-auto p-8 shadow-2xl rounded-md">
      <h4 className="text-lg font-bold">Log in</h4>
      <p className="text-gray-500 text-sm mb-6">
        to continue to start using website
      </p>
      <Button
        variant={"ghost"}
        className="border border-solid border-slate-200 group"
      >
        <Image
          width={20}
          height={20}
          src={"/ic_google_144x144.svg"}
          alt="Log in using google"
        />
        <span className="mx-8">Log in using Google</span>
        <ArrowRightCircle
          width={16}
          height={16}
          className="text-gray-500 invisible group-hover:visible"
        />
      </Button>
      <div className="flex flex-row m-4 items-center justify-center">
        <Separator className="flex-1" />
        <p className="flex-[0.5] text-sm text-gray-500 text-center">or</p>
        <Separator className="flex-1" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Email address</FormLabel>
                <FormControl>
                  <Input className="w-full" {...field} />
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
            className="my-4 w-full bg-indigo-400 hover:bg-indigo-600 text-white uppercase text-sm"
            disabled={isLoggingIn}
          >
            Log In
            <LoadingCircle
              className={"!w-4 ml-4 " + (isLoggingIn ? "" : "hidden")}
            />
          </Button>
        </form>
      </Form>
      <p className="ml-auto mr-6 text-xs">
        No account?{" "}
        <Link className="text-blue-500 underline font-bold" href={"/register"}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
