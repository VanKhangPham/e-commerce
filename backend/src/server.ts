import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

const app = createApp();

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✓ Kết nối cơ sở dữ liệu PostgreSQL thành công');

    const server = app.listen(env.PORT, () => {
      console.log('==================================================');
      console.log(`🚀 NOVA Commerce Backend Server đang chạy`);
      console.log(`📡 URL API:        http://localhost:${env.PORT}/api`);
      console.log(`📚 Swagger Docs:   http://localhost:${env.PORT}/api/docs`);
      console.log(`🩺 Health Check:   http://localhost:${env.PORT}/api/health`);
      console.log(`🌐 Frontend CORS:  ${env.CLIENT_ORIGIN}`);
      console.log(`⚙️  Môi trường:     ${env.NODE_ENV}`);
      console.log('==================================================');
    });

    // Graceful Shutdown
    const shutdown = async (signal: string) => {
      console.log(`\nNhận tín hiệu ${signal}. Đang đóng các kết nối...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✓ Đã ngắt kết nối cơ sở dữ liệu. Tiến trình dừng an toàn.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Không thể khởi động máy chủ:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
