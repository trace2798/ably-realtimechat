import RealtimeForm from "@/components/realtime-form";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <main className="min-h-screen w-full items-center justify-center flex">
        <RealtimeForm />
      </main>
    </>
  );
};

export default page;
