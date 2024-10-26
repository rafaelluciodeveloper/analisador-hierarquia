import { loadHierarchy } from './utils/loadHierarchy';
import { analyzePhraseStream } from './utils/analyzePhrase';
import { Readable } from 'stream';

export async function main() {
    const args = process.argv.slice(2);
    const depthIndex = args.indexOf('--depth');

    if (depthIndex === -1 || isNaN(parseInt(args[depthIndex + 1], 10))) {
        console.error('Erro: Argumento --depth é obrigatório e deve ser um número.');
        process.exit(1);
    }

    const depth = parseInt(args[depthIndex + 1], 10);
    const verbose = args.includes('--verbose');

    const phrase = args.filter(arg => !arg.startsWith('--') && arg !== args[depthIndex + 1]).join(' ');

    if (!phrase) {
        console.error('Erro: Frase não foi fornecida.');
        process.exit(1);
    }

    const startTime = Date.now();

    const hierarchy = loadHierarchy();
    if (!hierarchy) {
        console.error('Erro ao carregar a hierarquia.');
        process.exit(1);
    }

    const phraseStream = Readable.from([phrase]);
    const loadTime = Date.now() - startTime;
    const startVerifyTime = Date.now();
    const result = await analyzePhraseStream(hierarchy, phraseStream, depth);
    const categories = initializeCategories(hierarchy, depth);

    for (const [category, count] of Object.entries(result)) {
        if (category in categories) {
            categories[category] += count;
        }
    }

    const filteredCategories = Object.entries(categories)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => `${key} = ${value}`)
        .join('; ');

    console.log(filteredCategories || '0');

    if (verbose) {
        const verifyTime = Date.now() - startVerifyTime;
        console.log(`Tempo de carregamento dos parâmetros: ${loadTime}ms`);
        console.log(`Tempo de verificação da frase: ${verifyTime}ms`);
    }
}

function initializeCategories(hierarchy: any, depth: number, currentDepth = 1): Record<string, number> {
    const categories: Record<string, number> = {};

    if (currentDepth > depth) return categories;

    for (const [key, value] of Object.entries(hierarchy)) {
        if (Array.isArray(value) && currentDepth === depth) {
            // Adiciona as categorias no nível especificado
            categories[key] = 0;
        } else if (typeof value === 'object' && value !== null) {
            // Continua buscando subcategorias
            const subcategories = initializeCategories(value, depth, currentDepth + 1);
            Object.assign(categories, subcategories);
        }
    }

    return categories;
}


if (require.main === module) {
    main().catch(error => {
        console.error('Erro na execução:', error.message);
        process.exit(1);
    });
}
