"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { serviceChildToParent, services } from "@/db/schema";
import type {
  CreateService,
  Service,
  UpdateService,
} from "@/types/service.types";

export async function getServices() {
  try {
    const services = await db.query.services.findMany({
      with: {
        parent: true,
      },
    });
    return services as (Service & { parent: { parentId: string }[] })[];
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Error fetching services");
  }
}

export async function getTopLevelServices() {
  try {
    const topLevelServices = await db.query.services.findMany({
      where: eq(services.type, "top-level"),
      with: {
        children: {
          with: {
            child: true,
          },
        },
      },
    });
    return topLevelServices as (Service & {
      children: {
        child: Service;
      }[];
    })[];
  } catch (error) {
    console.error("Error fetching top-level services:", error);
    throw new Error("Error fetching top-level services");
  }
}

export async function createService(dto: CreateService) {
  try {
    return await db.transaction(async (tx) => {
      const [service] = await tx
        .insert(services)
        .values({
          name: dto.name,
          type: dto.type,
          duration: dto.duration ? parseInt(dto.duration, 10) : undefined,
          price: dto.price ? parseInt(dto.price, 10) : undefined,
          image: dto.image,
        })
        .returning();

      if (dto.parentIds?.length) {
        await tx.insert(serviceChildToParent).values(
          dto.parentIds.map(({ parentId }) => ({
            parentId,
            childId: service.id,
          })),
        );
      }

      return service;
    });
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
        duration: dto.duration ? parseInt(dto.duration, 10) : undefined,
        price: dto.price ? parseInt(dto.price, 10) : undefined,
        image: dto.image,
      })
      .where(eq(services.id, id))
      .returning();
    return service;
  } catch (error) {
    console.error("Error updating service:", error);
    throw new Error("Error updating service");
  }
}
