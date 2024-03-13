

import React from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Sue_Ellen_Francisco } from 'next/font/google'

const VT323a = Sue_Ellen_Francisco({
  weight: "400",
  subsets: ["latin"]
})


const CardBody = () => {

 
  return (
    <div  > 
    <div className="flex-col flex gap-2">
      <div className="italic text-pretty font-bold">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been</div>
      <div className="flex gap-2 items-center">
        <Link href="/ethereum">
          <Badge
            variant="outline"
            className="flex gap-2 items-center px-2 text-[10px] rounded-sm font-light border-orange-600  text-orange-600 "
          >
            Ethereum
          </Badge>
        </Link>
      </div>
      <div className="flex-col flex gap-3 text-sm text-pretty italic font-light py-2">
      <div className="flex w-full gap-2 items-start " >
       
     
        <span className=" w-1/2">
      <span className=" uppercase text-lg font-bold">Ethereum </span>, often dubbed as the "world computer," is a decentralized platform that enables the creation and execution of smart contracts and decentralized applications (DApps). Launched in 2015 by Vitalik Buterin and a group of developers, Ethereum introduced the concept of a blockchain with a built-in programming language, allowing developers to build a wide range of applications beyond simple transactions. At its core, Ethereum operates on a blockchain similar to Bitcoin's, but with added functionality that extends beyond simple value transfer.
</span>
<Image src="/newsdark.png" alt="ethereum" className="flex w-1/2 rounded-lg" width={200} height={120} />
 </div>
<span className="mt-4"> One of the key innovations of Ethereum is its Turing-complete scripting language, Solidity. This language enables developers to write smart contracts, self-executing contracts with the terms of the agreement directly written into code. Smart contracts on Ethereum can facilitate a variety of transactions, from token issuance and decentralized finance (DeFi) protocols to decentralized autonomous organizations (DAOs) and non-fungible tokens (NFTs). This flexibility has led to the rapid growth of the Ethereum ecosystem, with thousands of DApps and tokens built on the platform.</span>

<span>Ethereum's native cryptocurrency, Ether (ETH), is used as both a digital currency and a fuel for executing transactions and smart contracts on the network. The Ethereum network operates on a proof-of-work (PoW) consensus mechanism, similar to Bitcoin, although it is in the process of transitioning to a proof-of-stake (PoS) model through the Ethereum 2.0 upgrade. This upgrade aims to improve scalability, security, and sustainability, addressing some of the limitations of the current PoW model. With its vibrant developer community, broad range of use cases, and ongoing development efforts, Ethereum continues to play a central role in shaping the future of decentralized finance and web3 applications.</span>
 </div>
    </div>
    </div>
  );
};

export default CardBody;
