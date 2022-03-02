package com.asn.gateway.converter;

public interface ObjectToClassConverter {

    <T> T objectToClass(Object object, Class<T> type);

}
