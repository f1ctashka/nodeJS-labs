import {
  IS_CONTROLLER_METADATA,
  CONTROLLER_PREFIX_METADATA,
} from '../constants';
import { normalizePath } from '../utils/normalize-path.util';

export function Controller(): ClassDecorator;
export function Controller(prefix: string): ClassDecorator;
export function Controller(prefix = '/'): ClassDecorator {
  const normalizedPrefix = normalizePath(prefix);

  return (target: object) => {
    Reflect.defineMetadata(IS_CONTROLLER_METADATA, true, target);
    Reflect.defineMetadata(
      CONTROLLER_PREFIX_METADATA,
      normalizedPrefix,
      target
    );
  };
}
