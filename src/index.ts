import { OrganizationService } from "./services/OrganizationService";
import { Designation } from "./types";

function main(): void {
  const org = new OrganizationService();

  // Create initial employees
  org.addEmployee({
    id: "EMP001",
    name: "Narendra Modi",
    dateOfBirth: "05/14/1954",
    designation: Designation.CEO
  });

  org.addEmployee({
    id: "EMP002",
    name: "Amit Shah",
    dateOfBirth: "10/22/1966",
    designation: Designation.Director,
    reportsTo: "EMP001"
  });

  org.addEmployee({
    id: "EMP003",
    name: "Rajnath Singh",
    dateOfBirth: "07/19/1958",
    designation: Designation.Manager,
    reportsTo: "EMP002"
  });

  org.addEmployee({
    id: "EMP004",
    name: "Nitin Gadkari",
    dateOfBirth: "03/27/1961",
    designation: Designation.Manager,
    reportsTo: "EMP002"
  });

  org.addEmployee({
    id: "EMP005",
    name: "S. Jaishankar",
    dateOfBirth: "01/18/1963",
    designation: Designation.Lead,
    reportsTo: "EMP003"
  });

  org.addEmployee({
    id: "EMP006",
    name: "Nirmala Sitharaman",
    dateOfBirth: "08/24/1970",
    designation: Designation.Engineer,
    reportsTo: "EMP005"
  });

  org.addEmployee({
    id: "EMP007",
    name: "Piyush Goyal",
    dateOfBirth: "06/15/1974",
    designation: Designation.Engineer,
    reportsTo: "EMP005"
  });

  console.log("=== 1. Retrieve All Employees ===");
  for (const emp of org.getAllEmployees()) {
    console.log(emp.getSummary());
  }

  console.log("\n=== 2. Retrieve Specific Employee ===");
  const lead = org.getEmployeeById("EMP005");
  console.log("Found:", lead.getSummary());

  console.log("\n=== 3. Testing Edge Cases & Validations ===");

  // Test: Duplicate ID
  try {
    org.addEmployee({
      id: "EMP001",
      name: "Duplicate Narendra",
      dateOfBirth: "02/11/1985",
      designation: Designation.Engineer,
      reportsTo: "EMP005"
    });
  } catch (error) {
    if (error instanceof Error) console.log("[Expected Error - Duplicate ID]:", error.message);
  }

  // Test: Multiple CEOs
  try {
    org.addEmployee({
      id: "EMP099",
      name: "Rahul Gandhi",
      dateOfBirth: "09/19/1972",
      designation: Designation.CEO
    });
  } catch (error) {
    if (error instanceof Error) console.log("[Expected Error - Multiple CEOs]:", error.message);
  }

  // Test: Invalid Reporting Relationship (Engineer reporting to CEO)
  try {
    org.addEmployee({
      id: "EMP008",
      name: "Arvind Kejriwal",
      dateOfBirth: "04/12/1976",
      designation: Designation.Engineer,
      reportsTo: "EMP001"
    });
  } catch (error) {
    if (error instanceof Error) console.log("[Expected Error - Hierarchy Rule]:", error.message);
  }

  // Test: Invalid Date of Birth Format
  try {
    org.addEmployee({
      id: "EMP009",
      name: "Mamata Banerjee",
      dateOfBirth: "1975-12-30",
      designation: Designation.Engineer,
      reportsTo: "EMP005"
    });
  } catch (error) {
    if (error instanceof Error) console.log("[Expected Error - Date Format]:", error.message);
  }

  console.log("\n=== 4. Update Operations ===");
  const updatedEmp = org.updateEmployee("EMP006", {
    name: "Nirmala Sitharaman (Updated)",
    dateOfBirth: "08/25/1970"
  });
  console.log("Updated EMP006:", updatedEmp.getSummary());

  console.log("\n=== 5. Delete Operations ===");

  // Attempt delete manager with active reportees (without reassignment)
  try {
    org.deleteEmployee("EMP003");
  } catch (error) {
    if (error instanceof Error) console.log("[Expected Error - Delete With Reportees]:", error.message);
  }

  // Delete manager EMP003 with reassignment to EMP004
  org.deleteEmployee("EMP003", "EMP004");
  console.log("Deleted EMP003 (Rajnath Singh) and reassigned reportees to EMP004 (Nitin Gadkari).");

  // Delete an engineer (leaf employee)
  org.deleteEmployee("EMP007");
  console.log("Deleted Engineer EMP007 (Piyush Goyal).");
}

main();
