/**
 * E2E Integration Test Suite for NOVA Commerce
 * Tests real endpoints against running backend
 */

const BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
  success?: boolean;
  status?: string;
  message?: string;
  data: T;
  pagination?: unknown;
}

interface UserAuthResponse {
  user: {
    id: string;
    role: string;
    email: string;
  };
  accessToken: string;
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
}

interface CartItemData {
  id: string;
  productId: string;
  quantity: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
}

interface CustomerData {
  id: string;
  email: string;
  isBlocked: boolean;
}

interface DashboardKpiData {
  kpis: {
    totalOrders: number;
    totalRevenue: number;
  };
}

interface StoreSettingsData {
  storeName: string;
}

async function request<T = unknown>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    token?: string;
  } = {}
): Promise<{ status: number; body: ApiResponse<T> }> {
  const url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  return { status: res.status, body: json as ApiResponse<T> };
}

async function runTests() {
  console.log('========================================');
  console.log('🚀 Bắt đầu kiểm thử E2E NOVA Commerce API');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('/health');
    assert(
      health.status === 200 && health.body.status === 'OK',
      '1. Health check /api/health',
      JSON.stringify(health.body)
    );

    // 2. Demo User Login
    const userLogin = await request<UserAuthResponse>('/auth/login', {
      method: 'POST',
      body: { email: 'user@nova.vn', password: 'user123' },
    });
    const userToken = userLogin.body.data?.accessToken;
    assert(
      userLogin.status === 200 &&
        userLogin.body.data?.user?.role === 'USER' &&
        !!userToken,
      '2. Demo User Login (user@nova.vn)',
      JSON.stringify(userLogin.body)
    );

    // 3. Demo Admin Login
    const adminLogin = await request<UserAuthResponse>('/auth/login', {
      method: 'POST',
      body: { email: 'admin@nova.vn', password: 'admin123' },
    });
    const adminToken = adminLogin.body.data?.accessToken;
    assert(
      adminLogin.status === 200 &&
        adminLogin.body.data?.user?.role === 'ADMIN' &&
        !!adminToken,
      '3. Demo Admin Login (admin@nova.vn)',
      JSON.stringify(adminLogin.body)
    );

    // 4. Products list
    const prods = await request<ProductItem[]>('/products?limit=5');
    assert(
      prods.status === 200 && Array.isArray(prods.body.data) && prods.body.data.length > 0,
      '4. Get Products List (/api/products)'
    );
    const testProduct = prods.body.data[0];

    // 5. Product detail by slug
    const prodDetail = await request<ProductItem>(`/products/slug/${testProduct.slug}`);
    assert(
      prodDetail.status === 200 && prodDetail.body.data?.id === testProduct.id,
      `5. Get Product Detail (/api/products/slug/${testProduct.slug})`
    );

    // 6. Categories list
    const cats = await request<unknown[]>('/categories');
    assert(
      cats.status === 200 && Array.isArray(cats.body.data) && cats.body.data.length > 0,
      '6. Get Categories List (/api/categories)'
    );

    // 7. Cart operations
    const addToCart = await request('/cart', {
      method: 'POST',
      token: userToken,
      body: {
        productId: testProduct.id,
        quantity: 2,
      },
    });
    assert(
      addToCart.status === 200 || addToCart.status === 201,
      '7a. Add item to Cart (/api/cart)',
      JSON.stringify(addToCart.body)
    );

    const getCart = await request<{ items: CartItemData[] }>('/cart', {
      token: userToken,
    });
    const cartItem = getCart.body.data?.items?.find((i) => i.productId === testProduct.id);
    assert(
      getCart.status === 200 && !!cartItem,
      '7b. Get Cart and verify added item (/api/cart)',
      JSON.stringify(getCart.body)
    );

    if (cartItem) {
      const updateCart = await request(`/cart/${cartItem.id}`, {
        method: 'PUT',
        token: userToken,
        body: { quantity: 3 },
      });
      assert(
        updateCart.status === 200,
        '7c. Update Cart Item quantity (/api/cart/:id)',
        JSON.stringify(updateCart.body)
      );
    }

    // 8. Wishlist operations
    const addWishlist = await request('/wishlist', {
      method: 'POST',
      token: userToken,
      body: { productId: testProduct.id },
    });
    assert(
      addWishlist.status === 200 || addWishlist.status === 201,
      '8a. Add item to Wishlist (/api/wishlist)',
      JSON.stringify(addWishlist.body)
    );

    const getWishlist = await request<unknown[]>('/wishlist', {
      token: userToken,
    });
    assert(
      getWishlist.status === 200 && Array.isArray(getWishlist.body.data),
      '8b. Get Wishlist (/api/wishlist)'
    );

    const deleteWishlist = await request(`/wishlist/${testProduct.id}`, {
      method: 'DELETE',
      token: userToken,
    });
    assert(
      deleteWishlist.status === 200,
      '8c. Remove item from Wishlist (/api/wishlist/:productId)'
    );

    // 9. Coupon validation
    const validateCoupon = await request<{ code: string }>('/coupons/validate', {
      method: 'POST',
      token: userToken,
      body: {
        code: 'FREESHIP',
        cartTotal: 500000,
      },
    });
    assert(
      validateCoupon.status === 200 && validateCoupon.body.data?.code === 'FREESHIP',
      '9. Validate Coupon code FREESHIP (/api/coupons/validate)',
      JSON.stringify(validateCoupon.body)
    );

    // 10. Create Order via /user/orders
    const createOrder = await request<OrderData>('/user/orders', {
      method: 'POST',
      token: userToken,
      body: {
        customerName: 'Phạm Văn Khang',
        customerPhone: '0908123456',
        customerEmail: 'user@nova.vn',
        shippingAddress: {
          fullName: 'Phạm Văn Khang Test',
          phone: '0908123456',
          province: 'TP. Hồ Chí Minh',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé',
          addressDetail: '123 Đường Lê Lợi',
        },
        paymentMethod: 'COD',
        couponCode: 'FREESHIP',
        note: 'Đơn hàng kiểm thử E2E',
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
          },
        ],
      },
    });
    assert(
      createOrder.status === 200 || createOrder.status === 201,
      '10. Create Order (/api/user/orders)',
      JSON.stringify(createOrder.body)
    );
    const createdOrderId = createOrder.body.data?.id;

    // 11. User Order History & Detail
    const userOrders = await request<OrderData[]>('/user/orders', {
      token: userToken,
    });
    assert(
      userOrders.status === 200 &&
        Array.isArray(userOrders.body.data) &&
        userOrders.body.data.some((o) => o.id === createdOrderId),
      '11a. User view Order History (/api/user/orders)'
    );

    if (createdOrderId) {
      const orderDetail = await request<OrderData>(`/user/orders/${createdOrderId}`, {
        token: userToken,
      });
      assert(
        orderDetail.status === 200 && orderDetail.body.data?.id === createdOrderId,
        '11b. User view Order Details (/api/user/orders/:id)'
      );

      // User cancel order while it's in PENDING status
      const cancelOrder = await request(`/user/orders/${createdOrderId}/cancel`, {
        method: 'POST',
        token: userToken,
        body: { reason: 'Thay đổi kế hoạch mua' },
      });
      assert(
        cancelOrder.status === 200,
        '11c. User cancel Order while PENDING (/api/user/orders/:id/cancel)',
        JSON.stringify(cancelOrder.body)
      );
    }

    // 12. Create another order for Admin testing
    const createOrder2 = await request<OrderData>('/user/orders', {
      method: 'POST',
      token: userToken,
      body: {
        customerName: 'Phạm Văn Khang',
        customerPhone: '0908123456',
        customerEmail: 'user@nova.vn',
        shippingAddress: {
          fullName: 'Phạm Văn Khang Test',
          phone: '0908123456',
          province: 'TP. Hồ Chí Minh',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé',
          addressDetail: '123 Đường Lê Lợi',
        },
        paymentMethod: 'COD',
        couponCode: null,
        note: 'Đơn hàng 2 cho admin test',
        items: [
          {
            productId: testProduct.id,
            quantity: 1,
          },
        ],
      },
    });
    const order2Id = createOrder2.body.data?.id;

    // Admin Order Management
    const adminOrders = await request<OrderData[]>('/admin/orders?limit=20', {
      token: adminToken,
    });
    assert(
      adminOrders.status === 200 &&
        Array.isArray(adminOrders.body.data) &&
        adminOrders.body.data.some((o) => o.id === order2Id),
      '12a. Admin view All Orders (/api/admin/orders)'
    );

    if (order2Id) {
      const updateStatus = await request(`/admin/orders/${order2Id}/status`, {
        method: 'PATCH',
        token: adminToken,
        body: {
          status: 'CONFIRMED',
          note: 'Admin đã duyệt đơn hàng kiểm thử',
        },
      });
      assert(
        updateStatus.status === 200,
        '12b. Admin update Order Status (/api/admin/orders/:id/status)',
        JSON.stringify(updateStatus.body)
      );
    }

    // 13. Admin Customer Management (Get customers & toggle block)
    const adminCustomers = await request<CustomerData[]>('/admin/customers?limit=50', {
      token: adminToken,
    });
    assert(
      adminCustomers.status === 200 && Array.isArray(adminCustomers.body.data),
      '13a. Admin view Customers list (/api/admin/customers)'
    );

    const targetCustomer = adminCustomers.body.data?.find((u) => u.email === 'nam.lehoang@gmail.com');
    if (targetCustomer) {
      const toggleBlock = await request<{ isBlocked: boolean }>(`/admin/customers/${targetCustomer.id}/toggle-block`, {
        method: 'PATCH',
        token: adminToken,
      });
      assert(
        toggleBlock.status === 200 && typeof toggleBlock.body.data?.isBlocked === 'boolean',
        '13b. Admin toggle block customer (/api/admin/customers/:id/toggle-block)',
        JSON.stringify(toggleBlock.body)
      );

      // Revert back
      await request(`/admin/customers/${targetCustomer.id}/toggle-block`, {
        method: 'PATCH',
        token: adminToken,
      });
    }

    // 14. Admin Dashboard Stats
    const adminStats = await request<DashboardKpiData>('/admin/dashboard', {
      token: adminToken,
    });
    assert(
      adminStats.status === 200 && adminStats.body.data?.kpis?.totalOrders !== undefined,
      '14. Admin Dashboard Stats (/api/admin/dashboard)',
      JSON.stringify(adminStats.body)
    );

    // 15. Admin Store Settings
    const storeSettings = await request<StoreSettingsData>('/admin/settings', {
      token: adminToken,
    });
    assert(
      storeSettings.status === 200 && !!storeSettings.body.data?.storeName,
      '15. Admin Store Settings (/api/admin/settings)'
    );

  } catch (err: unknown) {
    console.error('Lỗi ngoại lệ trong quá trình chạy test:', err);
    failed++;
  }

  console.log('\n========================================');
  console.log(`Kết quả kiểm thử: ${passed} PASS, ${failed} FAIL`);
  console.log('========================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
