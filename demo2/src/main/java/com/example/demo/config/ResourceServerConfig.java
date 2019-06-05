package com.example.demo.config;

import com.example.demo.oauthfilter.MyFilterSecurityInterceptor;
import com.example.demo.oauthfilter.SimpleCORSFilter;
import com.example.demo.support.PermitProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;

@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

    @Value("${security.oauth2.client.clientId}")
    private String clientId;

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        resources.resourceId(clientId).stateless(false);
    }

    @Autowired
    private MyFilterSecurityInterceptor myFilterSecurityInterceptor;

    @Autowired
    private PermitProvider permitProvider;
    @Autowired
    private SimpleCORSFilter simpleCORSFilter;

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers(permitProvider.getpermiturls()).permitAll()
                .anyRequest().authenticated()   // 其他地址的访问均需验证权限
                .and()
                .cors()
                .and()
                //.addFilterBefore(simpleCORSFilter, SecurityContextPersistenceFilter.class)
                .addFilterBefore(myFilterSecurityInterceptor, FilterSecurityInterceptor.class)
                .csrf().disable()
        ;
    }
}