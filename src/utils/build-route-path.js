// task/:id

export const buildRoutePath = (path) => {
  const routeParametersRegex = /:([a-zA-Z]+)/g; // :id => id
  const pathWithParams = path.replaceAll(
    routeParametersRegex,
    '(?<$1>[a-z0-9-_]+)' // (?<id>...) => nome do grupo // ?<$1 => nome do grupo dinamico
  );

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`); // ^$ => inicio e fim da string // (?<query>\\?(.*))? => ?(.*) => query string opcional

  // toda regex tem um metodo test
  // console.log(pathRegex.test('/users/1')); // true

  return pathRegex;
};
