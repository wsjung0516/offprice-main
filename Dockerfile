FROM node:16.13-alpine as build
# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .



# 프로덕션 빌드 수행
RUN npm run build:prod

# EXPOSE 4200

# CMD ["npm", "start"]
# 실행 단계
FROM nginx:1.21-alpine

# 빌드 결과물 복사
COPY --from=build app/dist/offprice-main /usr/share/nginx/html

# Nginx 설정 파일 복사 (필요한 경우)
COPY /src/etc/nginx-custom.conf /etc/nginx/conf.d/default.conf

# 컨테이너에서 사용할 포트 설정

EXPOSE 80

# # # # Nginx 실행
CMD ["nginx", "-g", "daemon off;"]