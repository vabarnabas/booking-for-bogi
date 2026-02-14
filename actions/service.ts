"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import type { CreateService, UpdateService } from "@/types/service.types";

export async function getServices() {
  try {
    const services = await db.query.services.findMany();
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Error fetching services");
  }
}

export async function createService(dto: CreateService) {
  try {
    const [service] = await db
      .insert(services)
      .values({
        name: dto.name,
        type: dto.type,
        duration: dto.duration,
        price: dto.price,
        image: dto.image,
        optionCount: dto.optionCount,
      })
      .returning();
    return service;
  } catch (error) {
    console.error("Error creating service:", error);
    throw new Error("Error creating service");
  }
}

export async function updateService(id: string, dto: UpdateService) {
  try {
    const [service] = await db
      .update(services)
      .set({
        name: dto.name,
        type: dto.type,
        duration: dto.duration,
        price: dto.price,
        image: dto.image,
        optionCount: dto.optionCount,
      })
      .where(eq(services.id, id))
      .returning();
    return service;
  } catch (error) {
    console.error("Error updating service:", error);
    throw new Error("Error updating service");
  }
}
