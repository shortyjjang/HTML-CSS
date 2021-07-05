export function redirect(destination) {
    if (destination == null) {
        return false;
    } else {
        location.href = destination;
        return true;
    }
}
