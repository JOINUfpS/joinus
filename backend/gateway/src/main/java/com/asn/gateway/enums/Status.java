package com.asn.gateway.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Status {
    ACTIVO,
    INACTIVO;

    @JsonValue
    public String getValue() {
        return this.name();
    }

    @JsonCreator
    public static Status fromValue(String value) throws Exception {
        if (value != null && !value.isEmpty()) {
            for (Status status : values()) {
                if (status.name().equals(value)) {
                    return status;
                }
            }
        }
        throw new Exception();
    }

}
