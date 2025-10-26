'use client';

import { useEffect, useState } from 'react';
import { Stack, Title, Text } from '@mantine/core';
import { supabase } from '@/lib/supabaseClient';
import CardForm from '@/components/CardForm';

type Category = {
    id: string;
    name: string;
};

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCats, setLoadingCats] = useState(true);

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

                {/* Pass real categories into CardForm */}
                <CardForm categories={categories} />

                {loadingCats && <Text>Loading categories...</Text>}
                {!loadingCats && categories.length === 0 && (
                    <Text c="dimmed">No categories yet. Create one on the homepage first.</Text>
                )}
            </Stack>
        </main>
    );
}
