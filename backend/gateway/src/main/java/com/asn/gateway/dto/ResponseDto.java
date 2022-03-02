package com.asn.gateway.dto;

import lombok.Data;

@Data
public class ResponseDto {

    private Boolean status;
    private String message;
    private Object data;
    private Object errors;

}
