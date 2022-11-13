import { normalizePath } from './normalize-path.util';

describe('normalizePath', () => {
  it('should be defined', () => {
    expect(normalizePath).toBeDefined();
    expect(normalizePath).toBeInstanceOf(Function);
  });

  describe('removing slashes', () => {
    it('should replace multiple slashes with one', () => {
      expect(normalizePath('/')).toEqual('/');
      expect(normalizePath('//')).toEqual('/');
      expect(normalizePath('/hello///world')).toEqual('/hello/world');
      expect(normalizePath('/hello//hello//hello')).toEqual(
        '/hello/hello/hello'
      );
    });

    it('should remove trailing slash(-es)', () => {
      expect(normalizePath('/hello/')).toEqual('/hello');
      expect(normalizePath('/hello///')).toEqual('/hello');
    });
  });

  describe('adding slashes', () => {
    it('should return a slash when passing an empty string', () => {
      expect(normalizePath('')).toEqual('/');
    });

    it('should add a slash to the start', () => {
      expect(normalizePath('hello')).toEqual('/hello');
    });
  });
});
