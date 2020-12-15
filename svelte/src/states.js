import { writable } from "svelte/store";

// [C]urrent [W]orking [D]irectory path
export const CWDPath = writable("");
export const pathDelimiter = 
    process.platform === "win32" ? "\\" : "/";