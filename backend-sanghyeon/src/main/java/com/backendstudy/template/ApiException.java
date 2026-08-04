package com.backendstudy.template;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    // 아직 구현하지 않은 엔드포인트에서 임시로 던지는 예외.
    // TODO를 채워나가면서 이 메서드 호출을 실제 로직으로 바꿔주세요.
    public static ApiException todo(String where) {
        return new ApiException(HttpStatus.NOT_IMPLEMENTED, "TODO: " + where + " 를 구현하세요.");
    }
}
