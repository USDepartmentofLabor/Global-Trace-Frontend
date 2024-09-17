declare namespace SupplyChain {
  import { ExpressionTypeEnum } from 'enums/app';

  export interface SupplyChainMapping {
    nodes: Node[];
    lines: Line[];
  }

  export type Node = {
    id: string;
    roleId: string;
    fromRoleId: string;
    label?: string;
    position: NodePosition;
    role: RoleAndPermission.Role;
    calculateField: Calculator;
    outputProductDefinition: ProductManagement.Product;
    outputProductDefinitionId: string;
  };

  export type NodeParams = {
    roleId: string;
    fromRoleId: string | null;
    outputProductDefinitionId: string;
    position: NodePosition;
    calculateField: Calculator;
  };

  export type NodePosition = {
    top: number;
    left: number;
  };

  export type Line = {
    fromNodeId: string;
    hasBrokerIcon: boolean;
    toNodeId: string;
  };

  export type Calculator = {
    outputAttributeId: string;
    expressionItems: ExpressionItem[];
  };

  export type ExpressionItem = {
    value: string | number;
    type: ExpressionTypeEnum;
  };

  export type ValidateCalculatorParams = {
    expressionItems: ExpressionItem[];
    outputAttributeId: string;
    outputProductDefinitionId: string;
    inputProductDefinitionId: string;
  };

  export type SupplyChainTierParams = {
    doesAddBrand?: boolean;
  };

  export type SupplyChainTier = {
    id: string;
    name: string;
    x?: number;
  };
}
