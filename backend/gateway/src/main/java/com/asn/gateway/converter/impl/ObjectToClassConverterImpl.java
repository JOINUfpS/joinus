package com.asn.gateway.converter.impl;

import com.asn.gateway.converter.ObjectToClassConverter;
import com.asn.gateway.util.UtilJson;
import org.springframework.stereotype.Component;

@Component
public class ObjectToClassConverterImpl implements ObjectToClassConverter {

    @Override
    public <T> T objectToClass(Object object, Class<T> type) {
        String json = UtilJson.toString(object);
        return UtilJson.toObject(json, type);
    }

}
