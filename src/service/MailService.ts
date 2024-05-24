import nodemailer, { Transporter } from 'nodemailer';
import { InternalServerError } from '../errors/InternalServerError';

export class MailService {

    private static transporter: Transporter;

    constructor() {
        MailService.getTransporter();
    }

    private static getTransporter() {
        if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) throw new InternalServerError("Can't find env variable");
        if (MailService.transporter) return;
        MailService.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number.parseInt(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to: string, link: string) {
        MailService.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Email activation on " + process.env.APP_BASE_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>Follow the link to confirm email</h1>
                        <a href=${link}>${link}</a>
                    </div>
                `

        })
    }
}

const mailService = new MailService();

export default mailService;