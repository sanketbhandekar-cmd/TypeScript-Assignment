import { EmployeeInput, Designation, UpdateEmployeeInput } from "../types";
import { Employee, createEmployee } from "../models/Employee";
import { isValidDateFormat, validateHierarchy } from "../utils/validator";

export class OrganizationService {
  private employees = new Map<string, Employee>();

  public getCEO(): Employee | undefined {
    for (const employee of this.employees.values()) {
      if (employee.designation === Designation.CEO) {
        return employee;
      }
    }
    return undefined;
  }

  public addEmployee(input: EmployeeInput): Employee {
    if (!input.id?.trim() || !input.name?.trim() || !input.dateOfBirth?.trim()) {
      throw new Error("ID, name, and dateOfBirth are required.");
    }

    if (!isValidDateFormat(input.dateOfBirth)) {
      throw new Error(`Invalid date format '${input.dateOfBirth}'. Must be mm/dd/yyyy.`);
    }

    if (this.employees.has(input.id)) {
      throw new Error(`Employee with ID '${input.id}' already exists.`);
    }

    if (input.designation === Designation.CEO && this.getCEO()) {
      throw new Error("Organization already has a CEO. Only one CEO is allowed.");
    }

    const manager = input.reportsTo ? this.employees.get(input.reportsTo) : undefined;
    validateHierarchy(input.designation, manager);

    const employee = createEmployee(
      input.id,
      input.name,
      input.dateOfBirth,
      input.designation,
      input.reportsTo
    );

    this.employees.set(employee.id, employee);

    if (manager) {
      manager.addReportee(employee.id);
    }

    return employee;
  }

  public getAllEmployees(): Employee[] {
    return Array.from(this.employees.values());
  }

  public getEmployeeById(id: string): Employee {
    const employee = this.employees.get(id);
    if (!employee) {
      throw new Error(`Employee with ID '${id}' not found.`);
    }
    return employee;
  }

  public updateEmployee(id: string, updates: UpdateEmployeeInput): Employee {
    const employee = this.getEmployeeById(id);

    if (updates.name !== undefined) {
      if (!updates.name.trim()) throw new Error("Name cannot be empty.");
      employee.name = updates.name;
    }

    if (updates.dateOfBirth !== undefined) {
      if (!isValidDateFormat(updates.dateOfBirth)) {
        throw new Error(`Invalid date format '${updates.dateOfBirth}'. Must be mm/dd/yyyy.`);
      }
      employee.dateOfBirth = updates.dateOfBirth;
    }

    if (updates.reportsTo !== undefined && updates.reportsTo !== employee.reportsTo) {
      if (employee.designation === Designation.CEO) {
        throw new Error("CEO cannot report to anyone.");
      }

      if (updates.reportsTo === employee.id) {
        throw new Error("An employee cannot report to themselves.");
      }

      const newManager = updates.reportsTo ? this.employees.get(updates.reportsTo) : undefined;
      validateHierarchy(employee.designation, newManager);

      // Remove from old manager's reportees
      if (employee.reportsTo) {
        this.employees.get(employee.reportsTo)?.removeReportee(employee.id);
      }

      // Add to new manager's reportees
      if (newManager) {
        newManager.addReportee(employee.id);
        employee.reportsTo = newManager.id;
      }
    }

    return employee;
  }

  public deleteEmployee(id: string, reassignedManagerId?: string): boolean {
    const employee = this.getEmployeeById(id);

    if (employee.reportees.length > 0) {
      if (!reassignedManagerId) {
        throw new Error(
          `Cannot delete '${employee.name}' (ID: ${employee.id}) with active reportees: [${employee.reportees.join(
            ", "
          )}]. Reassign them first.`
        );
      }

      const newManager = this.getEmployeeById(reassignedManagerId);
      if (newManager.designation !== employee.designation) {
        throw new Error(`Reassigned manager must also be a ${employee.designation}.`);
      }

      for (const reporteeId of employee.reportees) {
        const reportee = this.employees.get(reporteeId);
        if (reportee) {
          reportee.reportsTo = newManager.id;
          newManager.addReportee(reportee.id);
        }
      }
    }

    if (employee.reportsTo) {
      this.employees.get(employee.reportsTo)?.removeReportee(employee.id);
    }

    return this.employees.delete(id);
  }

  public printHierarchy(): void {
    const ceo = this.getCEO();
    console.log("\n--- Organization Hierarchy Tree ---");

    if (!ceo) {
      console.log("No organization data available.");
      return;
    }

    const printNode = (emp: Employee, indent: string = ""): void => {
      console.log(`${indent}└── [${emp.designation}] ${emp.name} (${emp.id})`);
      for (const childId of emp.reportees) {
        const child = this.employees.get(childId);
        if (child) printNode(child, indent + "    ");
      }
    };

    printNode(ceo);
    console.log("------------------------------------\n");
  }
}
