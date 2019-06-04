package com.example.demo.zuulfilter;

import com.netflix.zuul.ZuulFilter;
import org.springframework.cloud.netflix.zuul.filters.Route;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.web.util.UrlPathHelper;

import javax.servlet.http.HttpServletRequest;

public abstract class AbstractRouteFilter extends ZuulFilter {

    private final RouteLocator routeLocator;
    private final UrlPathHelper urlPathHelper;

    AbstractRouteFilter(RouteLocator routeLocator,UrlPathHelper urlPathHelper){
        this.routeLocator = routeLocator;
        this.urlPathHelper = urlPathHelper;
    }
    //核心逻辑，获取请求路径，利用RouteLocator返回路由信息
    protected Route route(HttpServletRequest request){
        String requestURI = urlPathHelper.getPathWithinApplication(request);
        return routeLocator.getMatchingRoute(requestURI);
    }
}
