'use client';

import { useEffect, useState } from 'react';
import { Stack, Title, Text, Button, Card, TextInput } from '@mantine/core';
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
    const [userAnswer, setUserAnswer] = useState('');
    const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

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

    const checkAnswer = () => {
        if (!current) return;
        const normalizedUser = userAnswer.trim().toLowerCase();
        const normalizedCorrect = current.answer.trim().toLowerCase();
        if (normalizedUser === normalizedCorrect) {
            setResult('correct');
        } else {
            setResult('wrong');
        }
    };

    const nextCard = () => {
        if (cards.length === 0) return;
        const nextIndex = Math.floor(Math.random() * cards.length);
        setCurrent(cards[nextIndex]);
        setUserAnswer('');
        setResult(null);
    };

    return (
        <main>
            <Stack p="lg" gap="sm" align="center">
                <Title order={2}>Flashcard Trainer</Title>
                <Text c="dimmed">Type your answer and check correctness</Text>

                {loading && <Text>Loading cards...</Text>}
                {!loading && !current && <Text>No cards available</Text>}

                {current && (
                    <Card withBorder shadow="sm" p="xl" w={400} ta="center">
                        <Text fw={600} size="lg">
                            {current.question}
                        </Text>

                        <TextInput
                            mt="md"
                            placeholder="Your answer..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.currentTarget.value)}
                        />

                        <Button mt="md" onClick={checkAnswer}>
                            Check
                        </Button>

                        {result === 'correct' && (
                            <Text c="green" mt="sm">
                                Correct!
                            </Text>
                        )}
                        {result === 'wrong' && (
                            <Text c="red" mt="sm">
                                Wrong. Correct answer: {current.answer}
                            </Text>
                        )}

                        {result && (
                            <Button mt="md" variant="light" onClick={nextCard}>
                                Next Card
                            </Button>
                        )}
                    </Card>
                )}
            </Stack>
        </main>
    );
}
