package com.example.demo.zuulfilter;

import com.example.demo.auth.AWS4SignerBase;
import com.example.demo.auth.AWS4SignerForAuthorizationHeader;
import com.example.demo.util.BinaryUtils;
import com.example.demo.util.HttpUtils;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.netflix.zuul.filters.Route;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;
import org.springframework.web.util.UrlPathHelper;

import javax.servlet.http.HttpServletRequest;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

public class CephBeginFilter extends AbstractRouteFilter {

    private Logger logger = LoggerFactory.getLogger(CephBeginFilter.class);

    public CephBeginFilter(RouteLocator routeLocator, UrlPathHelper urlPathHelper) {
        super(routeLocator, urlPathHelper);
    }

    @Override
    public String filterType() {
        /*
        pre：可以在请求被路由之前调用
        route：在路由请求时候被调用
        post：在route和error过滤器之后被调用
        error：处理请求时发生错误时被调用
        * */
        // 前置过滤器
        return FilterConstants.ROUTE_TYPE;
    }

    @Override
    public int filterOrder() {
        //// 优先级为0，数字越大，优先级越低
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();
        Route route = route(ctx.getRequest());
        if (!route.getId().equals("ceph-upload")&&!route.getId().equals("ceph-download"))
            return false;
        if(ctx.getRequest().getMethod().toLowerCase().equals("options"))
            return false;
        return true;
    }

    //get request headers
    private Map<String, String> getHeadersInfo() {
        HttpServletRequest request = RequestContext.getCurrentContext().getRequest();
        Map<String, String> map = new HashMap<>();
        Enumeration headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }
        return map;
    }

    @Value("${ceph.accessKeyId}")
    String accessKeyId;

    @Value("${ceph.secretAccessKey}")
    String secretAccessKey;

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();

        Route route = route(ctx.getRequest());

        URL endpointUrl = null;
        try {
            endpointUrl = new URL(HttpUtils.CombinePath(route.getLocation(), route.getPath()));
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        Map<String, String> hh = getHeadersInfo();
        Map<String, String> headers = new HashMap<>();

        for (Map.Entry<String, String> et : hh.entrySet()) {
            if (et.getKey().startsWith("x-amz") || et.getKey().toLowerCase().equals("host")) {
                headers.put(et.getKey(), et.getValue());
            }
        }
        headers.remove("x-amz-date");
        headers.remove("host");
        headers.remove("authorization");

        Map<String, String[]> parameterMap = ctx.getRequest().getParameterMap();
        Map<String, String> parameters = new HashMap<>();

        for (Map.Entry<String, String[]> e : parameterMap.entrySet()) {
            for (String s : e.getValue()) {
                parameters.put(e.getKey(), s);
            }
        }

        String bodyhas = headers.get("x-amz-content-sha256");
        if (bodyhas == null || bodyhas.isEmpty()) {
            if (ctx.getRequest().getContentLength() < 1) {
                bodyhas = "UNSIGNED-PAYLOAD";
            } else {
                byte[] contentHash = AWS4SignerBase.hash(HttpUtils.readAsBytes(ctx.getRequest()));
                bodyhas = BinaryUtils.toHex(contentHash);
                headers.put("x-amz-content-sha256", bodyhas);
            }
        }

        AWS4SignerForAuthorizationHeader signer = new AWS4SignerForAuthorizationHeader(endpointUrl, ctx.getRequest().getMethod(), "s3", "default");
        String authorization = signer.computeSignature(headers,
                parameters,
                bodyhas,
                accessKeyId,
                secretAccessKey);

        ctx.addZuulRequestHeader("x-amz-date", headers.get("x-amz-date"));
        ctx.addZuulRequestHeader("authorization", authorization);
        ctx.addZuulRequestHeader("host", headers.get("host"));
        return null;
    }
}