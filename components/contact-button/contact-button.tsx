import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function ContactButton() {
  return (
    <div className="fixed right-6 bottom-6">
      <Tooltip>
        <TooltipTrigger>
          <Link
            href="https://www.facebook.com/profile.php?id=61570092973159"
            target="_blank"
            className="relative flex size-12 items-center justify-center overflow-clip rounded-full border-primary bg-background object-contain shadow-sm ring-3 ring-primary md:size-14"
          >
            <Image
              src="/logo.png"
              alt="WhatsApp"
              fill
              className="mx-auto rounded-full"
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-center text-sm">Lépj kapcsolatba velem!</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
