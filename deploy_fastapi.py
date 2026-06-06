#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
使用 env_Part 虚拟环境的 FastAPI 启动本地静态服务器

如果你的 env_Part 中有 FastAPI，可以使用这个脚本，
支持自动重载、更好的性能，适合开发调试。

虚拟环境激活方式：
    Windows CMD:      e:\python_project\Part\env_Part\Scripts\activate.bat
    Windows PowerShell: e:\python_project\Part\env_Part\Scripts\Activate.ps1
    Git Bash:         source /e/python_project/Part/env_Part/Scripts/activate

使用方法：
    python deploy_fastapi.py

然后浏览器访问 http://localhost:8000
"""

import os
import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

DIST_DIR = './dist'
PORT = 8000

dist_path = Path(DIST_DIR)
if not dist_path.exists():
    print(f"错误: 目录 {DIST_DIR} 不存在。请先解压 dist.zip")
    sys.exit(1)

os.chdir(DIST_DIR)

app = FastAPI()

# 挂载静态文件
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

# 图片等静态资源
for item in Path('.').iterdir():
    if item.is_dir() and item.name != 'assets':
        app.mount(f"/{item.name}", StaticFiles(directory=item.name), name=item.name)


@app.get("/")
def serve_index():
    return FileResponse("index.html")


@app.get("/{path:path}")
def serve_spa(path: str):
    """单页应用路由回退"""
    if Path(path).exists() and Path(path).is_file():
        return FileResponse(path)
    return FileResponse("index.html")


if __name__ == '__main__':
    print(f"\n{'='*50}")
    print(f"FastAPI 本地服务器已启动!")
    print(f"{'='*50}")
    print(f"访问地址: http://localhost:{PORT}")
    print(f"按 Ctrl+C 停止服务器")
    print(f"{'='*50}\n")
    uvicorn.run(app, host='0.0.0.0', port=PORT)
