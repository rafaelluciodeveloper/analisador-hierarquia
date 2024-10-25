import { Hierarchy } from "../type";

export const exportHierarchy = async (hierarchy: Hierarchy) => {
  const blob = new Blob([JSON.stringify(hierarchy, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'hierarchy.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
