import * as fs from 'fs';
import path from 'path';

export function loadHierarchy() {
    const filePath = path.resolve(__dirname, '../../dicts/hierarchy.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}
