
Key:

* (C)reate &mdash; Create new feature
* (M)odify &mdash; Change existing fields. 
* (D)elete &mdash; Remove feature fields entirely 
* (V)iew &mdash; Read-only access
* ❌ = No access to the feature
* ✅ = Can access feature that does not use C/M/D/V permissions

_Scroll to view all fields_

| Role            | Environments | Projects | Connections | Jobs  | Repositories | Groups | Group memberships | Account settings | Webhooks | Account-level artifacts | Notifications | Use IDE |
|-----------------|:------------:|:--------:|:-----------:|:-----:|:------------:|:------:|:-----------------:|:----------------:|:--------:|:-----------------------:|:-------------:|:-------:|
| Account admin   | C/M/D        | C/M/D    | C/M/D       | C/M/D | C/M/D        | C/M/D  | C/M/D             | C/M/D            | C/M/D    | C/M/D                   |   C/M/D       | ✅      |
| Account viewer  |     V        |   V      |   V         |   V   |   V          |  V     |      V            |    V             |   ❌     |   V                     |      V        | ❌      |
| Admin           |  C/M/D       |   V      | C/M/D       | C/M/D | C/M/D        |  V     | C/M/D             |     V            | C/M/D    | ❌                      |      V        | ✅      |
| Analyst         | V            |    ❌    |  V          | ❌    | ❌           | ❌      | ❌                | ❌               | ❌       | ❌                      | ❌            | ✅      |
| Database admin  | V            | V        | C/M/D       | V     | V            | ❌     | ❌                 | ❌              | ❌        | ❌                      | ❌            | ❌      |
| Developer       | ❌           | ❌       | ❌          | C/M/D | ❌            | ❌     | ❌                | ❌               | C/M/D    | ❌                      | ❌            | ✅      |
| Git admin       | V            | V        | V           | V     | C/M/D        | ❌     | ❌                | ❌               | ❌        | ❌                      | ❌            | ❌      | 
| Job admin       | C/M/V        | ❌       | V           | C/M/D | ❌            | ❌     | ❌                | ❌              | ❌        | ❌                      | ❌            | ❌      | 
| Job viewer      | V            | ❌       | ❌          | V     | ❌            | ❌     | ❌                | ❌               | ❌       | ❌                      | ❌            |  ❌     |
| Project creator | C/M/D        | C/M/D    | C/M/D       | C/M/D | C/M/D        | V       | V                | V                | ❌       | ❌                      | V             | ✅      |
| Stakeholder     | ❌           | ❌       | ❌          | ❌     | ❌           | ❌      | ❌               | ❌               | ❌        | ❌                      | ❌            | ❌      | 
| Team admin      | V            | V        | ❌          | V     | V            | V       | ❌               | ❌               | ❌        | ❌                      | ❌            | ❌      |   
