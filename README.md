# Organization Management System

A TypeScript program that manages employees in an organization using Object-Oriented Programming (OOP) concepts.

## 1. Project Setup and Installation Steps

* Prerequisites:
  - Node.js (version 18 or higher)
  - npm (Node Package Manager)

* Installation:
  - Open terminal and navigate to the project folder.
  - Run the following command to install all dependencies:
    npm install

## 2. Execution Commands

* To run the program directly:
  npm start

* To compile and run as JavaScript:
  - Step 1: Compile TypeScript to JavaScript:
    npm run build
  - Step 2: Run the compiled JavaScript output:
    npm run start:js

## 3. Project Structure Explanation

* Project Folders and Files:
  - package.json: Contains project configuration, scripts, and dependencies.
  - tsconfig.json: Configuration file for TypeScript compiler settings.
  - .gitignore: Specifies files and folders for git to ignore (node_modules, dist).
  - README.md: Documentation file explaining the project.
  - src/index.ts: Main entry point that runs mock data and tests all functionalities.
  - src/types.ts: Contains Designation enum and data input interfaces.
  - src/models/Employee.ts: Contains the Employee base class and subclasses for each role.
  - src/services/OrganizationService.ts: Contains CRUD operations, hierarchy logic, and organization tree display.
  - src/utils/validator.ts: Contains helper functions for date format and hierarchy validation.

* What Each File Does:
  - types.ts: Defines the Designation enum (CEO, Director, Manager, Lead, Engineer) and input interfaces for adding and updating employees.
  - models/Employee.ts: Defines the Employee abstract base class and derived classes (CEO, Director, Manager, Lead, Engineer). It manages employee properties and reportee lists.
  - utils/validator.ts: Validates that dateOfBirth is in mm/dd/yyyy format and checks if an employee reports to the correct manager role.
  - services/OrganizationService.ts: Manages all operations like adding, reading, updating, deleting employees, and maintaining the reporting tree.
  - index.ts: Runs a complete test demo showing employee creation, data retrieval, updates, deletions, and all error-handling edge cases.

## 4. Design Approach and Assumptions

* Design Approach:
  - Built using Object-Oriented Programming (OOP) principles.
  - An abstract Employee base class defines common employee fields (id, name, dateOfBirth, designation, reportsTo, and reportees).
  - Concrete subclasses (CEO, Director, Manager, Lead, Engineer) extend Employee.
  - Engineer class overrides addReportee to disallow subordinates.
  - The organization hierarchy is strictly maintained:
    - CEO reports to no one.
    - Director reports to CEO.
    - Manager reports to Director.
    - Lead reports to Manager.
    - Engineer reports to Lead.

* Assumptions and Validations:
  - Unique ID: Every employee must have a unique ID. Duplicate IDs are rejected.
  - Single CEO: Only one CEO can exist in the organization at any time.
  - Date Format: Date of birth must follow the mm/dd/yyyy format with valid calendar days.
  - Safe Deletion: An employee with reportees cannot be deleted unless a replacement manager is provided. If provided, reportees are safely reassigned to the new manager.
  - Automatic Sync: Adding, updating, or removing an employee automatically updates the manager's reportees list.
