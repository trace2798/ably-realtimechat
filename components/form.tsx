"use client";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./constants";
import { ScrollArea } from "./ui/scroll-area";
import { configureAbly } from "@ably-labs/react-hooks";
import * as Ably from "ably/promises";
import { useRouter } from "next/navigation";

type Message = { text: string; isOwnMessage: boolean };

const ConversationForm = ({}) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<ElementRef<"div">>(null);
  const tabId = useRef(Math.floor(Math.random() * 100001).toString()).current;
  const router = useRouter();
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    const ably = configureAbly({
      authUrl: `/api/auth`,
      // queryTime: true,
    });
    // const ably =  new Ably.Realtime({ key: process.env.ABLY_API_KEY });
    const channel = ably.channels.get("status-updates");
    //   channel.subscribe((message) => {
    //     // handle incoming message
    //     setMessages((messages) => [...messages, message.data.text]);
    //   });
    // }, []);
    channel.subscribe((message: Ably.Types.Message) => {
      // Check if the message was sent from the current tab
      // // console.log(message.data.tabId);
      const isOwnMessage = message.data.tabId === tabId;
      setMessages((messages) => [
        ...messages,
        { text: message.data.text, isOwnMessage },
      ]);
    });
    return () => {
      // Unsubscribe when the component unmounts
      channel.unsubscribe();
    };
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   try {
  //     const response = await axios.post("/api/message", values);
  //     // console.log(response);
  //     const requestData = JSON.parse(response.config.data);
  //     setMessages((messages) => [...messages, requestData.text]);
  //     form.reset();
  //     toast({
  //       title: "Message Sent",
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     toast({
  //       title: "Oops something went wrong",
  //       variant: "destructive",
  //     });
  //   }
  // };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/message", { ...values, tabId });
      form.reset();
      toast({
        title: "Message Sent",
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
      <Heading title="Ably Pub/Sub Rest Server" />
      <div className="mt-4 space-y-4">
        <ScrollArea className="h-[300px] rounded-md border flex flex-col-reverse py-5 bg-sky-50">
          {messages.map((message: Message, index: any) => (
            <div key={index} className="my-3">
              <h1
                className={`p-1 px-3 rounded-lg max-w-[150px] ${
                  message.isOwnMessage
                    ? "ml-auto bg-indigo-400 mr-2"
                    : "ml-2 bg-teal-500"
                }`}
              >
                {message.text}
              </h1>
            </div>
          ))}
          <div ref={scrollRef} />
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
      <div className="flex mt-10 w-full justify-evenly">
        <Button onClick={() => router.push("/")} variant="secondary">
          Home
        </Button>
        <Button onClick={() => router.push("/client")} variant="secondary">
          Client
        </Button>
      </div>
    </div>
  );
};

export default ConversationForm;
