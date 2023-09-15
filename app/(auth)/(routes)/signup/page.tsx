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

const formSchema = z.object({
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
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      ),
      "Invalid email address"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be 50 characters maximum"),
});

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex flex-col h-auto p-8 shadow-2xl rounded-md">
      <h4 className="text-lg font-bold">Create your account</h4>
      <p className="text-gray-500 text-sm mb-6">to start using the website</p>
      <Button
        variant={"ghost"}
        className="border border-solid border-slate-200 group"
      >
        <Image
          width={20}
          height={20}
          src={"/ic_google_144x144.svg"}
          alt="sign up using google"
        />
        <span className="mx-8">Sign up using Google</span>
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
                  <FormMessage className="text-xs mt-5" />
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
                    <Input {...field} />
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
                  <FormLabel  className="text-black">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button type="submit" className="my-4 w-full bg-indigo-400 hover:bg-indigo-600 text-white uppercase text-sm">Sign Up</Button>
        </form>
      </Form>
      <p className="ml-auto mr-6 text-xs">Have an account? <Link className="text-blue-500 underline font-bold" href={'/login'}>Login</Link></p>
    </div>
  );
}
