FROM --platform=linux/amd64 node:20

# 创建工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json（如果有）到工作目录
COPY package*.json ./
COPY ./dist ./dist

# 安装依赖
RUN npm i

# 执行程序
CMD [ "node","./dist/index.js" ]