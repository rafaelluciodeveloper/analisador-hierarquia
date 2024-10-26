import * as fs from 'fs';
import path from 'path';
import { loadHierarchy } from '../utils/loadHierarchy';

jest.mock('fs');

describe('loadHierarchy', () => {
    const mockFilePath = path.resolve(__dirname, '../../dicts/hierarchy.json');
    const mockData = {
        Natureza: {
            Animais: {
                Aves: {
                    Pássaros: ["Papagaio", "Canário"]
                }
            }
        }
    };

    beforeEach(() => {
        // Simula o comportamento de fs.readFileSync para retornar o JSON fictício
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('deve carregar e retornar a hierarquia corretamente', () => {
        const result = loadHierarchy();

        expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf-8');
        expect(result).toEqual(mockData);
    });

    test('deve lançar um erro se o arquivo não for encontrado', () => {
        // Simula o comportamento de fs.readFileSync para lançar um erro
        (fs.readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('File not found');
        });

        expect(() => loadHierarchy()).toThrow('File not found');
    });
});