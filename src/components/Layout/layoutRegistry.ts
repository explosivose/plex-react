import logdown from "logdown";
import { ComponentType } from "react";

const logger = logdown('layout/registry');

interface RegisteredComponent<C, K extends string = string> {
  componentName: K;
  Component: C;
}

type Register<C, K extends string = string> = Record<K, RegisteredComponent<C, K>>;

const register: Register<unknown> = {};

export const registerComponent = <C, K extends string = string>(Component: C, componentName: K): void => {
  if (register[componentName]) {
    logger.warn('Overwriting component in layout registry for ', componentName);
  }
  register[componentName] = {
    componentName,
    Component,
  };
}

export const getComponentFromRegister = <C extends ComponentType = ComponentType<unknown>, K extends string = string>(
  componentName: K
): RegisteredComponent<C, K> => {
  if (register[componentName] === undefined) {
    throw new Error(`Could not find component ${componentName} in register.`);
  }
  return register[componentName] as RegisteredComponent<C, K>;
}
