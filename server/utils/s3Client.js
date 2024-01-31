import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import { ProxyAgent } from "proxy-agent";

const config = useRuntimeConfig();
const agent = new ProxyAgent();
const s3Client = new S3Client(
  {
    requestHandler: new NodeHttpHandler({
      httpAgent: agent,
      httpsAgent: agent,
    }),
   region: config.region 
  });

export default s3Client;
