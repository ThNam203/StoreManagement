"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRightCircle } from "lucide-react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import LoadingCircle from "@/components/ui/loading_circle";
import AuthService from "@/services/authService";

export const registerFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "Must be at least 1 character")
    .max(50, "Must be at max 50 characters"),
  lastName: z.string().min(1, "Must be at least 1 character").max(50),
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

export default function SignUp() {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    setIsRegistering(true);
    AuthService.Register(values)
      .then((response) => {
        router.push("/overview");
      })
      .catch((error) => {
        if (error.response) {
          toast({
            variant: "destructive",
            title: "Register failed",
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
        setIsRegistering(false);
      });
  }

  return (
    <div className="flex h-auto flex-col rounded-md p-8 shadow-[0px_0px_10px_3px_#94a3b8]">
      <h4 className="text-lg font-bold">Create your account</h4>
      <p className="mb-6 text-sm text-gray-500">to start using the website</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-row gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="mt-5 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Email address</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
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
                  <Input type="password" className="w-full" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="my-4 w-full bg-indigo-400 text-sm uppercase text-white hover:bg-indigo-600"
            disabled={isRegistering}
          >
            Sign Up
            <LoadingCircle
              className={"ml-4 !w-4 " + (isRegistering ? "" : "hidden")}
            />
          </Button>
        </form>
      </Form>
      <p className="ml-auto mr-6 text-xs">
        Have an account?{" "}
        <Link className="font-bold text-blue-500 underline" href={"/login"}>
          Login
        </Link>
      </p>
    </div>
  );
}
