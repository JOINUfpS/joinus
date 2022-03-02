package com.asn.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TokenRequestDto {

    @JsonProperty("access_token")
    private String accessToken;

}
