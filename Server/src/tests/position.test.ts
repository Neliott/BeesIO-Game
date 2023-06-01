import Position from "../commonStructures/position";

describe('Position',() => {
    it('ctor_works', () => {
        //Given + When
        let position:Position = new Position(0,0);
        //Then
        expect(position).not.toBeNull();
    });
    it('ctor_x_equal', () => {
        //Given + When
        let position:Position = new Position(2,3);
        //Then
        expect(position.x).toBe(2);
    });
    it('ctor_y_equal', () => {
        //Given + When
        let position:Position = new Position(2,3);
        //Then
        expect(position.y).toBe(3);
    });
    it('ctor_x_negative', () => {
        //Given + When
        let position:Position = new Position(-2,3);
        //Then
        expect(position.x).toBe(-2);
    });
    it('ctor_y_negative', () => {
        //Given + When
        let position:Position = new Position(2,-3);
        //Then
        expect(position.y).toBe(-3);
    });
    it('ctor_x_float', () => {
        //Given + When
        let position:Position = new Position(2.5,3);
        //Then
        expect(position.x).toBe(2.5);
    });
    it('ctor_y_float', () => {
        //Given + When
        let position:Position = new Position(2,3.5);
        //Then
        expect(position.y).toBe(3.5);
    });
    it('equals_equal', () => {
        //Given
        let position1:Position = new Position(2,3);
        let position2:Position = new Position(2,3);
        //When
        let result:boolean = position1.equals(position2);
        //Then
        expect(result).toBe(true);
    });
    it('equals_notEqual', () => {
        //Given
        let position1:Position = new Position(2,3);
        let position2:Position = new Position(3,3);
        //When
        let result:boolean = position1.equals(position2);
        //Then
        expect(result).toBe(false);
    });
    it('equals_float_Equal', () => {
        //Given
        let position1:Position = new Position(2.5,3);
        let position2:Position = new Position(2.5,3);
        //When
        let result:boolean = position1.equals(position2);
        //Then
        expect(result).toBe(true);
    });
    it('translate_none', () => {
        //Given
        let position:Position = new Position(0,0);
        //When
        position.translate(0,0);
        //Then
        expect(position.x).toBeCloseTo(0);
        expect(position.y).toBeCloseTo(0);
    });
    it('translate_up', () => {
        //Given
        let position:Position = new Position(0,0);
        //When
        position.translate(90,1);
        //Then
        expect(position.x).toBeCloseTo(0);
        expect(position.y).toBeCloseTo(1);
    });
    it('translate_down_negative_angle', () => {
        //Given
        let position:Position = new Position(0,0);
        //When
        position.translate(-90,1);
        //Then
        expect(position.x).toBeCloseTo(0);
        expect(position.y).toBeCloseTo(-1);
    });
    it('translate_down_negative_angle', () => {
        //Given
        let position:Position = new Position(0,0);
        //When
        position.translate(270,1);
        //Then
        expect(position.x).toBeCloseTo(0);
        expect(position.y).toBeCloseTo(-1);
    });
    it('translate_left', () => {
        //Given
        let position:Position = new Position(0,0);
        //When
        position.translate(180,1);
        //Then
        expect(position.x).toBeCloseTo(-1);
        expect(position.y).toBeCloseTo(0);
    });
    it('translate_right', () => {
        //Given
        let position:Position = new Position(0,0);
        //When
        position.translate(0,1);
        //Then
        expect(position.x).toBeCloseTo(1);
        expect(position.y).toBeCloseTo(0);
    });
    it('translate_customXY_equals_1', () => {
        //Given
        let position:Position = new Position(0,0);
        //When
        position.translate(45,1);
        //Then
        expect(position.x).toBeCloseTo(0.707);
        expect(position.y).toBeCloseTo(0.707);
    });
    it('translate_customXY_equals_2', () => {
        //Given
        let position:Position = new Position(0,0);
        //When
        position.translate(225,1);
        //Then
        expect(position.x).toBeCloseTo(-0.707);
        expect(position.y).toBeCloseTo(-0.707);
    });
    it('translate_customXY_equals_3', () => {
        //Given
        let position:Position = new Position(0,0);
        //When
        position.translate(135,1);
        //Then
        expect(position.x).toBeCloseTo(-0.707);
        expect(position.y).toBeCloseTo(0.707);
    });
    it('translate_customXY_equals_4', () => {
        //Given
        let position:Position = new Position(0,0);
        //When
        position.translate(315,1);
        //Then
        expect(position.x).toBeCloseTo(0.707);
        expect(position.y).toBeCloseTo(-0.707);
    });
    it('distance_zero', () => {
        //Given
        let position1:Position = new Position(0,0);
        let position2:Position = new Position(0,0);
        //When
        let result:number = Position.distance(position1,position2);
        //Then
        expect(result).toBeCloseTo(0);
    });
    it('distance_x', () => {
        //Given
        let position1:Position = new Position(0,0);
        let position2:Position = new Position(1,0);
        //When
        let result:number = Position.distance(position1,position2);
        //Then
        expect(result).toBeCloseTo(1);
    });
    it('distance_y', () => {
        //Given
        let position1:Position = new Position(0,0);
        let position2:Position = new Position(0,1);
        //When
        let result:number = Position.distance(position1,position2);
        //Then
        expect(result).toBeCloseTo(1);
    });
    it('distance_xy', () => {
        //Given
        let position1:Position = new Position(0,0);
        let position2:Position = new Position(1,1);
        //When
        let result:number = Position.distance(position1,position2);
        //Then
        expect(result).toBeCloseTo(Math.sqrt(2));
    });
    it('distance_xy_first', () => {
        //Given
        let position1:Position = new Position(1,1);
        let position2:Position = new Position(0,0);
        //When
        let result:number = Position.distance(position1,position2);
        //Then
        expect(result).toBeCloseTo(Math.sqrt(2));
    });
    it('distance_xy_negative', () => {
        //Given
        let position1:Position = new Position(0,0);
        let position2:Position = new Position(-1,-1);
        //When
        let result:number = Position.distance(position1,position2);
        //Then
        expect(result).toBeCloseTo(Math.sqrt(2));
    });
    it('distance_xy_first_negative', () => {
        //Given
        let position1:Position = new Position(-1,-1);
        let position2:Position = new Position(0,0);
        //When
        let result:number = Position.distance(position1,position2);
        //Then
        expect(result).toBeCloseTo(Math.sqrt(2));
    });
    it('distance_xy_two_negative', () => {
        //Given
        let position1:Position = new Position(-1,-1);
        let position2:Position = new Position(-2,-2);
        //When
        let result:number = Position.distance(position1,position2);
        //Then
        expect(result).toBeCloseTo(Math.sqrt(2));
    });
});