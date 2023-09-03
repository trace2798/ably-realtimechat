import RealtimeForm from "@/components/realtime-form";
import { FC } from "react";

interface pageProps {}
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
const page: FC<pageProps> = ({}) => {
  return (
    <>
      <main className="min-h-screen w-full items-center justify-center flex px-5">
        <RealtimeForm />
      </main>
    </>
  );
};

export default page;
