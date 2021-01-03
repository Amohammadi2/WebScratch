import { writable } from "svelte/store";
import { notifications, pathDelimiter } from "./states";

const { dialog } = require("electron").remote;

export class NotificationAPI {
    static add(msg, type) {
        notifications.update((value) => {
            return [...value, {
                msg, type, pk: Symbol(),
            }];
        });
    }
}

export class SystemFile {

    constructor(path) {
        this.path = path;
        this.fs = require("fs");
    }

    write(content) {
        const { writeFileSync } = this.fs;
        writeFileSync(this.path, content);
    }

    writeJSON(content) {
        let encodedContent = JSON.stringify(content, null, 4);
        this.write(encodedContent);
    }

    read () {
        const { readFileSync } = this.fs;
        return readFileSync(this.path);
    }

    readJSON() {
        return JSON.parse(this.read());
    }

    rename(new_name) {
        const { renameSync, existsSync } = this.fs;
        let path = this.path.split(pathDelimiter);
        path.splice(path.length-1, 1);
        path.push(new_name);
        let new_path = path.join(pathDelimiter);
        console.log (new_path);
        (existsSync(this.path)) && renameSync(this.path, new_path);
    }

    remove() {
        // TODO: implement this function
        const { rmdirSync } = this.fs;
        console.log(this.path);
        rmdirSync(this.path, {recursive: true});
    }
}

export class SystemFolder {

    constructor(path) {
        this.path = path;
        this.fs = require("fs");
    }

    create() {
        const { mkdirSync, existsSync } = this.fs;
        (existsSync(this.path)) || mkdirSync(this.path);
    }

    rename() {
        // TODO: implement this function
    }

    remove() {
        // TODO: implement this function
        const { rmdirSync } = this.fs;
        console.log(this.path);
        rmdirSync(this.path, {recursive: true});
    }
}

export class GameObject {
    // ! @snippet
    //Object.getOwnPropertyNames(a).concat(Object.getOwnPropertyNames(a.__proto__))
    constructor( mode, type, x, y, width, height, options) {
        this.mode = mode;
        this.type = type;
        this.offset = {x, y};
        this.bounds = {width, height};
        this.scale = {xScale: 1, yScale: 1};
        this.options = options;
        this.label = writable(options.label || "");
        this.scripts = writable([]);
        this.body = undefined;
    }

    create() {
        if (this.mode == "body") {
            let {x, y} = this.offset;
            let {width, height} = this.bounds;
            let {xScale, yScale} = this.scale;
            this.body = Matter.Bodies[this.type]
                (x, y, width * xScale, height * yScale , this.options);
        }
    }

    remove() {
        this.body
            ? Matter.Composite.remove(PhysicsEngine.world, this.body)
            : undefined; // do nothing
    }
    
    add() {
        Matter.World.add(PhysicsEngine.world, this.body);
    }

    reconstruct() {
        this.remove();
        this.create();
        this.add();
    }

    // should be overwritten
    setup() {};

    // should be overwritten
    update(){
        requestAnimationFrame(this.update.bind(this));
    }

    run() {
        this.setup();
        requestAnimationFrame(this.update.bind(this));
    }
}

export class Dialogs {

    static alert (message) {
        return dialog.showMessageBoxSync(undefined, {
            message,
        });
    }

    static confirm(question) {
        return [true, false][dialog.showMessageBoxSync(undefined, {
            message: question,
            type: "question",
            buttons: ["Yes", "No"],
        })];
    }

}