"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <main className="min-h-screen w-full flex-col items-center justify-center flex px-5">
        <h1>Ably's Pub Sub Next.js App Directory implementation</h1>
        <div className="flex mt-10 w-1/2 justify-evenly">
          <Button onClick={() => router.push("/client")}>Client</Button>
          <Button onClick={() => router.push("/server")}>Server</Button>
        </div>
      </main>
    </>
  );
}
