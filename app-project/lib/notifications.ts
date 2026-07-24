import "server-only";
import type { AttendanceStatus } from "./types";

/**
 * Integration point for the Notification module (not yet built).
 *
 * Every place attendance changes — single toggle or bulk action — calls this
 * so that, once a real notification system exists, wiring it in is a
 * one-file change: replace the console.log below with the real dispatch
 * (email, push, SMS, in-app feed, etc.) and everything upstream keeps working
 * unmodified.
 */
export function notifyAttendanceChange(params: {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  recordedBy: string;
}): void {
  console.log("[notifications:attendance-change]", {
    ...params,
    at: new Date().toISOString(),
  });
}

/**
 * Fires whenever a new assignment is published in the Learning Materials
 * module. Replace the console.log below with the real dispatch once the
 * Notification module exists; the calendar module also expects to read
 * assignment due dates for its own reminders.
 */
export function notifyNewAssignment(params: {
  assignmentId: string;
  title: string;
  subject: string;
  dueDate: string;
}): void {
  console.log("[notifications:new-assignment]", {
    ...params,
    at: new Date().toISOString(),
  });
}
