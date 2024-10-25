import * as React from 'react';
import HierarchyEditor from './components/HierarchyEditor';
import SaveButton from './components/SaveButton';
import { Hierarchy } from './type';
import { useState } from 'react';

const App: React.FC = () => {
  const [hierarchy, setHierarchy] = useState<Hierarchy>({});

  const updateHierarchy = (newHierarchy: Hierarchy) => {
    setHierarchy(newHierarchy);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Editor de Hierarquia de Palavras</h2>
      <div className="row">
        <div className="col-md-8">
          <HierarchyEditor hierarchy={hierarchy} onHierarchyChange={updateHierarchy} />
        </div>
        <div className="col-md-4 d-flex align-items-start">
          <SaveButton hierarchy={hierarchy} />
        </div>
      </div>
    </div>
  );
};

export default App;
