declare namespace App {
  import { VueConstructor } from 'vue';
  import { SortType } from 'enums/app';
  import { PermissionActionEnum } from 'enums/role';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Any = any;

  export type RouteContext = {
    to: Route;
    from: Route;
    next: NavigationGuardNext;
    user: Auth.User;
    permissions: PermissionActionEnum[];
    role: RoleAndPermission.Role;
    facilityTypes: Auth.FacilityType[];
    isLoggedIn: boolean;
  };

  export type Callback = {
    onSuccess?: (...args) => void;
    onFailure?: (...args) => void;
    onFinish?: (...args) => void;
  };

  export type ResponseError = {
    message: string;
    errors: Record<string, Record<string, ErrorValue>>;
    status?: number;
  };

  export type MessageError = ResponseError['errors'];

  export type DataTableColumn = {
    label: string;
    field?: string;
    width?: string;
    sortable?: boolean;
    sortKey?: string;
  };

  export type DataTablePagination = {
    total: number;
    lastPage: number;
    perPage: number;
    currentPage: number;
  };

  export type DataTablePaginationItem = {
    index?: number;
    content?: number;
    selected?: boolean;
    disabled?: boolean;
    breakView?: boolean;
  };

  export interface DataTablePaginationDictionary {
    [key: number | string]: DataTablePaginationItem;
  }

  export type SortInfo = {
    sort: SortType;
    sortKey: string;
  };

  export type BaseDropdownOption = {
    id: string;
    name: string;
    icon?: string;
  };

  export type DropdownValue = {
    label: string;
    value: string;
  };

  export type CheckboxGroup = {
    label: string;
    value: string;
    disabled?: boolean;
    isOther?: boolean;
    placeholder?: string;
  };

  export type CheckboxGroupProps = Record<string, string | boolean | string[]>;

  export type HtmlStyle = {
    [key: string]: string | number;
  };

  export type Menu = {
    icon: string;
    label: string;
    params?: MenuParams;
    name: string;
    active: string[];
    isActive?: boolean;
  };

  export type MenuParams = {
    [x: string]: string;
  };

  export type InputProps = Record<string, string | number>;

  export type Tab = {
    title: string;
    name?: string;
    icon?: string;
    level?: string;
    component: VueConstructor;
  };

  export type DropdownOption = {
    id?: string | number;
    name?: string;
    value?: string;
    tier?: string;
    icon?: string;
  };

  export type SelectedFile = {
    id: string;
    name: string;
    file: File;
    size: number;
    type: string;
    isError?: boolean;
    message?: string;
  };

  export type Radio = {
    label: string;
    value: string | boolean;
  };

  export type Pagination = {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
  };

  export type PaginationRange = {
    selectedRangeLow: number;
    selectedRangeHigh: number;
  };

  export type TableRow = BrandProduct.Order | Auth.User;

  export type ElementRef = {
    $el: HTMLElement;
    $children: VueConstructor[];
  };

  export type Navigation = {
    label: string;
    link: string;
    activeNames?: string[];
  };

  export type RequestParams = {
    key?: string;
    page?: number;
    perPage?: number;
    sortFields?: string;
    sortField?: string;
    sortDirection?: string;
  };

  export type validateProductParams = {
    productId: string;
    productSupplierId: string;
  };

  export type PageChange = {
    page: number;
    perPage: number;
  };

  export type DropdownMenuOption = {
    id: string;
    name: string;
    icon?: string;
    descriptions?: string[];
    variant?: string;
  };

  export type ListItem<T> = {
    currentPage: number;
    items: T[];
    lastPage: number;
    perPage: number;
    total: number;
  };

  export type Tag = {
    icon?: string;
    title: string;
    subTitle?: string;
  };

  export type DonutData = {
    value: number;
    color: string;
  };

  export type PieData = {
    value: number;
    color: string;
    label?: string;
  };

  export type MapViewConstant = {
    WIDTH: number;
    BLOCK_WIDTH: number;
    BLOCK_HEIGHT: number;
    COLUMN_SPACE: number;
    ROW_SPACE: number;
  };

  export interface RangeDate {
    from: number;
    to: number;
  }

  export type RangeDateOptions = {
    amount: moment.DurationInputArg1;
    unit: moment.unitOfTime.DurationConstructor;
  };

  export type UploadFileConfigType = {
    MAX_SIZE: number;
    ACCEPTED: string;
    EXTENSIONS: string;
  };

  export type PDFPreviewParams = {
    token: string;
  };

  export type searchKey = {
    key: string;
  };

  export type UploadFiles = {
    files: File[];
  };

  export type UploadFilesResponse = {
    blobName: string;
    fileName: string;
    url: string;
  };

  export type FileResponse = {
    blobName: string;
    fileName: string;
    link: string;
  };

  export type Map = {
    nodes: MapNode[];
    lines: Array<string[]>;
  };

  export type MapNode = {
    id: string;
    label: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    isRoot?: boolean;
    isTier?: boolean;
    isExpanded?: boolean;
    parentsTotal?: number;
    childrensTotal?: number;
  };

  export type MapNodeParams = {
    height: number;
    isExpand: boolean;
  };

  export type MapEdge = {
    id: string;
    from: string;
    to: string;
  };

  export type SelectPanel = {
    id: string;
    label: string;
    image: string;
    checked?: boolean;
  };

  export type LanguageOption = {
    label?: string;
    icon?: string;
    code?: string;
  };

  export type TooltipOptions = {
    content: string;
    placement: string;
    classes: string;
    container: string | boolean;
  };
}
