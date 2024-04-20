# aliyun_ddns_server

阿里云动态域名解析服务

## 构建 docker 镜像

```bash

```

## 使用

启动 docker 需要配置环境变量

```bash
ALICLOUD_ACCESS_KEY_ID  # 阿里云 accessKeyId
ALICLOUD_ACCESS_KEY_SECRET # 阿里云 accessKeySecret
DOMAIN_NAME # 修改的主域名
RR  # 修改的子域名
REGION_ID  # 阿里云区域 默认 cn-hangzhou
RECORD_TYPE # 域名记录类型 默认 A
```
