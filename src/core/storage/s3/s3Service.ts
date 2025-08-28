import { HttpException, Injectable } from "@nestjs/common";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { v4 as generateUuid } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3Service extends S3Client {
  private bucketName: string;

  constructor(private configS: ConfigService) {
    const config: S3ClientConfig = {
      region: configS.get<string>("AWS_REGION") || "eu-north-1",
      credentials: {
        accessKeyId: configS.get<string>("AWS_ACCESS_KEY") || "",
        secretAccessKey: configS.get<string>("AWS_SECRET_ACCESS_KEY") || "",
      },
    };

    super(config);
    this.bucketName = configS.get<string>("AWS_BUCKET") || "";
  }

  async uploadFile(file: Express.Multer.File, prefix: string) {
    const fileName = `${prefix}/${generateUuid()}`;
    const cmd = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    const response = await this.send(cmd);

    if (response.$metadata.httpStatusCode === 200) {
      return fileName;
    }
    throw new HttpException("File upload failed", 500);
  }

  async getFileUrl(key: string): Promise<string> {
    const cmd = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return await getSignedUrl(this, cmd, { expiresIn: 3600 * 24 });
  }
}
