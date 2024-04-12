import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TodoPayload, TodoResponse } from './model';

export const todoApi = createApi({
  reducerPath: 'todoApi',
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
    listTodos: builder.query<TodoResponse, { skip: number, take: number, pageSize: number }>({
      query: ({ skip, take, pageSize }) => `list?skip=${skip}&take=${take}&pageSize=${pageSize}`,
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
} = todoApi;
