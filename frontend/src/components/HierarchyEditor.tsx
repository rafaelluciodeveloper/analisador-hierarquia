// frontend/src/components/HierarchyEditor.tsx
import React, { useState } from 'react';
import { HierarchyNode } from '../types';

interface HierarchyEditorProps {
  hierarchy: HierarchyNode[];
  onHierarchyChange: (newHierarchy: HierarchyNode[]) => void;
}

const HierarchyEditor: React.FC<HierarchyEditorProps> = ({ hierarchy, onHierarchyChange }) => {
  const [newNodeName, setNewNodeName] = useState('');
  const [parentIndex, setParentIndex] = useState<number | null>(null);

  const addLevel = () => {
    if (!newNodeName) return;

    // Adiciona um novo nó à hierarquia e passa para o App via onHierarchyChange
    const newNode: HierarchyNode = { name: newNodeName, children: [] };

    if (parentIndex === null) {
      onHierarchyChange([...hierarchy, newNode]);
    } else {
      const updatedHierarchy = [...hierarchy];
      updatedHierarchy[parentIndex].children = [...updatedHierarchy[parentIndex].children, newNode];
      onHierarchyChange(updatedHierarchy);
    }

    setNewNodeName('');
    setParentIndex(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewNodeName(e.target.value);
  };

  const renderHierarchy = (nodes: HierarchyNode[]) => (
    <ul>
      {nodes.map((node, index) => (
        <li key={`${node.name}-${index}`}>
          {node.name}
          {node.children.length > 0 && renderHierarchy(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h3>Editor de Hierarquia</h3>
      <input
        type="text"
        placeholder="Nome do novo nível"
        value={newNodeName}
        onChange={handleNameChange}
      />
      <button onClick={addLevel}>Adicionar Nível</button>
      
      <h4>Hierarquia Atual:</h4>
      {renderHierarchy(hierarchy)}
    </div>
  );
};

export default HierarchyEditor;
