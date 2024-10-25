import { loadHierarchy } from './utils/loadHierarchy';
import { analyzePhraseStream } from './utils/analyzePhrase';
import { Readable } from 'stream';

const args = process.argv.slice(2);
const phrase = args.find(arg => arg.startsWith('"'))?.replace(/"/g, '') || '';
const depth = parseInt(args[args.indexOf('--depth') + 1], 10);
const verbose = args.includes('--verbose');

const startTime = Date.now();

const hierarchy = loadHierarchy();
const phraseStream = Readable.from(phrase);

const loadTime = Date.now() - startTime;

const startVerifyTime = Date.now();
analyzePhraseStream(hierarchy, phraseStream, depth).then(result => {
  console.table(result);

  if (verbose) {
    const verifyTime = Date.now() - startVerifyTime;
    console.log(`Tempo de carregamento dos parâmetros: ${loadTime}ms`);
    console.log(`Tempo de verificação da frase: ${verifyTime}ms`);
  }
});
