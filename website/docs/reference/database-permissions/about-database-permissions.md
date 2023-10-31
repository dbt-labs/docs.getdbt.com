---
title: "Database permissions"
id: about-database-permissions
description: "Database permissions are access rights and privileges granted to users or roles within a database management system."
sidebar_label: "About database permissions"
---



Database permissions are access rights and privileges granted to users or roles within a database or data platform. They help you specify what actions users or roles can perform on various database objects, like tables, views, schemas, or even the entire database.

ARE THEY DIFF FROM MODEL GOVERNANCE BC CONTROLS THE DATABASE PERMISSIONS?

## Why are they useful

- Database permissions are essential for security and data access control.
- They ensure that only authorized users can perform specific actions.
- They help maintain data integrity, prevent unauthorized changes, and limit exposure to sensitive data.
- Permissions also support compliance with data privacy regulations and auditing.

## How to use them

- Users and administrators can grant and manage permissions using SQL statements or through the database system's interface.
- Assign permissions to individual users or roles (groups of users) based on their responsibilities.
  - Typical permissions include "SELECT" (read), "INSERT" (add data), "UPDATE" (modify data), "DELETE" (remove data), and administrative rights like "CREATE" and "DROP."
- Users should be assigned permissions that ensure they have the necessary access to perform their tasks without overextending privileges.
