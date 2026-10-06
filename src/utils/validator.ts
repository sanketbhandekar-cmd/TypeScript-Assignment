import { Designation } from "../types";
import { Employee } from "../models/Employee";

export function isValidDateFormat(dateStr: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr);
  if (!match) return false;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const daysInMonth = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

export function getExpectedSuperiorRole(role: Designation): Designation | null {
  switch (role) {
    case Designation.CEO:
      return null;
    case Designation.Director:
      return Designation.CEO;
    case Designation.Manager:
      return Designation.Director;
    case Designation.Lead:
      return Designation.Manager;
    case Designation.Engineer:
      return Designation.Lead;
  }
}

export function validateHierarchy(designation: Designation, manager?: Employee): void {
  const expectedRole = getExpectedSuperiorRole(designation);

  if (designation === Designation.CEO) {
    if (manager) {
      throw new Error("CEO cannot report to anyone.");
    }
    return;
  }

  if (!manager) {
    throw new Error(`${designation} must report to an existing ${expectedRole}.`);
  }

  if (manager.designation !== expectedRole) {
    throw new Error(`${designation} must report to a ${expectedRole}, not a ${manager.designation}.`);
  }
}
