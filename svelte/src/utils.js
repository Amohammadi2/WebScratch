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
    
    constructor(type, x, y, width, height, options) {
        this.body = Matter.Bodies[type](x, y, width, height, options);
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