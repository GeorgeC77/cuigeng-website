#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
使用 env_Part 虚拟环境部署到百度智能云 BOS

前置要求：
1. 激活 env_Part 虚拟环境
2. 在百度智能云控制台获取 Access Key ID 和 Secret Access Key
3. 创建 BOS 存储桶（Bucket），设置为公共读
4. 绑定自定义域名（可选，建议配置 CDN）

使用方法：
    python deploy_baidu.py

虚拟环境激活方式：
    Windows CMD:      e:\python_project\Part\env_Part\Scripts\activate.bat
    Windows PowerShell: e:\python_project\Part\env_Part\Scripts\Activate.ps1
    Git Bash:         source /e/python_project/Part/env_Part/Scripts/activate
"""

import os
import sys
import mimetypes
from pathlib import Path

# 百度智能云 BOS SDK
from baidubce.auth.bce_credentials import BceCredentials
from baidubce.bce_client_configuration import BceClientConfiguration
from baidubce.services.bos.bos_client import BosClient
from baidubce import bos_host

# ==================== 配置区域（请修改为你的信息）====================

# 百度智能云 Access Key
ACCESS_KEY_ID = 'your-access-key-id'
SECRET_ACCESS_KEY = 'your-secret-access-key'

# BOS 存储桶名称（全局唯一）
BUCKET_NAME = 'your-bucket-name'

# 地域 Endpoint，例如：
#   北京: bj.bcebos.com
#   广州: gz.bcebos.com
#   苏州: su.bcebos.com
#   上海: sh.bcebos.com
ENDPOINT = 'bj.bcebos.com'

# 本地构建产物目录（dist 文件夹）
DIST_DIR = './dist'

# 是否开启 CDN 刷新（如果你有 CDN 域名绑定到 BOS）
ENABLE_CDN_REFRESH = False
CDN_DOMAIN = 'your-cdn-domain.com'  # 例如: www.cuigeng.com

# ==================== 部署脚本 ====================


def get_content_type(file_path: str) -> str:
    """根据文件后缀判断 Content-Type"""
    content_type, _ = mimetypes.guess_type(file_path)
    return content_type or 'application/octet-stream'


def deploy_to_bos():
    """将 dist 文件夹部署到百度云 BOS"""
    dist_path = Path(DIST_DIR)
    if not dist_path.exists():
        print(f"错误: 目录 {DIST_DIR} 不存在。请先解压 dist.zip 或执行 npm run build")
        sys.exit(1)

    # 配置 BOS 客户端
    credentials = BceCredentials(ACCESS_KEY_ID, SECRET_ACCESS_KEY)
    config = BceClientConfiguration(
        credentials=credentials,
        endpoint=ENDPOINT
    )
    client = BosClient(config)

    # 检查存储桶是否存在
    try:
        if not client.does_bucket_exist(BUCKET_NAME):
            print(f"存储桶 {BUCKET_NAME} 不存在，正在创建...")
            client.create_bucket(BUCKET_NAME)
            print(f"存储桶 {BUCKET_NAME} 创建成功")
        else:
            print(f"存储桶 {BUCKET_NAME} 已存在")
    except Exception as e:
        print(f"访问存储桶失败: {e}")
        print("请检查 Access Key、Secret Key 和 Endpoint 是否正确")
        sys.exit(1)

    # 遍历 dist 文件夹并上传
    files = list(dist_path.rglob('*'))
    total = sum(1 for f in files if f.is_file())
    uploaded = 0
    failed = 0

    print(f"\n开始上传，共 {total} 个文件...\n")

    for file_path in files:
        if not file_path.is_file():
            continue

        # 计算相对路径作为 BOS 中的 key
        relative_path = file_path.relative_to(dist_path)
        key = str(relative_path).replace('\\', '/')  # Windows 路径兼容

        content_type = get_content_type(str(file_path))

        try:
            client.put_object_from_file(
                bucket=BUCKET_NAME,
                key=key,
                file_name=str(file_path),
                content_type=content_type
            )
            uploaded += 1
            print(f"[{uploaded}/{total}] ✓ {key}  ({content_type})")
        except Exception as e:
            failed += 1
            print(f"[{uploaded + failed}/{total}] ✗ {key}  失败: {e}")

    print(f"\n{'='*50}")
    print(f"上传完成: 成功 {uploaded} 个, 失败 {failed} 个")

    # 打印访问地址
    print(f"\nBOS 默认访问地址:")
    print(f"  http://{BUCKET_NAME}.{ENDPOINT}/index.html")

    if ENABLE_CDN_REFRESH and CDN_DOMAIN != 'your-cdn-domain.com':
        print(f"\n自定义域名访问地址:")
        print(f"  https://{CDN_DOMAIN}/")
        print(f"\n注意: 如果你配置了 CDN，需要手动刷新 CDN 缓存或等待缓存过期")

    print(f"\n{'='*50}")
    print("提示:")
    print("1. 确保存储桶的访问权限设置为 '公共读'")
    print("2. 如需自定义域名，请在 BOS 控制台绑定域名并配置 CDN")
    print("3. 国内使用自定义域名需要 ICP 备案")


if __name__ == '__main__':
    # 检查是否还是默认配置
    if ACCESS_KEY_ID == 'your-access-key-id':
        print("请先修改脚本中的 ACCESS_KEY_ID 和 SECRET_ACCESS_KEY 配置！")
        print("获取方式: 百度智能云控制台 → 安全认证 → Access Key")
        sys.exit(1)

    deploy_to_bos()
