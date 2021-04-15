import logdown from "logdown";
import { ComponentType } from "react";

const logger = logdown('layout/registry');

interface RegisteredComponent<K extends string, P = unknown> {
  componentName: K;
  Component: ComponentType<P>;
}

type Register<K extends string = string> = Record<K, RegisteredComponent<K>>;

const register: Register = {};

export const registerComponent = <K extends string>(Component: ComponentType<unknown>, componentName: K): void => {
  if (register[componentName]) {
    logger.warn('Overwriting component in layout registry for ', componentName);
  }
  register[componentName] = {
    componentName,
    Component,
  }
}

export const getComponentFromRegister = <T, K extends string = string>(componentName: K): RegisteredComponent<K, T> => {
  if (register[componentName] === undefined) {
    throw new Error(`Could not find component ${componentName} in register.`);
  }
  return register[componentName] as RegisteredComponent<K, T>;
}
