'use client';

import { useState } from 'react';
import { Button, Group, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { supabase } from '@/lib/supabaseClient';

type Props = {
    onCreated?: () => void;
};

export default function CategoryForm({ onCreated }: Props) {
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        const trimmed = name.trim();
        if (!trimmed) return;

        setSubmitting(true);
        const { error } = await supabase.from('categories').insert({ name: trimmed });
        setSubmitting(false);

        if (error) {
            notifications.show({ color: 'red', message: error.message });
            return;
        }

        setName('');
        notifications.show({ color: 'green', message: 'Category created' });
        onCreated?.();
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
