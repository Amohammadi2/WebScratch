import { notifications, pathDelimiter } from "./states";

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

    rename() {
        // TODO: implement this function
    }

    remove() {
        // TODO: implement this function
    }
}

export class SystemFolder {

    constructor(path, name) {
        this.path = path;
        this.name = name;
        this.fs = require("fs");
    }

    create() {
        const { mkdirSync, existsSync } = this.fs;
        let folder_path = this.path + pathDelimiter + this.name;
        (existsSync(folder_path)) || mkdirSync(folder_path);
    }

    rename() {
        // TODO: implement this function
    }

    remove() {
        // TODO: implement this function
    }
}

export class GameObject {
    
    constructor( mode, type, x, y, width, height, options) {
        this.mode = mode;
        this.type = type;
        this.offset = {x, y};
        this.bounds = {width, height};
        this.scale = {xScale: 1, yScale: 1};
        this.options = options;
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