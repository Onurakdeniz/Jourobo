"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { CircleCheck } from "lucide-react";
import { CreateAgencySchema } from "@/schemas";
import { useFetchAgencies } from "@/hooks/useFetchAgencies";

interface CreateAgencyProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateAgency: React.FC<CreateAgencyProps> = ({ setOpen }) => {
  const form = useForm<z.infer<typeof CreateAgencySchema>>({
    resolver: zodResolver(CreateAgencySchema),
  });

  const { watch, setError, clearErrors } = form;
  const userName = watch("userName");

  const { refetch } = useFetchAgencies()

 

  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const checkUsernameAvailability = async (username: string) => {
    const response = await fetch("/api/agency/check-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data;
    if (response.status !== 204) {
      // No Content
      data = await response.json();
    }

    return data?.available;
  };

  useEffect(() => {
    if (userName && userName.length > 0) {
      const delayDebounceFn = setTimeout(async () => {
        const available = await checkUsernameAvailability(userName);
 
        setUsernameAvailable(available);
        if (!available) {
          setError("userName", {
            type: "manual",
            message: "Username is already taken.",
          });
        } else {
          clearErrors("userName");
        }
      }, 500); // 500ms delay for debounce

      return () => clearTimeout(delayDebounceFn);
    }
  }, [userName, setError, clearErrors]);

  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<z.infer<typeof CreateAgencySchema>> = async (
    data
  ) => {
    if (!usernameAvailable) {
      toast.error("Username is already taken.");
      return; // Prevent form submission if username is not available
    }
    try {
 
      const requestBody = {
        data,
        action: "create",
      };

      const response = await fetch("/api/agency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

 

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
        toast(errorData.message || "Something went wrong");
      }

      const res = await response.json();
      toast("Agency created successfully", {
        description: "Success Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      refetch()
      router.push(`/agency/${res.agency.userName}`);
      router.refresh();
      
      setOpen(false);
 
    } catch (error: any) {
      console.error("Failed to create agency:", error);
      toast.error(error.message || "Failed to create agency");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="w-full border rounded-lg p-2"
                  />
                </FormControl>
                <FormMessage className="text-red-500">
                  {errors.name?.message?.toString()}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username*</FormLabel>
                <FormControl className="flex   gap-2">
                  <div className="flex items-center w-full">
                    <Input
                      {...field}
                      type="text"
                      className="border  rounded-lg p-2 pr-10"
                    />
                    <div>
                      {userName && userName.length > 0 && (
                        <div className="relative inset-y-0 right-0 flex items-center pr-3">
                          {" "}
                          {/* Change to relative */}
                          {usernameAvailable ? (
                            <CircleCheck className="text-green-500" size={20} />
                          ) : (
                            <CircleCheck className="text-red-500" size={20} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>

                <FormMessage className="text-red-500">
                  {errors.userName?.message?.toString()}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="w-full border rounded-lg p-2"
                  />
                </FormControl>
                <FormMessage className="text-red-500">
                  {errors.description?.message?.toString()}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    {...field}
                    className="w-full border rounded-lg p-2"
                  />
                </FormControl>
                <FormMessage className="text-red-500">
                  {errors.logo?.message?.toString()}
                </FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating agency..." : "Create Agency"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateAgency;
