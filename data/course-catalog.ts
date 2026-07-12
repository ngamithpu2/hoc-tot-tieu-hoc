import type { CourseCatalogItem } from "./course-types";
import { science4CatalogItem } from "./courses/khoa-hoc-4-kntt/catalog";
import { english4CatalogItem } from "./courses/tieng-anh-4-ben-bella/catalog";

export const courseCatalog: CourseCatalogItem[] = [
  english4CatalogItem,
  science4CatalogItem,
];
