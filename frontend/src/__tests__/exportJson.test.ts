import { exportHierarchy } from '../utils/exportJson';

test('exporta a hierarquia corretamente como JSON', () => {
  const hierarchy = { Animais: { Mamíferos: ['Leões'] } };
  expect(() => exportHierarchy(hierarchy)).not.toThrow();
});
