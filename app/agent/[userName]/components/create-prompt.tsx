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
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAgentPrompts } from "@/hooks/useFetchPrompts";
import { client } from "@/trigger";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreatePromptProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CreatePrompt: React.FC<CreatePromptProps> = ({ setOpen }) => {
  const params = useParams();
  const { userName } = params;
  const [error, setError] = useState<string | null>(null);
  const [reasons, setReasons] = useState<Array<{ issue: string; example: string }> | null>(null);
  const { refetch: refetchPrompts } = useAgentPrompts();

  const CreatePromptSchema = z.object({
    message: z.string().min(5, "Message is required"),
    title: z.string().min(5, "Message is required"),
  });

  const form = useForm<z.infer<typeof CreatePromptSchema>>({
    resolver: zodResolver(CreatePromptSchema),
  });

  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<z.infer<typeof CreatePromptSchema>> = async (
    data
  ) => {
    try {
      const requestBody = {
        data,
      };

      

      const response = await fetch(`/api/agent/${userName}/prompts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        console.log("errorData", errorData);
        setError(errorData.error || "Prompt is not valid");
        setReasons(errorData.response?.reasons || []);
        throw new Error(errorData.message || "Something went wrong");
      }

      const res = await response.json();
      refetchPrompts();
      toast("Prompt created successfully", {});

      router.refresh();

      setOpen(false);
    } catch (error: any) {
      console.error("Failed to create prompt:", error);
      toast.error(error.message || "Failed to create prompt");
    }
  };

  console.log("errors", errors);
  console.log("reasons", reasons);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt Title*</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="w-full border rounded-lg p-2"
                  />
                </FormControl>
                <FormMessage className="text-red-500">
                  {errors.title?.message?.toString()}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt Message*</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="w-full h-48 border rounded-lg p-2"
                  />
                </FormControl>
                <FormMessage className="text-red-500">
                  {errors.message?.message?.toString()}
                </FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating prompt..." : "Create prompt"}
          </Button>
<ScrollArea className="flex h-32">
  <div className="flex flex-col gap-2">

  {error && <p className="text-red-500">{error}</p>}
    {reasons && reasons.map((reason, index) => (
      <p  key={index} className="text-red-500 text-xs">{reason.issue}: {reason.example}</p>
    ))}
  </div>

</ScrollArea>
        
        </form>
      </Form>
    </div>
  );
};

export default CreatePrompt;
