import { z } from 'zod';

const TodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  completed: z.boolean(),
});

type TodoPayload = z.infer<typeof TodoSchema>;

interface Pagination {
  totalItems: number;
  totalPage: number;
  skip: number;
}

interface PaginatedResponse<T> extends Pagination {
  items: T[];
}

type TodoResponse = PaginatedResponse<TodoPayload>;

export type { TodoPayload, TodoResponse };


