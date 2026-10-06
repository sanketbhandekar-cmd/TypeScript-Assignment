export enum Designation {
  CEO = "CEO",
  Director = "Director",
  Manager = "Manager",
  Lead = "Lead",
  Engineer = "Engineer"
}

export interface EmployeeInput {
  id: string;
  name: string;
  dateOfBirth: string; // mm/dd/yyyy
  designation: Designation;
  reportsTo?: string | null;
}

export interface UpdateEmployeeInput {
  name?: string;
  dateOfBirth?: string;
  reportsTo?: string | null;
}
