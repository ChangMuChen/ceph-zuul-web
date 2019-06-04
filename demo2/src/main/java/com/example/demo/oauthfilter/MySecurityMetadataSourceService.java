package com.example.demo.oauthfilter;

import com.example.demo.support.PermitProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Service
public class MySecurityMetadataSourceService implements FilterInvocationSecurityMetadataSource {

    private Map<AntPathRequestMatcher, Collection<ConfigAttribute>> requestMap;
    private AntPathRequestMatcher[] permitMap;
    private boolean inited;
    @Autowired
    private PermitProvider permitProvider;

    private void initMap() {
        this.requestMap = new HashMap<>();

        AntPathRequestMatcher matcher = new AntPathRequestMatcher("/**/api/**");
        SecurityConfig config = new SecurityConfig("user");
        ArrayList<ConfigAttribute> configs = new ArrayList<>();
        configs.add(config);
        this.requestMap.put(matcher, configs);

        AntPathRequestMatcher matcher2 = new AntPathRequestMatcher("/**/user/**");
        SecurityConfig config2 = new SecurityConfig("user");
        ArrayList<ConfigAttribute> configs2 = new ArrayList<>();
        configs2.add(config2);
        this.requestMap.put(matcher2, configs2);

        AntPathRequestMatcher matcher3 = new AntPathRequestMatcher("/**/ceph/**");
        SecurityConfig config3 = new SecurityConfig("user");
        ArrayList<ConfigAttribute> configs3 = new ArrayList<>();
        configs3.add(config3);
        this.requestMap.put(matcher3, configs3);

        String[] urls = permitProvider.getpermiturls();

        if (urls != null && urls.length > 0) {
            permitMap = new AntPathRequestMatcher[urls.length];
            for (int i = 0; i < urls.length; i++) {
                permitMap[i] = new AntPathRequestMatcher(urls[i]);
            }
        } else {
            permitMap = new AntPathRequestMatcher[0];
        }
    }

    @Override
    public Collection<ConfigAttribute> getAttributes(Object object) throws IllegalArgumentException {
        if (!inited) {
            initMap();
            inited = true;
        }

        if (requestMap == null || requestMap.isEmpty()) return null;

        HttpServletRequest request = ((FilterInvocation) object).getHttpRequest();

        if (ispermitMatched(request))
            return null;

        for (Map.Entry<AntPathRequestMatcher, Collection<ConfigAttribute>> entry : requestMap.entrySet()) {
            if (entry.getKey().matches(request)) {
                return entry.getValue();
            }
        }

        SecurityConfig config2 = new SecurityConfig("MSIADDSADSADSADSADAS");
        Collection<ConfigAttribute> configs2 = new ArrayList<>();
        configs2.add(config2);
        return configs2;
    }

    @Override
    public Collection<ConfigAttribute> getAllConfigAttributes() {
        return null;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return true;
    }

    private boolean ispermitMatched(HttpServletRequest request) {

        if (permitMap == null || permitMap.length < 1) return false;

        for (AntPathRequestMatcher matcher1 : this.permitMap) {
            if (matcher1.matches(request)) {
                return true;
            }
        }
        return false;
    }
}
