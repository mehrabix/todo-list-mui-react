import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TodoPayload, TodoResponse } from './model';

export const todoService = createApi({
  reducerPath: 'todoService',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.API_URL}/todos/` }),
  endpoints: (builder) => ({
    createTodo: builder.mutation<void, Partial<TodoPayload>>({
      query: (todo) => ({
        url: 'create',
        method: 'POST',
        body: todo,
      }),
    }),
    getTodoById: builder.query<TodoPayload, string>({
      query: (id) => `getById/${id}`,
    }),
    updateTodo: builder.mutation<void, { id: string, todo: Partial<TodoPayload> }>({
      query: ({ id, todo }) => ({
        url: `update/${id}`,
        method: 'PUT',
        body: todo,
      }),
    }),
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `delete/${id}`,
        method: 'DELETE',
      }),
    }),
    getAllTodos: builder.query<TodoPayload[], void>({
      query: () => 'getAll',
    }),
    bulkDeleteTodos: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: 'bulk-delete',
        method: 'DELETE',
        body: { ids },
      }),
    }),
    listTodos: builder.query<TodoResponse, { skip: number, take: number, pageSize: number, sortBy?: string, sortDirection?: string, title?: string, completed?: boolean, description?: string }>({
      query: ({ skip, take, pageSize, sortBy, sortDirection, title, completed, description }) => {
        let queryString = `list?skip=${skip}&take=${take}&pageSize=${pageSize}`;
        if (sortBy) {
          queryString += `&sortBy=${sortBy}`;
        }
        if (sortDirection) {
          queryString += `&sortDirection=${sortDirection}`;
        }
        if (title) {
          queryString += `&title=${encodeURIComponent(title)}`;
        }
        if (completed !== undefined) {
          queryString += `&completed=${completed}`;
        }
        if (description) {
          queryString += `&description=${encodeURIComponent(description)}`;
        }
        return queryString;
      },
    }),
  }),
});

export const {
  useCreateTodoMutation,
  useGetTodoByIdQuery,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useGetAllTodosQuery,
  useBulkDeleteTodosMutation,
  useListTodosQuery,
} = todoService;
