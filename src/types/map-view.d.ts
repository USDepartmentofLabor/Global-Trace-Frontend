declare namespace MapView {
  export type Block = {
    x: number;
    y: number;
    data?: T;
  };

  export type Connector = {
    id: string;
    isActive: boolean;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };

  export type Line = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
}
