'use client';

import { useMemo, useState } from 'react';
import { Button, Group, TextInput, Textarea, Select } from '@mantine/core';

type Category = { id: string; name: string };

type Props = {
    categories: Category[];
};

export default function CardForm({ categories }: Props) {
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
        // placeholder: will replace with Supabase insert in the next step
        console.log('Create card:', { question: q, answer: a, category_id: cat });

        await new Promise((r) => setTimeout(r, 300));
        setQuestion('');
        setAnswer('');
        setCategoryId(null);
        setSubmitting(false);
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
