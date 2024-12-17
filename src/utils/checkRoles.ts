export default function checkRoles<T>(rolesArray: T[], permissions: T[]): boolean {
  return permissions.every((item) => rolesArray?.includes(item));
}
