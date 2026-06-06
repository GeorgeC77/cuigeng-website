#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
使用 env_Part 虚拟环境启动本地静态服务器预览

用于在部署到公网前，先在本地预览网站效果。

虚拟环境激活方式：
    Windows CMD:      e:\python_project\Part\env_Part\Scripts\activate.bat
    Windows PowerShell: e:\python_project\Part\env_Part\Scripts\Activate.ps1
    Git Bash:         source /e/python_project/Part/env_Part/Scripts/activate

使用方法：
    python deploy_local.py

然后浏览器访问 http://localhost:8000
"""

import os
import sys
from pathlib import Path

# 使用 Python 标准库的 http.server（无需额外安装）
from http.server import HTTPServer, SimpleHTTPRequestHandler

DIST_DIR = './dist'
PORT = 8000


def main():
    dist_path = Path(DIST_DIR)
    if not dist_path.exists():
        print(f"错误: 目录 {DIST_DIR} 不存在。")
        print("请先解压 dist.zip:")
        print("  unzip -q cuigeng-website-dist.zip")
        sys.exit(1)

    os.chdir(DIST_DIR)

    server = HTTPServer(('0.0.0.0', PORT), SimpleHTTPRequestHandler)
    print(f"\n{'='*50}")
    print(f"本地服务器已启动!")
    print(f"{'='*50}")
    print(f"访问地址: http://localhost:{PORT}")
    print(f"本机IP访问: http://127.0.0.1:{PORT}")
    print(f"\n按 Ctrl+C 停止服务器")
    print(f"{'='*50}\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")


if __name__ == '__main__':
    main()
