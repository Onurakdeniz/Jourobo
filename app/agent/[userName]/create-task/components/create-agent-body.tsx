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

export const oneTimeRun = ["One Time Run", "Dynamic Run"];

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

const CreateTaskSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  isStaticRun: z.boolean(),
  interval: z.string().optional(),
  prompt: z.object({
    promptMessage: z.object({
      content: z.string().min(1),
    }),
    systemMessage: z.object({
      content: z.string().optional(),
    }),
  }),
  aiModel: z.object({
    llm: z.string().optional().nullable(),
    model: z.string().optional().nullable(),
    apiKey: z.string().optional().nullable(),
  }),
  source: z.object({
    type: z.nativeEnum(SourceType),
    ids: z.array(z.string().min(1)),
  }),
});

type CreateTaskType = z.infer<typeof CreateTaskSchema>;

const CreateAgentBody = () => {
  const form = useForm<z.infer<typeof CreateTaskSchema>>({
    resolver: zodResolver(CreateTaskSchema),
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
  const agentId = useParams().userName;

  const postTaskData = async (taskData: CreateTaskType) => {
    const response = await fetch("/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...taskData,
        agentId,
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
    const response = await mutation.mutateAsync(data);
    console.log("response", response);
    router.push(`/agent/${agentId}`);
  };

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
                    <FormLabel>Task Description*</FormLabel>

                    <FormControl>
                      <Textarea {...field} className="w-full h-24 border p-2" />
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
                        id="compannies"
                        value={field.value ? "true" : "false"} // Convert boolean to string
                        size="lg"
                        className="flex justify-start h-fit items-center gap-4 w-full"
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        } // Convert back to boolean
                      >
                        {oneTimeRun.map((option, index) => (
                          <FormControl key={index}>
                            <ToggleGroupItem
                              key={index}
                              value={option}
                              aria-label={`Select ${option}`}
                              className="inline-flex w-1/2 m-0 py-6 border border-rounded border-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-lg data-[state=on]:bg-teal-50 data-[state=on]:text-black"
                            >
                              <div className="text-sm capitalize">{option}</div>
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
                name="interval"
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
                      {errors.interval?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="prompt.systemMessage.content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Message(Instructions)</FormLabel>
                    <FormDescription>
                      Provide custom instructions as a system message to the AI
                      model.
                    </FormDescription>

                    <FormControl>
                      <Textarea {...field} className="w-full h-24 border p-2" />
                    </FormControl>
                    {errors.prompt?.systemMessage?.content && (
                      <FormMessage className="text-red-500">
                        {errors.prompt?.systemMessage?.message}
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
                    <FormLabel>Add Post Urls or User & Channel Ids</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value ? field.value.join(", ") : ""}
                        onChange={(e) =>
                          field.onChange(e.target.value.split(", "))
                        }
                        className="w-full border p-2"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500">
                      {errors.source?.ids?.message?.toString()}
                    </FormMessage>
                  </FormItem>
                )}
              />

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
                        Open AI Secret Key*
                      </FormLabel>

                      <FormControl>
                        <div className="flex w-full gap-6 items-center">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            {...field}
                            className="w-full border p-2"
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
