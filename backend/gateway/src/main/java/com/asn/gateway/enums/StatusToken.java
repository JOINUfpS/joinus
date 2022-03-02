package com.asn.gateway.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusToken {
    EXPIRADO,
    INVALIDO;

    @JsonValue
    public String getValue() {
        return this.name();
    }

    @JsonCreator
    public static StatusToken fromValue(String value) throws Exception {
        if (value != null && !value.isEmpty()) {
            for (StatusToken status : values()) {
                if (status.name().equals(value)) {
                    return status;
                }
            }
        }
        throw new Exception();
    }

}
