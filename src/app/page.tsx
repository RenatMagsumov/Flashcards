'use client';

import { Stack, Title, Text } from '@mantine/core';

export default function HomePage() {
  return (
    <main>
      <Stack p="lg" gap="sm">
        <Title order={2}>Categories</Title>
        <Text c="dimmed">Create form</Text>
      </Stack>
    </main>
  );
}
