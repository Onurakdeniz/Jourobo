import React from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";

const CardBody = () => {
  return (
    <div className="flex-col flex gap-1">
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
      <div className="flex text-sm text-pretty italic font-light py-2">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </div>
    </div>
  );
};

export default CardBody;
