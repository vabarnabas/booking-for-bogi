"use server";

import { db } from "@/db";
import { serviceCategories } from "@/db/schema";
import type {
  CreateServiceCategory,
  ServiceCategory,
} from "@/types/service-category.types";

export async function getServiceCategories() {
  try {
    const serviceCategories = await db.query.serviceCategories.findMany();
    return serviceCategories as ServiceCategory[];
  } catch (error) {
    console.error("Error fetching service categories:", error);
    throw error;
  }
}

export async function createServiceCategory(dto: CreateServiceCategory) {
  try {
    const [serviceCategory] = await db
      .insert(serviceCategories)
      .values({
        displayName: dto.displayName,
        slug: dto.slug,
      })
      .returning();

    return serviceCategory as ServiceCategory;
  } catch (error) {
    console.error("Error creating service category:", error);
    throw error;
  }
}
