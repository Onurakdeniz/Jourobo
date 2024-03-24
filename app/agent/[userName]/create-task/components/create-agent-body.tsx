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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CreateTaskSchema } from "@/schemas"; // Importing the schema
export const taskTypes = [
  { label: "Static Task", value: "true" }, // Representing static as true
  { label: "Dynamic Task", value: "false" }, // Representing dynamic as false
];

const companies = ["Openai", "Anthropic", "Gemini"];

const sourceOptions = [
  { label: "Farcaster Post", value: "FARCASTER_POST" },
  { label: "Farcaster Channel", value: "FARCASTER_CHANNEL" },
  { label: "Farcaster User", value: "FARCASTER_USER" },
];

const models = [
  { label: "GPT-4 Turbo", value: "GPT4T" },
  { label: "GPT-3.5 Turbo", value: "GPT35T" },
  { label: "GPT-4", value: "GPT4" },
];

const modelPairs = models.map((model) => ({ label: model, value: model }));

enum SourceType {
  FARCASTER_USER = "FARCASTER_USER",
  FARCASTER_POST = "FARCASTER_POST",
  FARCASTER_CHANNEL = "FARCASTER_CHANNEL",
}

type CreateTaskType = z.infer<typeof CreateTaskSchema>;

const CreateAgentBody = () => {
  const form = useForm<z.infer<typeof CreateTaskSchema>>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      isStaticRun: true,
    },
  });

  const {
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  const [showApiKey, setShowApiKey] = useState(false);

  const router = useRouter();
  const agentUsername = useParams().userName;

  const postTaskData = async (taskData: CreateTaskType) => {
    const response = await fetch("/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...taskData,
        agentUsername,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create agent");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: postTaskData,
    onSuccess: () => {
      toast.success("Task created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Error creating task");
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof CreateTaskSchema>> = async (
    data
  ) => {
    console.log(data, "motadata");
    const response = await mutation.mutateAsync(data);

    router.push(`/agent/${agentUsername}`);
  };

  const isStaticRun = form.watch("isStaticRun");
  const selectedOption = form.watch("source.type");

  return (
    <ScrollArea className="flex w-full">
      <div className="flex  h-full w-full pb-2   ">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-4 w-full md:w-2/3 flex-col flex p-2 ">
              <div className="flex gap-2 text-2xl w-full text-orange-600 font-bold pb-2 border-b mb-4">
                Task Definition
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name*</FormLabel>

                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="w-full border p-2"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Description</FormLabel>

                    <FormControl>
                      <Textarea {...field} className="w-full h-16 border p-2" />
                    </FormControl>
                    {errors.description && (
                      <FormMessage className="text-red-500">
                        {errors.description?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isStaticRun"
                render={({ field }) => (
                  <FormItem className="grid gap-2 mt-4">
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        value={field.value ? "true" : "false"}
                        onValueChange={(value) => {
                          field.onChange(value === "true");
                        }}
                        className="flex justify-start items-center gap-4 w-full"
                      >
                        {taskTypes.map((type, index) => (
                          <ToggleGroupItem
                            key={index}
                            value={type.value}
                            aria-label={`Select ${type.label}`}
                            className="inline-flex w-1/2 m-0 py-6 border border-rounded border-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-lg data-[state=on]:bg-teal-50 data-[state=on]:text-black"
                            disabled={type.label === "Dynamic Task"}
                          >
                            <div className="text-sm capitalize">
                              {type.label}
                            </div>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              {isStaticRun === false && (
                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interval Value</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="w-full border p-2"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500">
                        {errors.interval?.message?.toString()}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}

              <div className="flex gap-2 text-2xl w-full text-orange-600 font-bold pb-2 border-b py-4 my-4">
                Prompt
              </div>

              <FormField
                control={form.control}
                name="prompt.promptMessage.content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt*</FormLabel>
                    <FormDescription>
                      Provide your promt to the AI model.
                    </FormDescription>

                    <FormControl>
                      <Textarea {...field} className="w-full h-24 border p-2" />
                    </FormControl>
                    {errors.prompt?.promptMessage?.content && (
                      <FormMessage className="text-red-500">
                        {errors.prompt?.promptMessage?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <div className="flex gap-2 text-2xl w-full text-orange-600 font-bold pb-2 border-b py-4 my-4">
                Sources
              </div>

              <FormField
                control={form.control}
                name="source.type"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel className=" ">Source Type*</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        id="sourceType"
                        defaultValue={field.value}
                        size="lg"
                        className="flex flex-1 justify-start h-fit items-center gap-4 w-full"
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        {sourceOptions.map((source, index) => (
                          <FormControl key={index}>
                            <ToggleGroupItem
                              key={index}
                              value={source.value}
                              aria-label={`Select ${source.label}`}
                              className="inline-flex w-1/2 m-0 py-6 border border-rounded border-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-lg data-[state=on]:bg-teal-50 data-[state=on]:text-black"
                            >
                              <div className="text-sm capitalize">
                                {source.label}
                              </div>
                            </ToggleGroupItem>
                          </FormControl>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage className="text-red-500">
                      {errors.source?.type?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source.ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedOption === "FARCASTER_POST"
                        ? "Add Post Urls*"
                        : selectedOption === "FARCASTER_CHANNEL"
                        ? "Add Channel Ids*"
                        : selectedOption === "FARCASTER_USER"
                        ? "Add User Ids*"
                        : "Add Post Urls or User & Channel Ids*"}
                    </FormLabel>

                    <FormDescription>
                      {selectedOption === "FARCASTER_POST"
                        ? "Add the post urls separated by commas."
                        : selectedOption === "FARCASTER_CHANNEL"
                        ? "Add the channel names separated by commas."
                        : selectedOption === "FARCASTER_USER"
                        ? "Add the user farcaster ids separated by commas."
                        : "Add the post urls or user & channel ids separated by commas."}
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="w-full border p-2"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500">
                      {errors.source?.ids?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {["FARCASTER_CHANNEL", "FARCASTER_USER"].includes(
                selectedOption
              ) && (
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limit Value</FormLabel>
                      <FormDescription>
                        Number of posts to fetch maximum 100 , consider the
                        content size for llm.
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          className="w-full border p-2"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500">
                        {errors.interval?.message?.toString()}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}

              {["FARCASTER_CHANNEL", "FARCASTER_USER"].includes(
                selectedOption
              ) && (
                <FormField
                  control={form.control}
                  name="isWithRecasts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Recasts Included</FormLabel>
                        <FormDescription>
                          Include recasts in the task.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <div className="flex gap-2 text-2xl w-full items-center pt-4 text-muted-foreground mt-4  font-bold pb-2 border-b">
                Add Your AI Model{" "}
                <span className="text-xs text-muted-foreground font-bold">
                  (soon)
                </span>
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
                          id="llms"
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
                                  company.toLowerCase() === "gemini" ||
                                  company.toLowerCase() === "openai"
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
                      <FormMessage className="text-red-500">
                        {errors.aiModel?.llm?.message?.toString()}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiModel.model"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="text-muted-foreground">
                        Default Agent Instructions*
                      </FormLabel>
                      <FormControl>
                        <ToggleGroup
                          type="single"
                          id="models"
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
                                disabled={
                                  model.value.value.toLowerCase() === "gpt4" ||
                                  model.value.value.toLowerCase() === "gpt4t" ||
                                  model.value.value.toLowerCase() === "gpt35t"
                                }
                              >
                                <div className="text-sm capitalize">
                                  {model.label.label}
                                </div>
                              </ToggleGroupItem>
                            </FormControl>
                          ))}
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage className="text-red-500">
                        {errors.aiModel?.model?.message?.toString()}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiModel.apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Open AI Key
                      </FormLabel>

                      <FormControl>
                        <div className="flex w-full gap-6 items-center">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            {...field}
                            className="w-full border p-2"
                            disabled
                          />

                          <Button
                            variant="outline"
                            className="text-muted"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? "Hide API Key" : "Show API Key"}
                          </Button>
                        </div>
                      </FormControl>
                      {errors.aiModel?.apiKey && (
                        <FormMessage className="text-red-500">
                          {errors.aiModel.apiKey.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="bg-orange-500  w-1/2 font-bold text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 ease-in-out"
              >
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
};

export default CreateAgentBody;
