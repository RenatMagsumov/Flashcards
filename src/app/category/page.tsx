'use client';

import { useEffect, useState } from 'react';
import {
    Stack,
    Title,
    Text,
    Card,
    Group,
    ActionIcon,
    Modal,
    TextInput,
    Textarea,
    Button,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { supabase } from '@/lib/supabaseClient';
import CardForm from '@/components/CardForm';

type Category = { id: string; name: string };
type CardItem = { id: string; question: string; answer: string; category_id: string };

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCats, setLoadingCats] = useState(true);

    const [cards, setCards] = useState<CardItem[]>([]);
    const [loadingCards, setLoadingCards] = useState(true);

    const [editCard, setEditCard] = useState<CardItem | null>(null);
    const [editQuestion, setEditQuestion] = useState('');
    const [editAnswer, setEditAnswer] = useState('');

    const loadCategories = async () => {
        setLoadingCats(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true });
        if (!error && data) setCategories(data);
        setLoadingCats(false);
    };

    const loadCards = async () => {
        setLoadingCards(true);
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .order('created_at', { ascending: true });
        if (!error && data) setCards(data as CardItem[]);
        setLoadingCards(false);
    };

    useEffect(() => {
        (async () => {
            await Promise.all([loadCategories(), loadCards()]);
        })();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmed = confirm('Are you sure you want to delete this card?');
        if (!confirmed) return;

        const { error } = await supabase.from('cards').delete().eq('id', id);
        if (error) {
            notifications.show({ color: 'red', message: error.message });
            return;
        }

        notifications.show({ color: 'green', message: 'Card deleted' });
        await loadCards();
    };

    const openEdit = (card: CardItem) => {
        setEditCard(card);
        setEditQuestion(card.question);
        setEditAnswer(card.answer);
    };

    return (
        <main>
            <Stack p="lg" gap="sm">
                <Title order={2}>All Cards</Title>
                <Text c="dimmed">Create, edit and delete cards across categories.</Text>

                <CardForm categories={categories} onCreated={loadCards} />

                {loadingCats && <Text>Loading categories...</Text>}
                {!loadingCats && categories.length === 0 && (
                    <Text c="dimmed">No categories yet. Create one on the homepage first.</Text>
                )}

                <Stack mt="lg">
                    <Title order={3}>Cards</Title>
                    {loadingCards && <Text>Loading cards...</Text>}
                    {!loadingCards && cards.length === 0 && <Text c="dimmed">No cards yet</Text>}
                    {cards.map((c) => {
                        const cat = categories.find((x) => x.id === c.category_id);
                        return (
                            <Card key={c.id} withBorder>
                                <Group justify="space-between" align="start">
                                    <Stack gap={4}>
                                        <Text fw={600}>{c.question}</Text>
                                        <Text c="dimmed">{c.answer}</Text>
                                        <Text size="sm">{cat ? cat.name : '—'}</Text>
                                    </Stack>

                                    <Group gap="xs">
                                        <ActionIcon
                                            variant="default"
                                            aria-label="Edit card"
                                            onClick={() => openEdit(c)}
                                        >
                                            <IconPencil size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            color="red"
                                            variant="light"
                                            aria-label="Delete card"
                                            onClick={() => handleDelete(c.id)}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Group>
                            </Card>
                        );
                    })}
                </Stack>
            </Stack>

            {/* Edit modal (UI only for now) */}
            <Modal
                opened={!!editCard}
                onClose={() => setEditCard(null)}
                title="Edit Card"
                centered
            >
                <Stack>
                    <TextInput
                        label="Question"
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.currentTarget.value)}
                    />
                    <Textarea
                        label="Answer"
                        minRows={2}
                        autosize
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.currentTarget.value)}
                    />
                    <Group justify="end">
                        <Button variant="default" onClick={() => setEditCard(null)}>
                            Cancel
                        </Button>
                        <Button disabled>Save</Button>
                    </Group>
                </Stack>
            </Modal>
        </main>
    );
}
