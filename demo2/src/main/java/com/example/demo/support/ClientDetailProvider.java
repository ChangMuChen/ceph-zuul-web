package com.example.demo.support;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.ClientRegistrationException;
import org.springframework.security.oauth2.provider.NoSuchClientException;
import org.springframework.security.oauth2.provider.client.BaseClientDetails;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

public class ClientDetailProvider implements ClientDetailsService {
    @Override
    public ClientDetails loadClientByClientId(String clientId) throws ClientRegistrationException {
        System.out.println(clientId);
        BaseClientDetails client = null;
        //这里可以改为查询数据库
        if ("client".equals(clientId)) {
            client = new BaseClientDetails();
            client.setClientId(clientId);
            client.setClientSecret(new BCryptPasswordEncoder().encode("123456"));
            client.setAuthorizedGrantTypes(Arrays.asList("authorization_code","password","refresh_token","implicit","client_credentials"));
            client.setScope(Arrays.asList("all", "select"));
            client.setAccessTokenValiditySeconds((int) TimeUnit.DAYS.toSeconds(1)); //1天
            client.setRefreshTokenValiditySeconds((int) TimeUnit.DAYS.toSeconds(1)); //1天
        }
        if (client == null) {
            throw new NoSuchClientException("No client width requested id: " + clientId);
        }
        return client;
    }
}
