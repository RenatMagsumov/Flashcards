'use client';

import { Button, Group, TextInput } from '@mantine/core';

export default function CategoryForm() {
    return (
        <Group align="end">
            <TextInput label="New category" placeholder="e.g. JavaScript" />
            <Button>Add</Button>
        </Group>
    );
}
