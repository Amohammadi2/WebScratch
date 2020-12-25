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