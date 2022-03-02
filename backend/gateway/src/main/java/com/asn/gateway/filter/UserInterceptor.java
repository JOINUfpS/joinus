package com.asn.gateway.filter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import com.asn.gateway.client.SecurityClient;
import com.asn.gateway.converter.ObjectToClassConverter;
import com.asn.gateway.dto.ResponseDto;
import com.asn.gateway.dto.StatusTokenDto;
import com.asn.gateway.dto.TokenRequestDto;
import com.asn.gateway.dto.UserSecurityDto;
import com.asn.gateway.util.UtilJson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

@Component
public class UserInterceptor extends ZuulFilter {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private SecurityClient securityClient;

    @Autowired
    private ObjectToClassConverter objectToClassConverter;

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 2;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() throws ZuulException {
        RequestContext requestContext = RequestContext.getCurrentContext();
        HttpServletRequest request = requestContext.getRequest();

        String headerAuthorization = request.getHeader("Authorization");
        logger.info("-> header -> '{}'", headerAuthorization);
        if (Objects.nonNull(headerAuthorization)) {
            try {
                TokenRequestDto tokenRequestDto = new TokenRequestDto();
                headerAuthorization = headerAuthorization.split(" ")[1];
                tokenRequestDto.setAccessToken(headerAuthorization);
                ResponseDto responseDto = securityClient.getUserFromToken(tokenRequestDto);
                if (!responseDto.getStatus()) {
                    StatusTokenDto statusTokenDto = objectToClassConverter.objectToClass(responseDto.getData(), StatusTokenDto.class);
                    String statusTokenJson = UtilJson.toString(statusTokenDto.getStatusToken());
                    requestContext.addZuulRequestHeader("Authorization", statusTokenJson);
                    return null;
                }
                UserSecurityDto userSecurityDto = objectToClassConverter.objectToClass(responseDto.getData(), UserSecurityDto.class);
                String userSecurityDtoJson = UtilJson.toString(responseDto.getData());
                byte[] bytes = userSecurityDtoJson.getBytes(StandardCharsets.US_ASCII);
                userSecurityDtoJson = new String(bytes, StandardCharsets.US_ASCII);
                requestContext.addZuulRequestHeader("Authorization", userSecurityDtoJson);
                logger.info("-> usuario -> '{}'", userSecurityDto);
            } catch (Exception e) {
                logger.info("-> token no validado");
                return null;
            }
        }
        return null;
    }

}
