'use client';

import { useEffect, useState } from 'react';
import { Stack, Title, Text, Card, Group } from '@mantine/core';
import { supabase } from '@/lib/supabaseClient';
import CardForm from '@/components/CardForm';

type Category = {
    id: string;
    name: string;
};

type CardItem = {
    id: string;
    question: string;
    answer: string;
    category_id: string;
};

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCats, setLoadingCats] = useState(true);

    // prepare cards state (will load from DB in the next step)
    const [cards, setCards] = useState<CardItem[]>([]);
    const [loadingCards, setLoadingCards] = useState(true);

    const loadCategories = async () => {
        setLoadingCats(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true });
        if (!error && data) setCategories(data);
        setLoadingCats(false);
    };

    useEffect(() => {
        (async () => {
            await loadCategories();
        })();
    }, []);

    return (
        <main>
            <Stack p="lg" gap="sm">
                <Title order={2}>All Cards</Title>
                <Text c="dimmed">Create, edit and delete cards across categories.</Text>

                <CardForm categories={categories} />

                {loadingCats && <Text>Loading categories...</Text>}
                {!loadingCats && categories.length === 0 && (
                    <Text c="dimmed">No categories yet. Create one on the homepage first.</Text>
                )}

                {/* Cards list (placeholder; data will be fetched next) */}
                <Stack mt="lg">
                    <Title order={3}>Cards</Title>
                    {loadingCards && <Text>Loading cards...</Text>}
                    {!loadingCards && cards.length === 0 && (
                        <Text c="dimmed">No cards yet</Text>
                    )}
                    {cards.map((c) => {
                        const cat = categories.find((x) => x.id === c.category_id);
                        return (
                            <Card key={c.id} withBorder>
                                <Group justify="space-between" align="start">
                                    <Stack gap={4}>
                                        <Text fw={600}>{c.question}</Text>
                                        <Text c="dimmed">{c.answer}</Text>
                                    </Stack>
                                    <Text>{cat ? cat.name : '—'}</Text>
                                </Group>
                            </Card>
                        );
                    })}
                </Stack>
            </Stack>
        </main>
    );
}
