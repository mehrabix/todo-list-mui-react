'use client'
import { RootState, store } from '@/store';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { TodoPayload } from './model';
import { setColumnFilter, setPage, setPageSize, setSorting } from './reducer';
import { useCreateTodoMutation, useListTodosQuery } from './service';

function Home() {

  const page = useSelector((state: RootState) => state.app.page);
  const pageSize = useSelector((state: RootState) => state.app.pageSize);
  const sorting = useSelector((state: RootState) => state.app.sorting);
  const columnFilters = useSelector((state: RootState) => state.app.columnFilters);
  const router = useRouter()

  const dispatch = useDispatch();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 130 },
    { field: 'completed', headerName: 'Completed', width: 120, type: 'boolean' },
    { field: 'description', headerName: 'Description', width: 200 },
    {
      field: 'showFullDescription',
      filterable: false,
      sortable: false,
      headerName: 'showFullDescription',
      width: 250,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => handleShowFullDescription(params.row)}
        >
          Show Full Description
        </Button>
      ),
    },
  ];

  const handleShowFullDescription = (row: { id: number; }) => {
    dispatch(setPage(page));
    dispatch(setPageSize(pageSize));
    router.push(`description/${row.id}`);
  }

  const { data: todos, isLoading: todosLoading, refetch: refreshTodos } = useListTodosQuery({
    skip: page * pageSize,
    take: pageSize,
    pageSize: pageSize,
    sortBy: sorting?.replace('-', ''),
    sortDirection: sorting?.startsWith('-') ? 'desc' : 'asc',
    ...columnFilters
  });

  const [mutate, { isError, error, isLoading: createTodoLoading }] = useCreateTodoMutation();

  const [open, setOpen] = useState(false);

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
      setOpen(false);
      refreshTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handlePageChange = (newPage: GridPaginationModel) => {
    if (newPage.page !== undefined) {
      dispatch(setPage(newPage.page));
    }
    if (newPage.pageSize !== undefined) {
      dispatch(setPageSize(newPage.pageSize));
    }
  }

  const handleFilterChange = (field: string, value: any) => {
    dispatch(setColumnFilter({ field, value }));
    // dispatch(setPage(0));
  };

  const handleSortingChange = (field: string) => {
    const newSorting = field === sorting ? `-${field}` : field;
    dispatch(setSorting(newSorting));
    // dispatch(setPage(0));
  };


  if (todosLoading) return <div className='h-screen w-full flex justify-center items-center'><span>Loading...</span></div>;

  return (
    <>
      <main className='flex justify-center items-center h-screen'>

        <div className='w-full lg:w-1/2'>

          <div className='space-x-3 mb-3'>
            <Button onClick={() => setOpen(true)} variant="contained" color="success">
              Add
            </Button>
          </div>
          <DataGrid
            className='!h-96 bg-slate-100'
            rows={todos?.items || []}
            columns={columns}
            pageSizeOptions={[5, 10]}
            rowCount={todos?.totalItems || 0}
            paginationModel={{ page: page, pageSize: pageSize }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}

            checkboxSelection
            pagination
            paginationMode="server"
            filterModel={{
              items: Object.keys(columnFilters).map((field) => ({
                field: field,
                operator: 'contains',
                value: columnFilters[field],
              }))
            }}
            sortModel={sorting ? [{ field: sorting.replace('-', ''), sort: sorting.startsWith('-') ? 'desc' : 'asc' }] : []}
            onPaginationModelChange={(newPage) => handlePageChange(newPage)}
            onSortModelChange={(model) => {
              if (model.length > 0) {
                handleSortingChange(model[0].field);
              }
            }}
            onFilterModelChange={(model) => {
              model.items.forEach((item) => {
                const field = item.field;
                handleFilterChange(field, item.value);
              });
            }}

            disableRowSelectionOnClick
            localeText={{
              noRowsLabel: "There is no data :("
            }}
          />
        </div>
        <Dialog open={open} onClose={() => setOpen(false)}>
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
                <Button onClick={() => setOpen(false)}>Cancel</Button>
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
    <Provider store={store}>
      <Home />
    </Provider>
  )
}
