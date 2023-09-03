"use client";
import { MouseEventHandler, MouseEvent, useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
// import { ChatCompletionRequestMessage } from "openai";

import { Heading } from "@/components/heading";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { configureAbly } from "@ably-labs/react-hooks";
import * as Ably from "ably/promises";
import { ScrollArea } from "./ui/scroll-area";

const ConversationForm = ({}) => {
  const router = useRouter();
  const { toast } = useToast();
  //   const [messages, setMessages] = useState<string>("A message");
  const [messages, setMessages] = useState<string[]>([]);

  const params = useParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });
  

  const isLoading = form.formState.isSubmitting;
  //   const [channel, setChannel] =
  //     useState<Ably.Types.RealtimeChannelPromise | null>(null);

  //   useEffect(() => {
  //     const ably: Ably.Types.RealtimePromise = configureAbly({
  //       key: process.env.ABLY_API_KEY,
  //       clientId: generateRandomId(),
  //       token: generateRandomId(),
  //     });
  //     const _channel = ably.channels.get("status-updates");
  //     setChannel(_channel);
  //   }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      //   if (channel === null) return;
      const response = await axios.post("/api/message", values);
      console.log(response);
      //   const message = `${form.getValues().text} @ ${new Date().toISOString()}`;
      //   channel.publish("update-from-client", { text: message });
      const requestData = JSON.parse(response.config.data);
      setMessages((messages) => [...messages, requestData.text, ]);
      form.reset();
      toast({
        title: "Answer Generated",
        description: "Answer for your question has been generated",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Oops something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Heading title="Ably Pub/Sub" />
      <div className="mt-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <h1>No conversation started</h1>
        )}
        {/* <div className="flex flex-col-reverse gap-y-4">{messages}</div> */}
        <ScrollArea className="h-[300px] rounded-md border flex flex-col-reverse py-5 bg-neutral-200">
          {messages.map((message: string, index: any) => (
            <div key={index} className="my-3">
              <h1 className="p-1 rounded-lg bg-indigo-400 max-w-[150px] ml-2">
                {message}
              </h1>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="mt-5">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full grid-cols-12 gap-2 p-2 px-3 border rounded-lg md:px-6 focus-within:shadow-sm"
            >
              <FormField
                name="text"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="p-0 m-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Your message"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="w-24 col-span-12 lg:col-span-2"
                type="submit"
                disabled={isLoading}
                size="icon"
              >
                Send
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ConversationForm;
