import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { Database } from './database.js';
import path from 'node:path';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      };

      database.insert('tasks', task);

      return res.writeHead(201).end(JSON.stringify(task));
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const existingTask = database
        .select('tasks')
        .find((task) => task.id === id);

      if (!existingTask) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Task not found' }));
      }

      database.update('tasks', id, {
        title: title ?? existingTask.title,
        description: description ?? existingTask.description,
        created_at: existingTask.created_at,
        completed_at: null,
        updated_at: new Date(),
      });

      return res.writeHead(200).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const existingTask = database
        .select('tasks')
        .find((task) => task.id === id);

      if (!existingTask) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Task not found' }));
      }

      database.update('tasks', id, {
        title: existingTask.title,
        description: existingTask.description,
        created_at: existingTask.created_at,
        completed_at: new Date(),
        updated_at: existingTask.updated_at,
      });

      return res.writeHead(200).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;

      database.delete('tasks', id);
      return response.writeHead(204).end();
    },
  },
];
