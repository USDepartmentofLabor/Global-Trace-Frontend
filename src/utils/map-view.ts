export default class MapView {
  public mapWidth: number;
  public blockWidth: number;
  public blockHeight: number;
  public columnSpace: number;
  public rowSpace: number;

  constructor(options: App.MapViewConstant) {
    this.mapWidth = options.WIDTH;
    this.blockWidth = options.BLOCK_WIDTH;
    this.blockHeight = options.BLOCK_HEIGHT;
    this.columnSpace = options.COLUMN_SPACE;
    this.rowSpace = options.ROW_SPACE;
  }

  getBlockX(columnNumber: number): number {
    return (this.blockWidth + this.columnSpace) * (columnNumber - 1);
  }

  getBlockY(rowNumber: number): number {
    return (this.blockHeight + this.rowSpace) * rowNumber;
  }

  isSameColumn(
    sourceBlock: MapView.Block,
    targetBlock: MapView.Block,
  ): boolean {
    return sourceBlock.x === targetBlock.x;
  }

  isBeforeColumn(
    sourceBlock: MapView.Block,
    targetBlock: MapView.Block,
  ): boolean {
    return sourceBlock.x > targetBlock.x;
  }

  sameColumnLine(
    sourceBlock: MapView.Block,
    targetBlock: MapView.Block,
  ): MapView.Line {
    return {
      startX: sourceBlock.x + this.blockWidth / 2,
      startY: sourceBlock.y + this.blockHeight,
      endX: targetBlock.x + this.blockWidth / 2,
      endY: targetBlock.y,
    };
  }

  beforeColumnLine(
    sourceBlock: MapView.Block,
    targetBlock: MapView.Block,
  ): MapView.Line {
    return {
      startX: targetBlock.x + this.blockWidth,
      startY: targetBlock.y + this.blockHeight / 2,
      endX: sourceBlock.x,
      endY: sourceBlock.y + this.blockHeight / 2,
    };
  }

  afterColumnLine(
    sourceBlock: MapView.Block,
    targetBlock: MapView.Block,
  ): MapView.Line {
    return {
      startX: sourceBlock.x + this.blockWidth,
      startY: sourceBlock.y + this.blockHeight / 2,
      endX: targetBlock.x,
      endY: targetBlock.y + this.blockHeight / 2,
    };
  }

  getConnectorPosition = (
    sourceBlock: MapView.Block,
    targetBlock: MapView.Block,
  ): MapView.Line => {
    if (this.isSameColumn(sourceBlock, targetBlock)) {
      return this.sameColumnLine(sourceBlock, targetBlock);
    } else if (this.isBeforeColumn(sourceBlock, targetBlock)) {
      return this.beforeColumnLine(sourceBlock, targetBlock);
    }
    return this.afterColumnLine(sourceBlock, targetBlock);
  };
}
