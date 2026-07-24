import "server-only";
import type { Student, Teacher } from "./types";

/**
 * Integration point for the Search module (not yet built).
 *
 * The Search module is expected to index all student and teacher records.
 * Rather than scatter ad-hoc indexing calls, mutations in this module funnel
 * through these two functions. Swap the console.log calls for a real
 * upsert/delete against the search index once that module exists.
 */
export function indexStudent(student: Pick<Student, "id" | "name" | "studentId" | "classSection">): void {
  console.log("[search-index:upsert:student]", student);
}

export function indexTeacher(teacher: Pick<Teacher, "id" | "name" | "department" | "subjects">): void {
  console.log("[search-index:upsert:teacher]", teacher);
}

/**
 * Called for every learning material, video, or assignment that the Learning
 * Materials module surfaces in a search — both to log query hits during
 * development and as the future upsert point once a real search index exists.
 */
export function indexMaterial(item: { id: string; title: string; subject: string }): void {
  console.log("[search-index:upsert:material]", item);
}
