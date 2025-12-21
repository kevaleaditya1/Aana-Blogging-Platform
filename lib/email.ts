import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Aanaa Blog <newsletter@aanaa.blog>',
            to: [email],
            subject: 'Welcome to Aanaa Blog! 🎉',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Aanaa Blog! 🎉</h1>
                        </div>
                        <div class="content">
                            <p>Hi there!</p>
                            
                            <p>Thanks for subscribing to our newsletter! You're now part of an exclusive community of tech enthusiasts who get the latest updates delivered straight to their inbox.</p>
                            
                            <p><strong>What to expect:</strong></p>
                            <ul>
                                <li>📱 Latest tech news and reviews</li>
                                <li>🔥 Trending gadgets and innovations</li>
                                <li>💡 Expert guides and tutorials</li>
                                <li>🎁 Exclusive content for subscribers</li>
                            </ul>
                            
                            <p>We'll send you a weekly digest every Friday with the best content from the week.</p>
                            
                            <div style="text-align: center;">
                                <a href="https://aanaa.blog" class="button">Visit Aanaa Blog</a>
                            </div>
                            
                            <p>Stay curious!</p>
                            <p><strong>The Aanaa Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>You're receiving this because you subscribed to Aanaa Blog.</p>
                            <p>Don't want these emails? <a href="https://aanaa.blog/unsubscribe">Unsubscribe</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error };
    }
}
