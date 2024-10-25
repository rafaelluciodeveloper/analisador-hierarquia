import React from 'react';
import { exportHierarchy } from '../utils/exportJson';

const SaveButton: React.FC<{ hierarchy: object }> = ({ hierarchy }) => (
  <button onClick={() => exportHierarchy(hierarchy)}>Salvar Hierarquia</button>
);

export default SaveButton;
