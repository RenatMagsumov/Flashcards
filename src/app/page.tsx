'use client';

import { useEffect, useState } from 'react';
import { Stack, Title, Text, Card, Group } from '@mantine/core';
import { supabase } from '@/lib/supabaseClient';
import CategoryForm from '@/components/CategoryForm';

type Category = {
  id: string;
  name: string;
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <main>
      <Stack p="lg" gap="sm">
        <Title order={2}>Categories</Title>
        <CategoryForm />

        <Stack>
          {loading && <Text>Loading...</Text>}
          {!loading && categories.length === 0 && (
            <Text c="dimmed">No categories yet</Text>
          )}
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
