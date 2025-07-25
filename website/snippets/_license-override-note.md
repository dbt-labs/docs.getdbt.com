:::important License types override group permissions

**User license types always override their assigned group permission sets.** This means that even if a user belongs to a group with administrative permissions, having a 'Read-Only' license would still prevent them from performing administrative actions.

For example:
- A user with a Read-Only license cannot perform administrative actions, even if they belong to an Account Admin group
- A user with an IT license has limited access regardless of their group permissions
- Only Developer licenses allow full access based on group permission sets

This override behavior ensures that license restrictions are always enforced, regardless of group membership.

::: 
