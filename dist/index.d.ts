import Dns, * as $Dns from "@alicloud/alidns20150109";
export default class Client {
    /**
     * Initialization  初始化公共请求参数
     */
    static Initialization(regionId: string): Dns;
    /**
     * 获取主域名的所有解析记录列表
     */
    static DescribeDomainRecords(client: Dns, domainName: string, RR: string, recordType: string): Promise<$Dns.DescribeDomainRecordsResponse>;
    /**
     * 修改解析记录
     */
    static UpdateDomainRecord(client: Dns, req: $Dns.UpdateDomainRecordRequest): Promise<void>;
    static main(): Promise<void>;
}
