export default class TestHelper {
    /**
     * Utility function to wait for a certain amount of time (async)
     * @param milliseconds The time to wait in milliseconds
     * @returns The promise (awaitable)
     */
    public static wait(milliseconds:number){
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
}