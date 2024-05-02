declare namespace Dropdown {
  export type WatchOption = {
    immediate?: boolean;
    user?: boolean;
  };

  export type Child = {
    $watch: (
      property: string,
      callback: (isOpen?: boolean) => void,
      options?: WatchOption,
    ) => void;
    maxHeight?: number;
    optionHeight?: number;
  };

  export type Node = {
    child?: Child;
  };
}
