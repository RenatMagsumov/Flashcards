'use client';

import { useMemo, useState } from 'react';
import { Button, Group, TextInput, Textarea, Select } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { supabase } from '@/lib/supabaseClient';

type Category = { id: string; name: string };

type Props = {
    categories: Category[];
    onCreated?: () => void;
};

export default function CardForm({ categories, onCreated }: Props) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const selectData = useMemo(
        () => categories.map((c) => ({ value: c.id, label: c.name })),
        [categories]
    );

    const onSubmit = async () => {
        const q = question.trim();
        const a = answer.trim();
        const cat = categoryId;
        if (!q || !a || !cat) return;

        setSubmitting(true);
        const { error } = await supabase.from('cards').insert({
            category_id: cat,
            question: q,
            answer: a,
        });
        setSubmitting(false);

        if (error) {
            notifications.show({ color: 'red', message: error.message });
            return;
        }

        setQuestion('');
        setAnswer('');
        setCategoryId(null);
        notifications.show({ color: 'green', message: 'Card created' });
        onCreated?.();
    };

    return (
        <Group align="end">
            <Select
                label="Category"
                placeholder="Select a category"
                data={selectData}
                value={categoryId}
                onChange={setCategoryId}
                w={260}
                searchable
                nothingFoundMessage="No categories"
            />

            <TextInput
                w={360}
                label="Question"
                placeholder="Type your question"
                value={question}
                onChange={(e) => setQuestion(e.currentTarget.value)}
            />

            <Textarea
                w={360}
                label="Answer"
                placeholder="Type the expected answer"
                minRows={1}
                autosize
                value={answer}
                onChange={(e) => setAnswer(e.currentTarget.value)}
            />

            <Button loading={submitting} onClick={onSubmit}>
                Add
            </Button>
        </Group>
    );
}
