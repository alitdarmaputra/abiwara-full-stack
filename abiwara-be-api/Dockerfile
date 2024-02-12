FROM golang:alpine
RUN apk update && apk add --no-cache git
WORKDIR /app
ENV TZ=Asia/Singapore
COPY . .
RUN go mod tidy
RUN cd cmd/api && go build -o binary
ENTRYPOINT [ "cmd/api/binary" ]
