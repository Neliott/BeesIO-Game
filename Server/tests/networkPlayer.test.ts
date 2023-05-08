import NetworkPlayerFixedAttributes from "../src/commonStructures/networkPlayerFixedAttributes";
import Position from "../src/commonStructures/position";
import NetworkPlayer from "../src/networkPlayer";

describe('NetworkPlayer',() => {
    it('ctor_fixedAttributes_equals', () => {
        expect(new NetworkPlayer(new NetworkPlayerFixedAttributes(10,11,"test",new Position(0,0))).fixedAttributes.id).toBe(10);
    });
});