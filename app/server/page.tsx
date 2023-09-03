import ConversationForm from "@/components/form";
import { FC } from "react";

interface ClientRestPageProps {}

const ClientRestPage: FC<ClientRestPageProps> = ({}) => {
  return (
    <>
      <div className="min-h-screen w-full items-center justify-center flex px-5">
        <ConversationForm />
      </div>
    </>
  );
};

export default ClientRestPage;
