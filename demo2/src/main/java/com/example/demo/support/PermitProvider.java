package com.example.demo.support;

import org.springframework.stereotype.Component;

@Component
public class PermitProvider {
    public String[] getpermiturls() {
        return new String[]{"/actuator/**", "/**/favicon.ico", "/login","/webjars/**", "/resources/**", "/favicon.ico", "/assets/**", "/css/**", "/js/**", "/plugins/**"};
    }
}
