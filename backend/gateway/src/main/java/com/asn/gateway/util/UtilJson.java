package com.asn.gateway.util;

import com.fasterxml.jackson.databind.ObjectMapper;

public final class UtilJson {
    private UtilJson() {
    }

    public static <T> T toObject(String json, Class<T> type) {
        ObjectMapper mapperObj = new ObjectMapper();
        mapperObj.findAndRegisterModules();

        try {
            return mapperObj.readValue(json, type);
        } catch (Exception e) {
            return null;
        }
    }

    public static String toString(Object object) {
        ObjectMapper mapperObj = new ObjectMapper();
        mapperObj.findAndRegisterModules();

        try {
            return mapperObj.writeValueAsString(object);
        } catch (Exception e) {
            return null;
        }
    }
}
