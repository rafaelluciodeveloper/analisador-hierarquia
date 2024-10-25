import React, { useState } from 'react';
import HierarchyEditor from './components/HierarchyEditor';
import SaveButton from './components/SaveButton';
import { HierarchyNode } from './types';

const App: React.FC = () => {
  const [hierarchy, setHierarchy] = useState<HierarchyNode[]>([]);

  // Função para atualizar a hierarquia a partir do componente HierarchyEditor
  const updateHierarchy = (newHierarchy: HierarchyNode[]) => {
    setHierarchy(newHierarchy);
  };

  return (
    <div>
      <h2>Editor de Hierarquia de Palavras</h2>
      <HierarchyEditor hierarchy={hierarchy} onHierarchyChange={updateHierarchy} />
      <SaveButton hierarchy={hierarchy} />
    </div>
  );
};

export default App;
