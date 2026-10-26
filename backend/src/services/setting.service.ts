import { prisma } from '../config/prisma.js';

export class SettingService {
  // 1. Get Store Settings
  static async getSettings() {
    let setting = await prisma.storeSetting.findUnique({
      where: { id: 'default' },
    });

    if (!setting) {
      setting = await prisma.storeSetting.create({
        data: {
          id: 'default',
          storeName: 'NOVA Commerce',
          hotline: '1900 6868',
          email: 'support@nova.vn',
          address: 'Tầng 18, Keangnam Landmark 72, Đường Phạm Hùng, Q. Cầu Giấy, Hà Nội',
          standardShippingFee: 30000,
          freeShippingThreshold: 2000000,
        },
      });
    }

    return setting;
  }

  // 2. Submit Contact Message
  static async submitContact(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    const contact = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      },
    });

    return {
      message: 'Cảm ơn bạn đã liên hệ với NOVA Commerce! Đội ngũ hỗ trợ sẽ phản hồi trong 24 giờ làm việc.',
      contactId: contact.id,
    };
  }

  // 3. Subscribe Newsletter
  static async subscribeNewsletter(email: string) {
    // Record contact message inquiry for newsletter
    await prisma.contactMessage.create({
      data: {
        name: 'Đăng Ký Bản Tin',
        email,
        subject: 'Đăng Ký Nhận Bản Tin Khuyến Mãi',
        message: `Khách hàng đăng ký nhận tin từ email: ${email}`,
      },
    });

    return {
      message: 'Đăng ký nhận bản tin thành công! Bạn sẽ nhận được các ưu đãi công nghệ sớm nhất.',
    };
  }
}
