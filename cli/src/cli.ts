import {loadHierarchy} from './utils/loadHierarchy';
import {analyzePhraseStream} from './utils/analyzePhrase';
import {Readable} from 'stream';

export async function main() {
    const args = process.argv.slice(2);
    const phrase = args.find(arg => arg.startsWith('"'))?.replace(/"/g, '') || '';
    const depthIndex = args.indexOf('--depth');

    if (depthIndex === -1 || isNaN(parseInt(args[depthIndex + 1], 10))) {
        const errorMessage = 'Erro: Argumento --depth é obrigatório e deve ser um número.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    const depth = parseInt(args[depthIndex + 1], 10);
    const verbose = args.includes('--verbose');

    const startTime = Date.now();

    const hierarchy = loadHierarchy();
    const phraseStream = Readable.from(phrase);

    const loadTime = Date.now() - startTime;

    const startVerifyTime = Date.now();
    const result = await analyzePhraseStream(hierarchy, phraseStream, depth);

    console.table(result);

    if (verbose) {
        const verifyTime = Date.now() - startVerifyTime;
        console.log(`Tempo de carregamento dos parâmetros: ${loadTime}ms`);
        console.log(`Tempo de verificação da frase: ${verifyTime}ms`);
    }
}

if (require.main === module) {
    main().catch(error => {
        process.exit(1);
    });
}