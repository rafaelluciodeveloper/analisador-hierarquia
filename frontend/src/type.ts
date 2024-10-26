export interface Hierarchy {
    [key: string]: HierarchyLevel | string[];
}

export interface HierarchyLevel {
    [key: string]: HierarchyLevel | string[];
}
  