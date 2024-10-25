
import { analyzePhraseStream } from '../utils/analyzePhrase';
import { Readable } from 'stream';

test('análise de frase com mais de 5000 palavras', async () => {
  const hierarchy = {
    Natureza: {
      Animais: {
        Aves: {
          Pássaros: ["Papagaio", "Canário"]
        }
      }
    }
  };
  
  const largeText = 'Papagaio '.repeat(5001);
  const phraseStream = Readable.from(largeText);
  const depth = 2;

  const result = await analyzePhraseStream(hierarchy, phraseStream, depth);
  
  expect(result['Pássaros']).toEqual(5001);
});

test('análise de frase com múltiplas palavras de diferentes categorias', async () => {
  const hierarchy = {
    Natureza: {
      Animais: {
        Mamíferos: {
          Carnívoros: ["Leão", "Tigre"],
          Herbívoros: ["Elefante", "Girafa"]
        },
        Aves: {
          Pássaros: ["Papagaio", "Canário"]
        }
      }
    }
  };

  const phrase = 'Leão Papagaio Elefante';
  const phraseStream = Readable.from(phrase);
  const depth = 2;

  const result = await analyzePhraseStream(hierarchy, phraseStream, depth);

  expect(result['Carnívoros']).toEqual(1);
  expect(result['Pássaros']).toEqual(1);
  expect(result['Herbívoros']).toEqual(1);
});

test('análise de frase sem correspondência na hierarquia', async () => {
  const hierarchy = {
    Natureza: {
      Animais: {
        Mamíferos: {
          Carnívoros: ["Leão", "Tigre"]
        }
      }
    }
  };

  const phrase = 'Carro Computador Telefone';
  const phraseStream = Readable.from(phrase);
  const depth = 2;

  const result = await analyzePhraseStream(hierarchy, phraseStream, depth);

  expect(result).toEqual({});
});

test('análise com profundidade superior à hierarquia', async () => {
  const hierarchy = {
    Natureza: {
      Animais: {
        Mamíferos: {
          Carnívoros: ["Leão", "Tigre"]
        }
      }
    }
  };

  const phrase = 'Leão Tigre';
  const phraseStream = Readable.from(phrase);
  const depth = 5;

  const result = await analyzePhraseStream(hierarchy, phraseStream, depth);

  expect(result).toEqual({});
});

test('análise de frase com palavras duplicadas', async () => {
  const hierarchy = {
    Natureza: {
      Animais: {
        Aves: {
          Pássaros: ["Papagaio", "Canário"]
        }
      }
    }
  };

  const phrase = 'Papagaio Canário Papagaio Papagaio';
  const phraseStream = Readable.from(phrase);
  const depth = 2;

  const result = await analyzePhraseStream(hierarchy, phraseStream, depth);

  expect(result['Pássaros']).toEqual(3);
});