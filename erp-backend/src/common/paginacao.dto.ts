export function paginar(pagina = 1, limite = 20) {
  return {
    skip: (pagina - 1) * limite,
    take: limite,
  };
}
