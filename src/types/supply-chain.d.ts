declare namespace SupplyChain {
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
    outputProductDefinition: ProductManagement.Product;
    outputProductDefinitionId: string;
  };

  export type NodeParams = {
    roleId: string;
    fromRoleId: string | null;
    outputProductDefinitionId: string;
    position: NodePosition;
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
}
