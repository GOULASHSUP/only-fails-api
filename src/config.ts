import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

if (!process.env.TOKEN_SECRET) {
    console.error('TOKEN_SECRET is missing from environment variables!');
    process.exit(1);
}

export const TOKEN_SECRET = process.env.TOKEN_SECRET;