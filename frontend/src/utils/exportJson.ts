import { saveAs } from 'file-saver';

export function exportHierarchy(hierarchy: object) {
  const blob = new Blob([JSON.stringify(hierarchy, null, 2)], { type: 'application/json' });
  saveAs(blob, 'hierarchy.json');
}
