"use client";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter , useParams} from "next/navigation";
import { useAgencyStore } from "@/store/agency";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheck } from "lucide-react";
import { useFetchAgencies } from "@/hooks/useFetchAgencies";
import { EditAgencySchema } from "@/schemas";

const EditAgency = ({ setOpen }: { setOpen: (value: boolean) => void }) => {
  const { agencies } = useAgencyStore((state) => state);

  const params = useParams();
  const username =  params.userName;
  const agencyDetails = agencies.find((agency) => agency.userName === username);
  const [initialUsername, setInitialUsername] = useState(
    agencyDetails ? agencyDetails.userName : ""
  );

  const form = useForm({
    resolver: zodResolver(EditAgencySchema),
    defaultValues: agencyDetails
      ? {
          id: agencyDetails.id,
          name: agencyDetails.name,
          description: agencyDetails.description,
          userName: agencyDetails.userName,
          logo: agencyDetails.logo || "",
        }
      : {
          id: "",
          name: "",
          description: "",
          userName: "",
          logo: "",
        },
  });

  const { watch, setError, clearErrors } = form;
  const userName = watch("userName");
 

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
    if (userName && userName.length > 0 && initialUsername !== userName) {
      const delayDebounceFn = setTimeout(async () => {
        try {
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
        } catch (error) {
          console.error("Error checking username availability:", error);
          // Handle error appropriately, possibly setting a different error state
        }
      }, 500); // 500ms delay for debounce

      return () => clearTimeout(delayDebounceFn);
    } else if (initialUsername === userName) {
      setUsernameAvailable(true);
      clearErrors("userName");
    }
  }, [userName, initialUsername, setError, clearErrors]);

  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<z.infer<typeof EditAgencySchema>> = async (
    data
  ) => {
    try {
      if (!agencyDetails) {
        throw new Error("Agency details are not available");
      }

      const requestBody = { data, action: "update", id: agencyDetails.id };
 

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
      toast("Agency updated successfully");

      setOpen(false);
      
      router.forward;
    }  catch (error) {
      console.error("Failed to update agency:", error);
      toast("Failed to update agency");
    }
  }
  
    
  const deleteAgency = async (agencyId : any) => {
    try {
      if (!agencyDetails) {
        throw new Error("Agency details are not available");
      }

      const requestBody = {  id: agencyDetails.id  };

      const response = await fetch("/api/agency", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Agency deleted successfully", response);
      return response;
    } catch (error) {
      console.error("Failed to delete agency:", error);
    }
  };

  if (!agencyDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <input
            type="hidden"
            {...form.register("id")}
            value={agencyDetails ? agencyDetails.id : ""}
          />

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
                {errors.name && (
                  <FormMessage className="text-red-500">
                    {errors.name.message}
                  </FormMessage>
                )}
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

                {errors.userName && (
                  <FormMessage className="text-red-500">
                    {errors.userName.message}
                  </FormMessage>
                )}
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
                {errors.description && (
                  <FormMessage className="text-red-500">
                    {errors.description.message}
                  </FormMessage>
                )}
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
                {errors.logo && (
                  <FormMessage className="text-red-500">
                    {errors.logo.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating agency..." : "Update Agency"}
          </Button>
        </form>
      </Form>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="w-full mt-6 flex justify-center "
          >
            Delete Agency
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  const response = await deleteAgency(agencyDetails.id);
                  if (response && response.status === 200) {
                    setOpen(false);
                    toast("Agency deleted successfully");
                  } else {
                    toast("Failed to delete agency");
                  }
                } catch (error) {
                  console.error("Failed to delete agency:", error);
                  toast("Failed to delete agency");
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditAgency;
 