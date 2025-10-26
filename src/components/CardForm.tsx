'use client';

import { useState } from 'react';
import { Button, Group, TextInput, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { supabase } from '@/lib/supabaseClient';

export default function CardForm() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        const q = question.trim();
        const a = answer.trim();
        if (!q || !a) return;

        setSubmitting(true);
        const { error } = await supabase.from('cards').insert({ question: q, answer: a });
        setSubmitting(false);

        if (error) {
            notifications.show({ color: 'red', message: error.message });
            return;
        }

        setQuestion('');
        setAnswer('');
        notifications.show({ color: 'green', message: 'Card created' });
    };

    return (
        <Group align="end">
            <TextInput
                w={420}
                label="Question"
                placeholder="Type your question"
                value={question}
                onChange={(e) => setQuestion(e.currentTarget.value)}
            />
            <Textarea
                w={420}
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
