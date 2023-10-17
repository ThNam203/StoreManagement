package com.springboot.store.exception;

import org.springframework.http.HttpStatus;

public class StaffAPIException extends RuntimeException{
    private String message;
    private HttpStatus httpStatus;

    public StaffAPIException(String message, HttpStatus httpStatus){
        super(message);
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

}
