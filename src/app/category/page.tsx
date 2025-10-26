'use client';

import { Stack, Title, Text } from '@mantine/core';
import CardForm from '@/components/CardForm';

export default function CategoryPage() {
    return (
        <main>
            <Stack p="lg" gap="sm">
                <Title order={2}>All Cards</Title>
                <Text c="dimmed">create, edit and delete cards.</Text>

                <CardForm />
            </Stack>
        </main>
    );
}
