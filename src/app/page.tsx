'use client'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { useMemo, useState } from 'react';
import { TodoPayload } from './model';
import { todoApi, useCreateTodoMutation, useListTodosQuery } from './service';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', width: 130 },
  { field: 'completed', headerName: 'Completed', width: 120, type: 'boolean' },
  { field: 'description', headerName: 'Description', width: 200 },
];


function Home() {
  const [pagination, setPagination] = useState({ page: 0, pageSize: 5 });
  const { data: todos, isLoading: todosLoading, refetch: refreshTodos } = useListTodosQuery({
    skip: pagination.page * pagination.pageSize,
    take: pagination.pageSize,
    pageSize: pagination.pageSize,
  });

  const [mutate, { isError, error, isLoading: createTodoLoading }] = useCreateTodoMutation();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues: Partial<TodoPayload> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      completed: formData.get('completed') === 'on' ? true : false,
    };

    try {
      const data = await mutate(formValues);
      console.log('Created todo:', data);
      handleClose();
      refreshTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handlePageChange = (newPage: GridPaginationModel) => {
    if (newPage.page !== undefined) {
      setPagination(prevPagination => ({
        ...prevPagination,
        page: newPage.page,
      }));
    }
  }

  const memoizedTodos = useMemo(() => todos?.items || [], [todos]);


  if (todosLoading) return <div className='h-screen w-full flex justify-center items-center'><span>Loading...</span></div>;

  return (
    <>
      <main className='flex justify-center items-center h-screen'>

        <div className='w-full lg:w-1/2'>

          <div className='space-x-3 mb-3'>
            <Button onClick={handleClickOpen} variant="contained" color="success">
              Add
            </Button>
          </div>
          <DataGrid
            className='!h-96 bg-slate-100'
            rows={memoizedTodos}
            columns={columns}
            pageSizeOptions={[5, 10]}
            rowCount={todos?.totalItems || 0}
            paginationModel={{ page: pagination.page, pageSize: pagination.pageSize }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}

            checkboxSelection
            pagination
            paginationMode="server"
            onPaginationModelChange={(newPage) => handlePageChange(newPage)}
            disableRowSelectionOnClick
            localeText={{
              noRowsLabel: "There is no data :("
            }}
          />
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add a new todo</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add a new todo to your todo list!
            </DialogContentText>
            <form onSubmit={handleSubmit}>
              <TextField
                autoFocus
                required
                margin="dense"
                id="title"
                name="title"
                label="Title"
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                id="description"
                name="description"
                label="Description"
                fullWidth
                variant="standard"
              />
              <TextField
                className='pb-3'
                margin="dense"
                id="completed"
                name="completed"
                label="Completed ?"
                type="checkbox"
                fullWidth
                variant="standard"
              />
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Add Todo</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}

export default function HomeDataSourceProvider() {
  return (
    <ApiProvider api={todoApi}>
      <Home />
    </ApiProvider>
  )
}