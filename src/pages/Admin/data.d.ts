export interface TableListItem {
    _id?: string;
    username?: string;
    password?: string;
    avatar?: string;
    access?: string;
    email?: string;
  } 
  
  export interface TableListPagination {
    total: number;
    pageSize: number;
    current: number;
  }
  
  export interface TableListData {
    list: TableListItem[];
    pagination: Partial<TableListPagination>;
  }
  
  export interface TableListParams {
    updatedAt?: Date;
    _id?: string;
    username?: string;
    password?: string;
    avatar?: string;
    access?: string;
    email?: string;
    pageSize?: number;
    currentPage?: number;
    filter?: Record<string, ReactText[] | null>;
    sorter?: Record<string, any>;
  }