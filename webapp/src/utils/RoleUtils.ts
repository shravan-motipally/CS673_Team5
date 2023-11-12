import {Role} from "../types/global.types";

export const isAdministrator = (roles: Array<Role>) => {
  return roles.includes("Account Administrator")
}

export const isEducator = (roles: Array<Role>) => {
  return roles.includes("Educator")
}