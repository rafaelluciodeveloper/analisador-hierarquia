import { loadHierarchy } from '../utils/loadHierarchy';
import * as fs from 'fs';
import path from 'path';

jest.mock('fs');

describe('loadHierarchy', () => {
  const hierarchyMock = {
    Natureza: {
      Animais: {
        Mamíferos: {
          Carnívoros: ["Leões", "Tigres"],
          Herbívoros: ["Elefantes", "Girafas"]
        }
      }
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve carregar a hierarquia JSON corretamente', () => {
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(hierarchyMock));

    const result = loadHierarchy();

    expect(result).toEqual(hierarchyMock);
    expect(fs.readFileSync).toHaveBeenCalledWith(path.resolve(__dirname, '../../dicts/hierarchy.json'), 'utf-8');
  });

  it('deve lançar um erro se o arquivo não puder ser carregado', () => {
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Arquivo não encontrado');
    });

    expect(() => loadHierarchy()).toThrow('Arquivo não encontrado');
  });
});
