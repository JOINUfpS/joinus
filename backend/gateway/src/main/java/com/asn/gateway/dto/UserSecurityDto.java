package com.asn.gateway.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

import java.util.List;

@Data
public class UserSecurityDto {

    private UserDto user;
    @JsonAlias("user_role")
    private List<String> userRole;
    @JsonAlias("user_role_structure")
    private List<Object> userRoleStructure;

}
