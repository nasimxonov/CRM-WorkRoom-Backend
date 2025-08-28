import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
@Injectable()
export class EskizService {
  get_token_url: string;
  send_sms_url: string;
  private email: string;
  private password: string;
  private token: string;
  constructor(private configService: ConfigService) {
    this.get_token_url = this.configService.get(
      'ESKIZ_GET_TOKEN_URL',
    ) as string;
    this.send_sms_url = this.configService.get('ESKIZ_SEND_SMS_URL') as string;
    this.email = this.configService.get('ESKIZ_EMAIL') as string;
    this.password = this.configService.get('ESKIZ_PASSWORD') as string;
  }
  async getToken() {
    const formData = new FormData();
    formData.set('email', this.email);
    formData.set('password', this.password);
    const {
      data: {
        data: { token },
      },
    } = await axios.post(this.get_token_url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    this.token = token;
  }
  async sendSms(phone_number: string, otp: string) {
    await this.getToken();
    const message = `StudyHub ilovasiga kirish kodi:${otp}`;
    const formData = new FormData();
    formData.set('mobile_phone', phone_number);
    formData.set('message', message);
    formData.set('from', '4546');
    const { status } = await axios.post(this.send_sms_url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (status !== 200) throw new Error('send sms failed');
  }
}
