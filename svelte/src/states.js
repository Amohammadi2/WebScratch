import { writable } from "svelte/store";

// [C]urrent [W]orking [D]irectory path
export const CWDPath = writable("");
export const pathDelimiter = 
    process.platform === "win32" ? "\\" : "/";
export const supportedFileFormats = [
    "json", "js"
];
export const codeEditorContents = writable("");
export const isEditorOpened = writable(false);
export const gameComponents = writable([]);
export const isComponentCreatorOpened = writable(false);
export const notifications = writable([]);