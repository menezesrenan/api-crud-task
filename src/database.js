import fs from 'node:fs/promises';
// import parse from 'csv-parse';

const databasePath = new URL('tasks-db.json', import.meta.url);

export class Database {
  #database = {};

  // constuctor() {
  //   fs.readFile(databasePath, 'utf-8')
  //     .then((data) => {
  //       parse(
  //         data,
  //         {
  //           columns: true,
  //           trim: true,
  //           skip_empty_lines: true,
  //         },
  //         (err, records) => {
  //           if (err) {
  //             console.error('Error parsing CSV:', err);
  //             return;
  //           }
  //           this.#database.tasks = records;
  //         }
  //       );
  //       this.#database = JSON.parse(data);
  //     })
  //     .catch(() => {
  //       this.#persist();
  //     });
  // }

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist(); // se não existir o arquivo, cria um novo vazio
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database)); // esta sendo criado o db.json na pasta onde está o database.js
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }
    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }
  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
    }
  }
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
