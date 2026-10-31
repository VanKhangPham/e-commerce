import { prisma } from './src/config/prisma.js';
import { OrderService } from './src/services/order.service.js';

async function testConcurrency() {
  console.log('--- Kiểm thử tính nguyên tử và tranh chấp tồn kho (Concurrency Test) ---');

  // 1. Create a dummy test product with exactly stock = 3
  const testProd = await prisma.product.create({
    data: {
      name: 'Sản phẩm Test Concurrency',
      slug: `test-concurrency-${Date.now()}`,
      price: 100000,
      originalPrice: 120000,
      stock: 3,
      soldCount: 0,
      thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      categoryId: 'cat-1',
      brand: 'TestBrand',
      shortDescription: 'Test',
      description: 'Test description',
    },
  });

  const user = await prisma.user.findFirst({ where: { email: 'user@nova.vn' } });
  if (!user) throw new Error('User not found');

  console.log(`Đã tạo sản phẩm test (ID: ${testProd.id}, Tồn kho ban đầu: 3)`);
  console.log('Thực hiện gửi 5 yêu cầu đặt hàng đồng thời (mỗi đơn mua 1 cái)...');

  const makeOrder = async (index: number) => {
    try {
      const order = await OrderService.createOrder(user.id, {
        customerName: `Khách hàng ${index}`,
        customerPhone: '0908123456',
        customerEmail: 'user@nova.vn',
        shippingAddress: {
          fullName: `Người nhận ${index}`,
          phone: '0908123456',
          province: 'TP. HCM',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé',
          addressDetail: '123 Test',
        },
        paymentMethod: 'COD',
        items: [{ productId: testProd.id, quantity: 1 }],
      });
      return { success: true, orderId: order.id };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  };

  const results = await Promise.all([
    makeOrder(1),
    makeOrder(2),
    makeOrder(3),
    makeOrder(4),
    makeOrder(5),
  ]);

  const successes = results.filter((r) => r.success);
  const failures = results.filter((r) => !r.success);

  console.log(`Kết quả: ${successes.length} đơn thành công, ${failures.length} đơn thất bại.`);
  failures.forEach((f, i) => console.log(`  Lỗi đơn thất bại ${i + 1}: ${f.error}`));

  const updatedProd = await prisma.product.findUnique({ where: { id: testProd.id } });
  console.log(`Tồn kho cuối cùng: ${updatedProd?.stock}, Đã bán: ${updatedProd?.soldCount}`);

  // Cleanup test product and orders
  for (const s of successes) {
    if (s.orderId) {
      await prisma.orderTimeline.deleteMany({ where: { orderId: s.orderId } });
      await prisma.orderItem.deleteMany({ where: { orderId: s.orderId } });
      await prisma.order.delete({ where: { id: s.orderId } });
    }
  }
  await prisma.product.delete({ where: { id: testProd.id } });
  console.log('✓ Đã dọn dẹp dữ liệu test');

  if (successes.length === 3 && failures.length === 2 && updatedProd?.stock === 0) {
    console.log('✅ PASS: Tính nhất quán và tranh chấp tồn kho hoạt động hoàn hảo!');
  } else {
    console.error('❌ FAIL: Tính nhất quán thất bại');
    process.exit(1);
  }

  await prisma.$disconnect();
}

testConcurrency().catch((err) => {
  console.error(err);
  process.exit(1);
});
