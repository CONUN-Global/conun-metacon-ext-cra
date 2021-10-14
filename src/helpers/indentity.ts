import { METACON_IDENTITY } from "../const";

export function getIdentity() {
  return JSON.parse(localStorage.getItem(METACON_IDENTITY) || "{}");
}

export function setIdentity(key: string) {
  return localStorage.setItem(METACON_IDENTITY, JSON.stringify(key));
}
