"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateAgentSchema } from "@/schemas";
import { Textarea } from "@/components/ui/textarea";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useMutation } from "@tanstack/react-query";
import { useAgencyStore } from "@/store/agency";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useFetchAgent } from "@/hooks/useFetchAgent";
import { useFetchAgencies } from "@/hooks/useFetchAgencies";

export const companies = ["OpenAI", "Anthropic", "Gemini"];

const models = [
  { label: "GPT-4 Turbo", value: "GPT4T" },
  { label: "GPT-3.5 Turbo", value: "GPT35T" },
  { label: "GPT-4", value: "GPT-4" },
];

const modelPairs = models.map((model) => ({ label: model, value: model }));
type CreateAgentData = z.infer<typeof CreateAgentSchema>;
const CreateAgentBody = () => {
  const form = useForm<z.infer<typeof CreateAgentSchema>>({
    resolver: zodResolver(CreateAgentSchema),
  });

  const { refetch } = useFetchAgencies()


  const {
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  const [showApiKey, setShowApiKey] = useState(false);
  const userName = watch("userName");
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const router = useRouter();
  const agencyId = useParams().userName;

  const checkUsernameAvailability = async (username: string) => {
    const response = await fetch("/api/agent/check-username", {
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

  const postAgentData = async (agentData: CreateAgentData) => {
    const response = await fetch("/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...agentData,
        agencyId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create agent");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: postAgentData,
    onSuccess: () => {
      toast.success("Agent created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Error creating agent");
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof CreateAgentSchema>> = async (
    data
  ) => {
    if (!usernameAvailable) {
      toast.error("Username is already taken.");
      return; // Prevent form submission if username is not available
    }
 
    const response = await mutation.mutateAsync(data);
 
    refetch();
    router.push(`/agency/${agencyId}`);

  };

  return (
    <ScrollArea className="flex w-full">
      <div className="flex  h-full w-full pb-2   ">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-4 w-full md:w-2/3 flex-col flex p-2 ">
              <div className="flex gap-2 text-2xl w-full text-orange-600 font-bold pb-2 border-b mb-4">
                Agent Profile
              </div>

              <FormField
                control={form.control}
                name="profile.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name*</FormLabel>

                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="w-full border p-2"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500">
                      {errors.profile?.name?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Username*</FormLabel>
                    <FormControl>
                      <div className="flex items-center w-full gap-4">
                        <Input
                          {...field}
                          type="text"
                          className="border rounded-lg p-2 pr-10"
                          onChange={(e) => {
                            // Remove spaces from input value
                            const noSpacesValue = e.target.value.replace(
                              /\s+/g,
                              ""
                            );
                            // Update the field value without spaces
                            field.onChange(noSpacesValue);
                          }}
                        />
                        <div>
                          {field.value && field.value.length > 0 && (
                            <div className="relative inset-y-0 right-0 flex items-center pr-3">
                              {usernameAvailable ? (
                                <CircleCheck
                                  className="text-green-500"
                                  size={20}
                                />
                              ) : (
                                <CircleCheck
                                  className="text-red-500"
                                  size={20}
                                />
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
                name="profile.avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Avatar URL</FormLabel>

                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="w-full border p-2"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500">
                      {errors.profile?.avatarUrl?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Tags</FormLabel>
                    <FormDescription>Add tags to your agent</FormDescription>

                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        onChange={(e) => {
                          // Split the string by commas to create an array
                          const categoriesArray = e.target.value
                            .split(",")
                            .map((item) => item.trim());
                          // Update the form state with this new array
                          field.onChange(categoriesArray);
                        }}
                        className="w-full border p-2"
                      />
                    </FormControl>
                    {errors.categories && (
                      <FormMessage className="text-red-500">
                        {errors.categories.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Description*</FormLabel>
                    <FormDescription>Create your agent</FormDescription>

                    <FormControl>
                      <Textarea {...field} className="w-full h-24 border p-2" />
                    </FormControl>
                    {errors.categories && (
                      <FormMessage className="text-red-500">
                        {errors.profile?.description?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profile.defaultInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Agent Instructions</FormLabel>
                    <FormDescription>Create your agent</FormDescription>

                    <FormControl>
                      <Textarea {...field} className="w-full h-24 border p-2" />
                    </FormControl>
                    {errors.profile?.defaultInstructions && (
                      <FormMessage className="text-red-500">
                        {errors.profile?.defaultInstructions?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <div className="flex gap-2 text-2xl w-full text-orange-600 mt-2  font-bold pb-2 border-b">
                AI Model
              </div>
              <div className="space-y-8  flex-col flex  pb-2">
                <FormField
                  control={form.control}
                  name="aiModel.llm"
                  render={({ field }) => (
                    <FormItem className="grid  gap-2 mt-4">
                      <FormControl>
                        <ToggleGroup
                          type="single"
                          id="compannies"
                          defaultValue={field.value}
                          size="lg"
                          className="flex  justify-start h-fit items-center gap-4 w-full"
                          value={field.value}
                          onValueChange={(value) => {
                            if (value === field.value) {
                              field.onChange(null);
                            } else {
                              field.onChange(value);
                            }
                          }}
                        >
                          {companies.map((company, index) => (
                            <FormControl key={index}>
                              <ToggleGroupItem
                                key={index}
                                value={company}
                                aria-label={`Select ${company}`}
                                className="inline-flex w-1/2 m-0 py-6 border border-rounded border-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-lg data-[state=on]:bg-teal-50 data-[state=on]:text-black"
                                disabled={
                                  company.toLowerCase() === "anthropic" ||
                                  company.toLowerCase() === "gemini"
                                }
                              >
                                <div className="text-sm capitalize">
                                  {company}
                                </div>
                              </ToggleGroupItem>
                            </FormControl>
                          ))}
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiModel.model"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Default Agent Instructions*</FormLabel>
                      <FormControl>
                        <ToggleGroup
                          type="single"
                          id="models"
                          defaultValue={field.value}
                          size="lg"
                          className="flex flex-1 justify-start h-fit items-center gap-4 w-full"
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          {modelPairs.map((model, index) => (
                            <FormControl key={index}>
                              <ToggleGroupItem
                                key={index}
                                value={model.value.value}
                                aria-label={`Select ${model.label.label}`}
                                className="inline-flex w-1/2 m-0 py-6 border border-rounded border-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-lg data-[state=on]:bg-teal-50 data-[state=on]:text-black"
                              >
                                <div className="text-sm capitalize">
                                  {model.label.label}
                                </div>
                              </ToggleGroupItem>
                            </FormControl>
                          ))}
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />

            
              </div>
              <Button
                type="submit"
                className="bg-orange-500  w-1/2 font-bold text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 ease-in-out"
              >
                Create Agent
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
};

export default CreateAgentBody;
