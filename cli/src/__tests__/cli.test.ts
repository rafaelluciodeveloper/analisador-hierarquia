import {main} from '../cli';
import {loadHierarchy} from '../utils/loadHierarchy';
import {analyzePhraseStream} from '../utils/analyzePhrase';

jest.mock('../utils/loadHierarchy');
jest.mock('../utils/analyzePhrase');

describe('CLI Script Tests', () => {
    let consoleOutput: string[] = [];
    const originalArgv = process.argv;
    const originalConsoleLog = console.log;
    const originalConsoleTable = console.table;
    const originalConsoleError = console.error;

    beforeEach(() => {
        consoleOutput = [];
        console.log = jest.fn((...args) => {
            consoleOutput.push(args.join(' '));
        });
        console.table = jest.fn((data) => {
            consoleOutput.push(JSON.stringify(data));
        });
        console.error = jest.fn((...args) => {
            consoleOutput.push(args.join(' '));
        });
        process.argv = [...originalArgv.slice(0, 2)];
    });

    afterEach(() => {
        console.log = originalConsoleLog;
        console.table = originalConsoleTable;
        console.error = originalConsoleError;
        process.argv = originalArgv;
        jest.clearAllMocks();
    });

    test('processa a frase e exibe o resultado corretamente com depth fornecido', async () => {
        (loadHierarchy as jest.Mock).mockReturnValue({
            Natureza: {
                Animais: {
                    Aves: {
                        Pássaros: ["Papagaio", "Canário"]
                    }
                }
            }
        });

        (analyzePhraseStream as jest.Mock).mockResolvedValue({
            'Pássaros': 3,
        });

        process.argv.push('"Papagaio Papagaio Papagaio"');
        process.argv.push('--depth');
        process.argv.push('4');

        await main();

        expect(loadHierarchy).toHaveBeenCalled();
        expect(analyzePhraseStream).toHaveBeenCalledWith(
            expect.any(Object),
            expect.anything(),
            4
        );

        expect(consoleOutput).toContain(JSON.stringify({'Pássaros': 3}));
    });


    test('exibe informações detalhadas quando --verbose é fornecido', async () => {
        (loadHierarchy as jest.Mock).mockReturnValue({});
        (analyzePhraseStream as jest.Mock).mockResolvedValue({});

        process.argv.push('"Teste de frase"');
        process.argv.push('--depth');
        process.argv.push('2');
        process.argv.push('--verbose');

        await main();

        expect(consoleOutput).toEqual(
            expect.arrayContaining([
                expect.stringContaining('Tempo de carregamento dos parâmetros'),
                expect.stringContaining('Tempo de verificação da frase'),
            ])
        );
    });

    test('lança erro quando --depth não é fornecido mas é obrigatório', async () => {
        (loadHierarchy as jest.Mock).mockReturnValue({});
        (analyzePhraseStream as jest.Mock).mockResolvedValue({});

        process.argv.push('"Papagaio Papagaio Papagaio"');

        await expect(main()).rejects.toThrow('Erro: Argumento --depth é obrigatório e deve ser um número.');

        expect(consoleOutput).toContain('Erro: Argumento --depth é obrigatório e deve ser um número.');
    });

    test('lança erro quando --depth não é um número', async () => {
        (loadHierarchy as jest.Mock).mockReturnValue({});
        (analyzePhraseStream as jest.Mock).mockResolvedValue({});

        process.argv.push('"Papagaio Papagaio Papagaio"');
        process.argv.push('--depth');
        process.argv.push('abc');

        await expect(main()).rejects.toThrow('Erro: Argumento --depth é obrigatório e deve ser um número.');

        expect(consoleOutput).toContain('Erro: Argumento --depth é obrigatório e deve ser um número.');
    });
});
