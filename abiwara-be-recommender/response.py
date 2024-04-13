import time

class BaseResponse:
    def __init__(self, code: int, status: str) -> None:
        self.code = code 
        self.status = status

class Response(BaseResponse):
    def __init__(self, code: int, status: str, data: any, meta: any) -> None:
        super(Response, self).__init__(code, status)
        self.data = data
        self.timestamp = time.time_ns()
        self.meta = meta

class ErrorResponse(BaseResponse):
    def __init__(self, code: int, status: str, message: str) -> None:
        super(ErrorResponse, self).__init__(code, status)
        self.message = message
