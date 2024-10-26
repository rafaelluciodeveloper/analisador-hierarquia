import * as React from 'react';
import {Hierarchy} from '../type';

interface HierarchyEditorProps {
    hierarchy: Hierarchy;
    onHierarchyChange: (newHierarchy: Hierarchy) => void;
}

const HierarchyEditor: React.FC<HierarchyEditorProps> = ({hierarchy, onHierarchyChange}) => {
    const [newNodeName, setNewNodeName] = React.useState('');
    const [parentPath, setParentPath] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');

    const addNodeOrLeaf = () => {
        if (!newNodeName.trim()) {
            setError('O nome do novo nível não pode estar vazio.');
            return;
        }

        if (isDuplicateName(hierarchy, parentPath, newNodeName.trim())) {
            setError('Já existe um nível com esse nome na hierarquia.');
            return;
        }

        const updatedHierarchy: Hierarchy = JSON.parse(JSON.stringify(hierarchy));
        if (parentPath === '') {
            updatedHierarchy[newNodeName.trim()] = {};
        } else {
            const parentNode = findNodeByPath(updatedHierarchy, parentPath);
            if (parentNode && !Array.isArray(parentNode)) {
                parentNode[newNodeName.trim()] = {};
            } else {
                setError('Não é possível adicionar um nível a uma folha existente.');
                return;
            }
        }

        onHierarchyChange(updatedHierarchy);
        setNewNodeName('');
        setParentPath('');
        setError('');
    };

    const addLeaf = () => {
        if (!newNodeName.trim()) {
            setError('O nome da palavra não pode estar vazio.');
            return;
        }

        const updatedHierarchy: Hierarchy = JSON.parse(JSON.stringify(hierarchy));
        if (parentPath === '') {
            setError('Selecione um nó pai para adicionar uma palavra.');
            return;
        }

        const parentNode = findNodeByPath(updatedHierarchy, parentPath);
        if (parentNode) {
            if (Array.isArray(parentNode)) {
                if (!parentNode.includes(newNodeName.trim())) {
                    parentNode.push(newNodeName.trim());
                } else {
                    setError('A palavra já existe na folha selecionada.');
                    return;
                }
            } else {
                const keys = Object.keys(parentNode);
                if (keys.length === 0) {
                    const parts = parentPath.split(' > ');
                    let current: Hierarchy | string[] = updatedHierarchy;
                    for (let i = 0; i < parts.length - 1; i++) {
                        current = current[parts[i]] as Hierarchy;
                    }
                    const lastPart = parts[parts.length - 1];
                    current[lastPart] = [newNodeName.trim()];
                } else {
                    setError('Este nó já possui subcategorias e não pode receber palavras.');
                    return;
                }
            }
        }

        onHierarchyChange(updatedHierarchy);
        setNewNodeName('');
        setParentPath('');
        setError('');
    };

    const findNodeByPath = (nodes: Hierarchy, path: string): Hierarchy | string[] | null => {
        const parts = path.split(' > ');
        let current: Hierarchy | string[] = nodes;

        for (const part of parts) {
            if (Array.isArray(current)) {
                return null;
            }
            if (current[part]) {
                current = current[part];
            } else {
                return null;
            }
        }

        return current;
    };

    const generatePaths = (nodes: Hierarchy, currentPath: string = ''): string[] => {
        let paths: string[] = [];
        Object.keys(nodes).forEach(key => {
            const newPath = currentPath ? `${currentPath} > ${key}` : key;
            paths.push(newPath);
            if (typeof nodes[key] === 'object' && !Array.isArray(nodes[key])) {
                paths = paths.concat(generatePaths(nodes[key] as Hierarchy, newPath));
            }
        });
        return paths;
    };

    const isDuplicateName = (nodes: Hierarchy, path: string, name: string): boolean => {
        const parentNode = findNodeByPath(nodes, path);
        if (!parentNode || Array.isArray(parentNode)) return false;
        return Object.keys(parentNode).some(existingName => {
            if (typeof existingName === 'string' && typeof name === 'string') {
                return existingName.toLowerCase() === name.toLowerCase();
            }
            return false;
        });
    };

    const renderHierarchy = (nodes: Hierarchy | string[]) => {
        if (Array.isArray(nodes)) {
            return (
                <ul className="list-group">
                    {nodes.map((item, index) => (
                        typeof item === 'string' ? (
                            <li key={`${item}-${index}`} className="list-group-item">
                                {item}
                            </li>
                        ) : null
                    ))}
                </ul>
            );
        } else {
            return (
                <ul className="list-group">
                    {Object.keys(nodes).map((key, index) => (
                        typeof key === 'string' && (
                            <li key={`${key}-${index}`} className="list-group-item">
                                {key}
                                {nodes[key] && typeof nodes[key] === 'object' && !Array.isArray(nodes[key]) && (
                                    <div className="ms-3 mt-2">
                                        {renderHierarchy(nodes[key] as Hierarchy)}
                                    </div>
                                )}
                                {Array.isArray(nodes[key]) && (
                                    <div className="ms-3 mt-2">
                                        {renderHierarchy(nodes[key] as string[])}
                                    </div>
                                )}
                            </li>
                        )
                    ))}
                </ul>
            );
        }
    };

    const resetHierarchy = () => {
        onHierarchyChange({});
        setNewNodeName('');
        setParentPath('');
        setError('');
    };

    return (
        <div className="card p-4">
            <h3 className="mb-3">Editor de Hierarquia</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <label htmlFor="parentSelect" className="form-label">Selecionar Pai</label>
                <select
                    id="parentSelect"
                    className="form-select"
                    value={parentPath}
                    onChange={(e) => setParentPath(e.target.value)}
                >
                    <option value="">Nenhum (Nível Raiz)</option>
                    {generatePaths(hierarchy).map((path, idx) => (
                        <option key={`${path}-${idx}`} value={path}>
                            {path}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="nodeName" className="form-label">Nome do Novo Nível / Palavra</label>
                <input
                    type="text"
                    id="nodeName"
                    className="form-control"
                    placeholder="Digite o nome do novo nível ou palavra"
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                />
            </div>

            <div className="d-flex gap-2 mb-4">
                <button className="btn btn-primary w-50" onClick={addNodeOrLeaf}>Adicionar Nível</button>
                <button className="btn btn-primary w-50" onClick={addLeaf}>Adicionar Palavra</button>
            </div>

            <button className="btn btn-danger w-100 mt-2" onClick={resetHierarchy}>
                Resetar Hierarquia
            </button>

            <h4 className="mt-4">Hierarquia Atual:</h4>
            {Object.keys(hierarchy).length > 0 ? (
                <div className="mt-2">
                    {renderHierarchy(hierarchy)}
                </div>
            ) : (
                <p className="text-muted">Nenhuma hierarquia adicionada.</p>
            )}
        </div>
    );
};

export default HierarchyEditor;
