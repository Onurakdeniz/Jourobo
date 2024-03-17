import React from "react";
import CreateAgentHeader from "./components/create-agent-header";
import CreateAgentBody from "./components/create-agent-body";

const Page = () => {
  return (
    <div className="flex-col flex gap-4 border rounded-lg w-full py-6 px-8 mb-4" style={{ height: 'calc(100vh - 100px)' }}>
       <CreateAgentHeader />
       <CreateAgentBody />
    </div>
  );
};

export default Page;
