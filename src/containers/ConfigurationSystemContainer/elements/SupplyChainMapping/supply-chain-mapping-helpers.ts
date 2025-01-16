import { find, findIndex } from 'lodash';

export const getTooltipOptions = (content: string): App.TooltipOptions => ({
  content: content,
  placement: 'top',
  classes: 'icon-tooltip',
  container: false,
});

export const updateSupplyChainMappingNodes = (
  node: App.MapNode,
  supplyChainNodes: SupplyChain.Node[],
): void => {
  const nodeIndex = findIndex(supplyChainNodes, ({ id }) => id === node.id);
  if (nodeIndex > -1) {
    const { role } = find(supplyChainNodes, ({ id }) => id === node.id);
    supplyChainNodes[nodeIndex].position.top = node.y;
    supplyChainNodes[nodeIndex].position.left = node.x;
    supplyChainNodes[nodeIndex].role = role;
  }
};
