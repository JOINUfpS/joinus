package com.asn.gateway.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.asn.gateway.enums.StatusToken;
import lombok.Data;

@Data
public class StatusTokenDto {

    @JsonAlias("status_token")
    private StatusToken statusToken;

}
