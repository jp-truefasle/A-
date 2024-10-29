/**
 * ts单例类模板
 */

export default class Singleton {

    private static instance = null;
    
    public static Instance<T>(Fun: { new(): T }): T {
        if (!this.instance) {
            this.instance = new Fun();
        }
        return this.instance;
    }

}
