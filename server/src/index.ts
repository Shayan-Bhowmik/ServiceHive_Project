import app from './app';
import { connectDatabase } from './config/db';
import { env } from './config/env';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${env.PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

void startServer();
