'use client';

import { useEffect, useState } from 'react';
import {
    Stack,
    Title,
    Text,
    Button,
    Card,
    TextInput,
    Group,
    SegmentedControl,
} from '@mantine/core';
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
    const [stats, setStats] = useState({ correct: 0, wrong: 0 });

    const [mode, setMode] = useState<'random' | 'sequential'>('random');
    const [index, setIndex] = useState(0);

    const loadCards = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
            setCards(data);
            setCurrent(data[0]);
        }
        setLoading(false);
    };

    useEffect(() => {
        (async () => {
            await loadCards();
        })();
    }, []);

    const saveAttempt = async (cardId: string, userAnswer: string, isCorrect: boolean) => {
        await supabase.from('attempts').insert({
            card_id: cardId,
            user_answer: userAnswer,
            is_correct: isCorrect,
        });
    };

    const checkAnswer = async () => {
        if (!current) return;
        const normalizedUser = userAnswer.trim().toLowerCase();
        const normalizedCorrect = current.answer.trim().toLowerCase();
        const isCorrect = normalizedUser === normalizedCorrect;

        setResult(isCorrect ? 'correct' : 'wrong');
        setStats((prev) => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            wrong: prev.wrong + (!isCorrect ? 1 : 0),
        }));

        await saveAttempt(current.id, userAnswer, isCorrect);
    };

    const nextCard = () => {
        if (cards.length === 0) return;

        if (mode === 'random') {
            const nextIndex = Math.floor(Math.random() * cards.length);
            setCurrent(cards[nextIndex]);
        } else {
            const nextIndex = (index + 1) % cards.length;
            setIndex(nextIndex);
            setCurrent(cards[nextIndex]);
        }

        setUserAnswer('');
        setResult(null);
    };

    return (
        <main>
            <Stack p="lg" gap="sm" align="center">
                <Title order={2}>Flashcard Trainer</Title>
                <Text c="dimmed">Choose your training mode and start practicing!</Text>

                <SegmentedControl
                    value={mode}
                    onChange={(v) => {
                        setMode(v as 'random' | 'sequential');
                        setIndex(0);
                        setCurrent(cards[0] ?? null);
                    }}
                    data={[
                        { label: 'Random', value: 'random' },
                        { label: 'Sequential', value: 'sequential' },
                    ]}
                />

                <Group mt="md" gap="xl">
                    <Text fw={500}>✅ Correct: {stats.correct}</Text>
                    <Text fw={500}>❌ Wrong: {stats.wrong}</Text>
                </Group>

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
                                ✅ Correct!
                            </Text>
                        )}
                        {result === 'wrong' && (
                            <Text c="red" mt="sm">
                                ❌ Wrong. Correct answer: {current.answer}
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
