'use client';

import { Stack, Title, Text } from '@mantine/core';

export default function PlayPage() {
    return (
        <main>
            <Stack p="lg" gap="sm" align="center">
                <Title order={2}>Flashcard Trainer</Title>
                <Text c="dimmed">
                    Practice your cards
                </Text>
            </Stack>
        </main>
    );
}
