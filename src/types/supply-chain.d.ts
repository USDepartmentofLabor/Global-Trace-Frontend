declare namespace SupplyChain {
  import { ExpressionTypeEnum } from 'enums/app';

  export interface SupplyChainMapping {
    chainId: string;
    nodes: Node[];
    lines: Line[];
  }

  export type Node = {
    id: string;
    relation?: LineRelation;
    roleId: string;
    fromRoleId: string;
    label?: string;
    position: NodePosition;
    role: RoleAndPermission.Role;
    calculateFields: Calculator[];
    outputProductDefinitionIds: string[];
    supplyChainNodeMetadataId: string;
    hasBrokerIcon?: boolean;
  };

  export type SupplyChainNodesParams = {
    supplyChainNodes: NodeParams[];
  };

  export type NodeParams = {
    roleId: string;
    fromRoleId: string | null;
    outputProductDefinitionIds: string[];
    position: NodePosition;
    chainId: string;
  };

  export type UpdateNodeParams = {
    roleId: string;
    fromRoleId: string | null;
  };

  export type UpdateNodeMetadataParams = {
    outputProductDefinitionIds?: string[];
    position?: NodePosition;
  };

  export type NodePosition = {
    top: number;
    left: number;
  };

  export type MapPosition = {
    bottom: number;
    right: number;
  } & NodePosition;

  export type Line = {
    fromNodeId: string;
    hasBrokerIcon: boolean;
    toNodeId: string;
    relation?: LineRelation;
  };

  export type LineRelation = {
    id: string;
    outputProductDefinitionIds: string[];
  };

  export type ExpressionItem = {
    value: string | number;
    type: ExpressionTypeEnum;
    productDefinitionId: string;
  };

  export type Calculator = {
    id?: string;
    supplyChainNodeMetadataId: string;
    expressionItems: ExpressionItem[];
    outputAttributeId: string;
    outputProductDefinitionId: string;
    inputProductDefinitionIds: string[];
  };

  export type SupplyChainTierParams = {
    doesAddBrand?: boolean;
  };

  export type SupplyChainTier = {
    id: string;
    name: string;
    x?: number;
  };

  export type DownstreamSupplierListParams = {
    id: string;
    roleId: string;
    productOutputsIds: string[];
  };

  export type PreviewImpactParams = {
    chainId: string;
    nodeIds: string[];
  };

  export type PreviewImpactResponse = {
    deletedLineIds: string[];
    deletedNodeIds: string[];
    impactNodeIds: string[];
  };
}
