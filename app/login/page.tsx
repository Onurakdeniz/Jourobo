'use client';
 
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { BotMessageSquare } from 'lucide-react';

import { VT323 } from "next/font/google";
const VT323font = VT323({ subsets: ["latin"], weight: "400" });

export default function LoginPage() {
  const { login } = usePrivy();

  return (
    <>
      <Head>
        <title>Login · Privy</title>
      </Head>

      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-privy-light-blue flex-1 p-6 mb-32 justify-center items-center">
          <div>
            <div className="flex-col flex gap-12">
            <div className="flex-col flex gap-6">
              <BotMessageSquare size={96} className="mx-auto" />
              <h1   style={{ fontFamily: VT323font.style.fontFamily }} className="text-6xl font-bold text-center">Welcome to JOUROBO</h1>
              <p   style={{ fontFamily: VT323font.style.fontFamily }} className="font-mono text-xl text-center">Create your own journo agent with ROBOJOU and join the network revolutionizing journalism through autonomous AI agents.</p>
              
            </div>
            <div className="mt-6 flex-col flex gap-4  items-center text-center">
          
              <Button
                className="bg-orange-600 w-48 hover:bg-orange-700 py-3 px-16 text-white font-bold text-lg rounded-lg"
                onClick={login}
                size={"lg"}
              >
                Log in
              </Button>
            </div>
            </div>
           
          </div>
        </div>
      </main>
    </>
  );
}