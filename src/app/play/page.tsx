'use client';

import { useEffect, useState } from 'react';
import { Stack, Title, Text, Button, Card } from '@mantine/core';
import { supabase } from '@/lib/supabaseClient';

type CardItem = {
    id: string;
    question: string;
    answer: string;
    category_id: string;
};

export default function PlayPage() {
    const [cards, setCards] = useState<CardItem[]>([]);
    const [current, setCurrent] = useState<CardItem | null>(null);
    const [loading, setLoading] = useState(true);

    const loadCards = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
            const shuffled = [...data].sort(() => Math.random() - 0.5);
            setCards(shuffled);
            setCurrent(shuffled[0]);
        }
        setLoading(false);
    };

    useEffect(() => {
        (async () => {
            await loadCards();
        })();
    }, []);

    const nextCard = () => {
        if (cards.length === 0) return;
        const nextIndex = Math.floor(Math.random() * cards.length);
        setCurrent(cards[nextIndex]);
    };

    return (
        <main>
            <Stack p="lg" gap="sm" align="center">
                <Title order={2}>Flashcard Trainer</Title>
                <Text c="dimmed">Random training mode</Text>

                {loading && <Text>Loading cards...</Text>}
                {!loading && !current && <Text>No cards available</Text>}

                {current && (
                    <Card withBorder shadow="sm" p="xl" w={400} ta="center">
                        <Text fw={600} size="lg">
                            {current.question}
                        </Text>
                        <Button mt="md" onClick={nextCard}>
                            Next Random Card
                        </Button>
                    </Card>
                )}
            </Stack>
        </main>
    );
}
