package com.asn.gateway.client;

import com.asn.gateway.dto.ResponseDto;
import com.asn.gateway.dto.TokenRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient("${client.name.security}")
@RequestMapping({"/api/security"})
public interface SecurityClient {

    @PostMapping(value = "/user-from-token/")
    ResponseDto getUserFromToken(@RequestBody TokenRequestDto tokenRequestDto);

}
