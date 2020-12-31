import { notifications } from "./states";

export class NotificationAPI {
    static add(msg, type) {
        notifications.update((value) => {
            return [...value, {
                msg, type, pk: Symbol(),
            }];
        });
    }
}

export class GameObject {
    
    constructor(mode, type, x, y, width, height, options) {
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