'use client';

import { useState } from 'react';
import { Stack, Title, Text, Card, Group } from '@mantine/core';
import CategoryForm from '@/components/CategoryForm';

type Category = {
  id: string;
  name: string;
};

export default function HomePage() {

  const [categories] = useState<Category[]>([]);

  return (
    <main>
      <Stack p="lg" gap="sm">
        <Title order={2}>Categories</Title>
        <Text c="dimmed">categories from database</Text>

        <CategoryForm />

        <Stack>
          {categories.length === 0 && <Text c="dimmed">No categories yet</Text>}
          {categories.map((c) => (
            <Card key={c.id} withBorder>
              <Group justify="space-between">
                <Text fw={600}>{c.name}</Text>

              </Group>
            </Card>
          ))}
        </Stack>
      </Stack>
    </main>
  );
}
