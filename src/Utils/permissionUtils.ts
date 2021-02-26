export function removePerm(perms: number, flag: number) {
  return (perms &= ~flag);
}
export function addPerm(perms: number, flag: number) {
  return perms | flag;
}
export function containsPerm(perms: number, flag: number) {
  return perms & flag;
}