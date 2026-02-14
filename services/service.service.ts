import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import type { CreateService, UpdateService } from "@/types/service.types";

async function getServices() {
  try {
    const services = await db.query.services.findMany();
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw new Error("Error fetching services");
  }
}

async function createService(dto: CreateService) {
  try {
    const [createdService] = await db
      .insert(services)
      .values({
        name: dto.name,
        type: dto.type,
        price: dto.price,
        duration: dto.duration,
        image: dto.image,
        optionCount: dto.optionCount,
      })
      .returning();
    return createdService;
  } catch (error) {
    console.error("Error creating service:", error);
    throw new Error("Error creating service");
  }
}

async function updateService(id: string, dto: UpdateService) {
  try {
    const [updatedService] = await db
      .update(services)
      .set({
        name: dto.name,
        type: dto.type,
        price: dto.price,
        duration: dto.duration,
        image: dto.image,
        optionCount: dto.optionCount,
      })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  } catch (error) {
    console.error("Error updating service:", error);
    throw new Error("Error updating service");
  }
}

async function deleteService(id: string) {
  try {
    await db.delete(services).where(eq(services.id, id));
    return { message: "Service deleted successfully" };
  } catch (error) {
    console.error("Error deleting service:", error);
    throw new Error("Error deleting service");
  }
}

export const ServiceService = {
  getServices,
  createService,
  updateService,
  deleteService,
};
