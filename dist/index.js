"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This file is auto-generated, don't edit it
const alidns20150109_1 = __importStar(require("@alicloud/alidns20150109")), $Dns = alidns20150109_1;
const tea_util_1 = __importDefault(require("@alicloud/tea-util"));
const darabonba_env_1 = __importDefault(require("@alicloud/darabonba-env"));
const $OpenApi = __importStar(require("@alicloud/openapi-client"));
const tea_console_1 = __importDefault(require("@alicloud/tea-console"));
const $tea = __importStar(require("@alicloud/tea-typescript"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const IP_INFO_URL = "https://ipinfo.io/json";
class Client {
    /**
     * Initialization  初始化公共请求参数
     */
    static Initialization(regionId) {
        let config = new $OpenApi.Config({});
        // 您的AccessKey ID
        // config.accessKeyId = Env.getEnv("ALICLOUD_ACCESS_KEY_ID");
        // config.accessKeySecret = Env.getEnv("ALICLOUD_ACCESS_KEY_SECRET");
        config.accessKeyId = darabonba_env_1.default.getEnv("ALICLOUD_ACCESS_KEY_ID");
        config.accessKeySecret = darabonba_env_1.default.getEnv("ALICLOUD_ACCESS_KEY_SECRET");
        // 您的可用区ID
        config.regionId = regionId;
        return new alidns20150109_1.default(config);
    }
    /**
     * 获取主域名的所有解析记录列表
     */
    static async DescribeDomainRecords(client, domainName, RR, recordType) {
        let req = new $Dns.DescribeDomainRecordsRequest({});
        // 主域名
        req.domainName = domainName;
        // 主机记录
        req.RRKeyWord = RR;
        // 解析记录类型
        req.type = recordType;
        try {
            let resp = await client.describeDomainRecords(req);
            tea_console_1.default.log("-------------------获取主域名的所有解析记录列表--------------------");
            tea_console_1.default.log(tea_util_1.default.toJSONString($tea.toMap(resp)));
            return resp;
        }
        catch (error) {
            tea_console_1.default.log(error.message);
        }
        return null;
    }
    /**
     * 修改解析记录
     */
    static async UpdateDomainRecord(client, req) {
        try {
            let resp = await client.updateDomainRecord(req);
            tea_console_1.default.log("-------------------修改解析记录--------------------");
            tea_console_1.default.log(tea_util_1.default.toJSONString($tea.toMap(resp)));
        }
        catch (error) {
            tea_console_1.default.log(error.message);
        }
    }
    static async main(args) {
        const { regionid, domainName, RR, recordType } = args;
        let client = Client.Initialization(regionid);
        let resp = await Client.DescribeDomainRecords(client, domainName, RR, recordType);
        if (tea_util_1.default.isUnset($tea.toMap(resp)) ||
            tea_util_1.default.isUnset($tea.toMap(resp.body.domainRecords.record[0]))) {
            tea_console_1.default.log("错误参数！");
            return;
        }
        let record = resp.body.domainRecords.record[0];
        // 记录ID
        let recordId = record.recordId;
        // 记录值
        let recordsValue = record.value;
        try {
            const ipinfo = await fetch(IP_INFO_URL).then((res) => res.json());
            const currentHostIP = ipinfo.ip;
            tea_console_1.default.log(`-------------------当前主机公网IP为：${currentHostIP}--------------------`);
            if (!tea_util_1.default.equalString(currentHostIP, recordsValue)) {
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
        }
        catch (error) {
            tea_console_1.default.log(error.message);
        }
    }
}
exports.default = Client;
// Client.main(process.argv.slice(2));
const MY_ALIYUN_CONFIG = {
    regionid: "cn-hangzhou",
    // currentHostIP: "125.119.200.220", // 主机ip
    domainName: "chrissong.top",
    RR: "home",
    recordType: "A",
};
Client.main(MY_ALIYUN_CONFIG);
// 每半个小时执行一次
node_schedule_1.default.scheduleJob("*/30 * * * *", function () {
    tea_console_1.default.log("------------------- 阿里云 ddns 解析程序执行！--------------------");
    Client.main(MY_ALIYUN_CONFIG);
});
//# sourceMappingURL=index.js.map