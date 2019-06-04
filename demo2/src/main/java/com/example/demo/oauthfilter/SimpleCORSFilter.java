package com.example.demo.oauthfilter;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class SimpleCORSFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
//        httpServletRequest.setCharacterEncoding("utf-8");
//        httpServletResponse.setCharacterEncoding("utf-8");
        httpServletResponse.setHeader("Access-Control-Allow-Origin", "*");//允许所以域名访问，
//        httpServletResponse.setHeader("Access-Control-Allow-Methods", "*");//允许的访问方式
//        httpServletResponse.setHeader("Access-Control-Allow-Headers", "*");
//        httpServletResponse.setHeader("Access-Control-Request-Headers", "*");
//        httpServletResponse.setHeader("Access-Control-Request-Method", "*");
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }
}