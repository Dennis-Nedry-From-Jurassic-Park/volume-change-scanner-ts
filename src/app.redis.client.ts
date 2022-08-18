import { createClient } from '@redis/client';

const createWorkspaceShareCode = async (): Promise<any>  => {
    const client = createClient({
        url: 'redis://localhost:6379'
    });
    await client.connect();

    await client.set('key_example', 'value');
    const value = await client.get('key');
    return value;
}
createWorkspaceShareCode();