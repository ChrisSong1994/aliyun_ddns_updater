// This file is auto-generated, don't edit it
import Dns, * as $Dns from "@alicloud/alidns20150109";
import Util from "@alicloud/tea-util";
import Env from "@alicloud/darabonba-env";
import OpenApi, * as $OpenApi from "@alicloud/openapi-client";
import Console from "@alicloud/tea-console";
import * as $tea from "@alicloud/tea-typescript";
import schedule from "node-schedule";

const IP_INFO_URL = "https://ipinfo.io/json";

export default class Client {
  /**
   * Initialization  初始化公共请求参数
   */
  static Initialization(regionId: string): Dns {
    let config = new $OpenApi.Config({});
    // 您的AccessKey ID
    // config.accessKeyId = Env.getEnv("ALICLOUD_ACCESS_KEY_ID");
    // config.accessKeySecret = Env.getEnv("ALICLOUD_ACCESS_KEY_SECRET");

    config.accessKeyId = Env.getEnv("ALICLOUD_ACCESS_KEY_ID");
    config.accessKeySecret = Env.getEnv("ALICLOUD_ACCESS_KEY_SECRET");
    // 您的可用区ID
    config.regionId = regionId;
    return new Dns(config);
  }

  /**
   * 获取主域名的所有解析记录列表
   */
  static async DescribeDomainRecords(
    client: Dns,
    domainName: string,
    RR: string,
    recordType: string
  ): Promise<$Dns.DescribeDomainRecordsResponse> {
    let req = new $Dns.DescribeDomainRecordsRequest({});
    // 主域名
    req.domainName = domainName;
    // 主机记录
    req.RRKeyWord = RR;
    // 解析记录类型
    req.type = recordType;
    try {
      let resp = await client.describeDomainRecords(req);
      Console.log(
        "-------------------获取主域名的所有解析记录列表--------------------"
      );
      Console.log(Util.toJSONString($tea.toMap(resp)));
      return resp;
    } catch (error) {
      Console.log(error.message);
    }
    return null;
  }

  /**
   * 修改解析记录
   */
  static async UpdateDomainRecord(
    client: Dns,
    req: $Dns.UpdateDomainRecordRequest
  ): Promise<void> {
    try {
      let resp = await client.updateDomainRecord(req);
      Console.log("-------------------修改解析记录--------------------");
      Console.log(Util.toJSONString($tea.toMap(resp)));
    } catch (error) {
      Console.log(error.message);
    }
  }

  static async main(args: any): Promise<void> {
    const { regionid, domainName, RR, recordType } = args;
    let client = Client.Initialization(regionid);
    let resp = await Client.DescribeDomainRecords(
      client,
      domainName,
      RR,
      recordType
    );
    if (
      Util.isUnset($tea.toMap(resp)) ||
      Util.isUnset($tea.toMap(resp.body.domainRecords.record[0]))
    ) {
      Console.log("错误参数！");
      return;
    }

    let record = resp.body.domainRecords.record[0];
    // 记录ID
    let recordId = record.recordId;
    // 记录值
    let recordsValue = record.value;
    try {
      const ipinfo: any = await fetch(IP_INFO_URL).then((res) => res.json());
      const currentHostIP = ipinfo.ip;
      Console.log(
        `-------------------当前主机公网IP为：${currentHostIP}--------------------`
      );
      if (!Util.equalString(currentHostIP, recordsValue)) {
        // 修改解析记录
        let req = new $Dns.UpdateDomainRecordRequest({});
        // 主机记录
        req.RR = RR;
        // 记录ID
        req.recordId = recordId;
        // 将主机记录值改为当前主机IP
        req.value = currentHostIP;
        // 解析记录类型
        req.type = recordType;
        await Client.UpdateDomainRecord(client, req);
      }
    } catch (error) {
      Console.log(error.message);
    }
  }
}

// Client.main(process.argv.slice(2));

const MY_ALIYUN_CONFIG = {
  regionid: "cn-hangzhou", // 区域id
  // currentHostIP: "125.119.200.220", // 主机ip
  domainName: "chrissong.top", // 域名
  RR: "home", // 解析主机
  recordType: "A", // 记录类型
};

Client.main(MY_ALIYUN_CONFIG);

// 每半个小时执行一次
schedule.scheduleJob("*/30 * * * *", function () {
  Console.log(
    "------------------- 阿里云 ddns 解析程序执行！--------------------"
  );
  Client.main(MY_ALIYUN_CONFIG);
});
