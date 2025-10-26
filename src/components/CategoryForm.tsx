'use client';

import { useState } from 'react';
import { Button, Group, TextInput } from '@mantine/core';

export default function CategoryForm() {
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        const trimmed = name.trim();
        if (!trimmed) return;

        setSubmitting(true);
        console.log('Create category:', trimmed);

        await new Promise((r) => setTimeout(r, 300));
        setName('');
        setSubmitting(false);
    };

    return (
        <Group align="end">
            <TextInput
                label="New category"
                placeholder="e.g. JavaScript"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
            />
            <Button loading={submitting} onClick={onSubmit}>
                Add
            </Button>
        </Group>
    );
}
