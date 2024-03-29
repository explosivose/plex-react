import logdown from "logdown";
import { ComponentType } from "react";
import { LayoutComponent } from "./layoutComponent.enum";

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

export const isComponentRegistered = <K extends string = string>(componentName: K): boolean => {
  return register[componentName] !== undefined;
}

export const getComponentFromRegister = <C extends ComponentType = ComponentType<unknown>, K extends string = string>(
  componentName: K
): RegisteredComponent<C, K> => {
  if (register[componentName] === undefined) {
    throw new Error(`Could not find component ${componentName} in register.`);
  }
  return register[componentName] as RegisteredComponent<C, K>;
};

export const getRegisteredNames = (): string[] => {
  return Object.keys(register);
}

export const getUserRegisteredNames = (): string[] => {
  return getRegisteredNames().filter(name =>
    name !== LayoutComponent.Frame &&
    name !== LayoutComponent.ResizableSplit);
}
