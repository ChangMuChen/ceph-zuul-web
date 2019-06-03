package com.example.demo;

import com.netflix.zuul.ZuulFilter;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UrlPathHelper;

@Component
public class ZuulFilterConfig {

    @Bean
    public ZuulFilter beginFilter(RouteLocator routeLocator){
        return new BeginFilter(routeLocator,new UrlPathHelper());
    }

    @Bean
    public ZuulFilter endFilter(RouteLocator routeLocator){
        return new EndFilter(routeLocator,new UrlPathHelper());
    }
}

