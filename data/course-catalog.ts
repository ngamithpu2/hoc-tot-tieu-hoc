import type { CourseCatalogItem } from "./course-types";
import { science4CatalogItem } from "./courses/khoa-hoc-4-kntt/catalog";
import { english4CatalogItem } from "./courses/tieng-anh-4-ben-bella/catalog";
import { vietnamese4CatalogItem } from "./courses/tieng-viet-4-kntt/catalog";

export const courseCatalog: CourseCatalogItem[] = [
  vietnamese4CatalogItem,
  english4CatalogItem,
  science4CatalogItem,
];
