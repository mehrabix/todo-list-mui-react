'use client'
import { todoService, useGetTodoByIdQuery } from '@/app/service';
import { Button } from '@mui/material';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { useRouter } from 'next/navigation';

function Description({ slug }: { slug: string[] }) {
    const { data: todo, isLoading, isError } = useGetTodoByIdQuery(slug[0]);

    const router = useRouter()

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching todo.</div>;

    return (
        <div className='flex justify-center items-center h-screen flex-col'>
            <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => router.back()}
            >
                Back
            </Button>
            {todo ? (
                <div>
                    Here is full Description feched by id {slug[0]}:
                    <p>{todo.description}</p>
                    Click 'Back', and you will be directed to the exact page you previously visited.
                </div>
            ) : (
                <div>Todo not found.</div>
            )}
        </div>
    );
}


export default function HomeDataSourceProvider({ params }: { params: { slug: string[] } }) {
    return (
        <ApiProvider api={todoService}>
            <Description slug={params.slug} />
        </ApiProvider>
    )
}