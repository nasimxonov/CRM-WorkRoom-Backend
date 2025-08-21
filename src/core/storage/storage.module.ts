import { Global, Module } from "@nestjs/common";
import { S3Service } from "./s3/s3Service";

@Global()
@Module({
  providers: [S3Service],
  controllers: [],
  exports: [S3Service],
})
export class StorageModule {}
