'use client';

import { useState } from 'react';
import { Button, Group, TextInput, Textarea } from '@mantine/core';

export default function CardForm() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        const q = question.trim();
        const a = answer.trim();
        if (!q || !a) return;

        setSubmitting(true);
        console.log('Create card:', { question: q, answer: a });

        await new Promise((r) => setTimeout(r, 300));
        setQuestion('');
        setAnswer('');
        setSubmitting(false);
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
