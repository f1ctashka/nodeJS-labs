import { mapResponse } from './map-response.util';
import { ContentType } from '../enums/content-type.enum';

describe('mapResponse', () => {
  it('should be defined', () => {
    expect(mapResponse).toBeDefined();
    expect(mapResponse).toBeInstanceOf(Function);
  });

  describe('mapping primitives', () => {
    it('should map numbers to strings with content-type plain', async () => {
      expect(mapResponse(15)).toEqual([ContentType.PlainText, '15']);
      expect(mapResponse(3.14)).toEqual([ContentType.PlainText, '3.14']);
    });

    it('should map strings to strings with content-type plain', () => {
      expect(mapResponse('')).toEqual([ContentType.PlainText, '']);
      expect(mapResponse('hello')).toEqual([ContentType.PlainText, 'hello']);
    });

    describe('should map objects to JSONs with content-type application/json', () => {
      const body = {
        hello: 'world',
      };

      expect(mapResponse(body)).toEqual([
        ContentType.JSON,
        JSON.stringify(body, null, 2),
      ]);
    });
  });
});
