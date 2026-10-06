import { Designation } from "../types";

export abstract class Employee {
  public reportees: string[] = [];

  constructor(
    public readonly id: string,
    public name: string,
    public dateOfBirth: string,
    public readonly designation: Designation,
    public reportsTo: string | null = null
  ) {}

  public addReportee(employeeId: string): void {
    if (!this.reportees.includes(employeeId)) {
      this.reportees.push(employeeId);
    }
  }

  public removeReportee(employeeId: string): void {
    this.reportees = this.reportees.filter((id) => id !== employeeId);
  }

  public getSummary(): string {
    const manager = this.reportsTo ? `Reports to: ${this.reportsTo}` : "Reports to: None";
    const subordinates = this.reportees.length > 0 ? `Reportees: [${this.reportees.join(", ")}]` : "Reportees: []";
    return `[${this.designation}] ID: ${this.id}, Name: ${this.name}, DOB: ${this.dateOfBirth}, ${manager}, ${subordinates}`;
  }
}

export class CEO extends Employee {
  constructor(id: string, name: string, dateOfBirth: string) {
    super(id, name, dateOfBirth, Designation.CEO, null);
  }
}

export class Director extends Employee {
  constructor(id: string, name: string, dateOfBirth: string, reportsTo: string) {
    super(id, name, dateOfBirth, Designation.Director, reportsTo);
  }
}

export class Manager extends Employee {
  constructor(id: string, name: string, dateOfBirth: string, reportsTo: string) {
    super(id, name, dateOfBirth, Designation.Manager, reportsTo);
  }
}

export class Lead extends Employee {
  constructor(id: string, name: string, dateOfBirth: string, reportsTo: string) {
    super(id, name, dateOfBirth, Designation.Lead, reportsTo);
  }
}

export class Engineer extends Employee {
  constructor(id: string, name: string, dateOfBirth: string, reportsTo: string) {
    super(id, name, dateOfBirth, Designation.Engineer, reportsTo);
  }

  public override addReportee(_employeeId: string): void {
    throw new Error("Engineers cannot have reportees.");
  }
}

export function createEmployee(
  id: string,
  name: string,
  dateOfBirth: string,
  designation: Designation,
  reportsTo?: string | null
): Employee {
  switch (designation) {
    case Designation.CEO:
      return new CEO(id, name, dateOfBirth);
    case Designation.Director:
      return new Director(id, name, dateOfBirth, reportsTo ?? "");
    case Designation.Manager:
      return new Manager(id, name, dateOfBirth, reportsTo ?? "");
    case Designation.Lead:
      return new Lead(id, name, dateOfBirth, reportsTo ?? "");
    case Designation.Engineer:
      return new Engineer(id, name, dateOfBirth, reportsTo ?? "");
  }
}
