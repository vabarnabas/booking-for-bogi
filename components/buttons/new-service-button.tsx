"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export default function NewServiceButton() {
  return (
    <Link href="/dashboard/services/new" className={cn(buttonVariants())}>
      <Plus />
      Hozzáadás
    </Link>
  );
}
