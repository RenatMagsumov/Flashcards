'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Group, Button, Title } from '@mantine/core';

export default function AppHeader() {
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    return (
        <header>
            <Container py="md">
                <Group justify="space-between">
                    <Title order={3}>Flashcards</Title>
                    <Group>
                        <Button
                            component={Link}
                            href="/"
                            variant={isActive('/') ? 'filled' : 'subtle'}
                        >
                            Home
                        </Button>
                        <Button
                            component={Link}
                            href="/category"
                            variant={isActive('/category') ? 'filled' : 'subtle'}
                        >
                            Categories/Cards
                        </Button>
                        <Button
                            component={Link}
                            href="/play"
                            variant={isActive('/play') ? 'filled' : 'subtle'}
                        >
                            Play
                        </Button>
                    </Group>
                </Group>
            </Container>
        </header>
    );
}
