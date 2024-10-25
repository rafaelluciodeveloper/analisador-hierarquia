import * as React from 'react';
import { exportHierarchy } from '../utils/exportJson';
import { Hierarchy } from '../type';

interface SaveButtonProps {
  hierarchy: Hierarchy;
}

const SaveButton: React.FC<SaveButtonProps> = ({ hierarchy }) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState<boolean | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await exportHierarchy(hierarchy);
      setSaveSuccess(true);
    } catch (error) {
      console.error(error);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center w-100">
      <button
        className="btn btn-success w-100"
        onClick={handleSave}
        disabled={isSaving || Object.keys(hierarchy).length === 0}
      >
        {isSaving ? 'Salvando...' : 'Salvar Hierarquia'}
      </button>
      {saveSuccess === true && (
        <div className="alert alert-success mt-3 w-100 text-center" role="alert">
          Hierarquia salva com sucesso!
        </div>
      )}
      {saveSuccess === false && (
        <div className="alert alert-danger mt-3 w-100 text-center" role="alert">
          Falha ao salvar a hierarquia.
        </div>
      )}
    </div>
  );
};

export default SaveButton;
