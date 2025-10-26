'use client';

import { Button, Group, TextInput, Textarea } from '@mantine/core';

export default function CardForm() {
    return (
        <Group align="end">
            <TextInput
                w={420}
                label="Question"
                placeholder="Type your question"
            />
            <Textarea
                w={420}
                label="Answer"
                placeholder="Type the expected answer"
                minRows={1}
                autosize
            />
            <Button>Add</Button>
        </Group>
    );
}
