package com.example.demo.zuulfilter;

import com.netflix.util.Pair;
import com.netflix.zuul.context.RequestContext;
import io.micrometer.core.ipc.http.HttpSender;
import org.apache.http.impl.io.EmptyInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.netflix.zuul.filters.Route;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;
import org.springframework.web.util.UrlPathHelper;
import org.w3c.dom.Document;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.net.URLDecoder;
import java.util.List;

public class CephEndFilter extends AbstractRouteFilter {

    private Logger logger = LoggerFactory.getLogger(CephEndFilter.class);

    public CephEndFilter(RouteLocator routeLocator, UrlPathHelper urlPathHelper) {
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
        return FilterConstants.POST_TYPE;
    }

    @Override
    public int filterOrder() {
        //// 优先级为0，数字越大，优先级越低
        return 0;
    }

    String fileversion;
    String etagheader;

    @Override
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();
        Route route = route(ctx.getRequest());
        if (!route.getId().equals("ceph-upload") && !route.getId().equals("ceph-download"))
            return false;
        if (ctx.getRequest().getMethod().toLowerCase().equals("options"))
            return false;
        if (ctx.getRequest().getMethod().toLowerCase().equals("get"))
            return false;

        List<Pair<String, String>> headers = ctx.getZuulResponseHeaders();
        boolean havedown = false;
        fileversion = "";
        for (Pair<String, String> header : headers) {
            if (header.first().toLowerCase().equals("x-amz-version-id")) {
                havedown = true;
                fileversion = header.second();
            }
            if (header.first().toLowerCase().equals("etag")) {
                etagheader = header.second();
            }
        }
        return havedown;
    }

    @Override
    public Object run() {
        RequestContext context = RequestContext.getCurrentContext();

        if (context.getRequest().getMethod().toLowerCase().equals(HttpSender.Method.GET.toString().toLowerCase()))
            return null;
        try {
            String requesturl = context.getRequest().getRequestURL().toString();
            requesturl = requesturl.replaceFirst("ceph-upload", "ceph-download");
            String location = requesturl + (fileversion.isEmpty() ? "" : "?versionId=" + fileversion);
            String bucket = "ceph";
            String key;
            String etag;

            if (etagheader != null && !etagheader.isEmpty()) {
                etag = etagheader;
                String[] temp = URLDecoder.decode(context.getRequest().getRequestURI(), "UTF-8").split("/");
                key = temp[temp.length - 1];
            } else {
                DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = builderFactory.newDocumentBuilder();

                InputStream stream = context.getResponseDataStream();
                if (stream.getClass().equals(EmptyInputStream.class)) {
                    return null;
                }
                Document document = builder.parse(stream);
                etag = document.getElementsByTagName("ETag").item(0).getTextContent();
                key = document.getElementsByTagName("Key").item(0).getTextContent();
            }
            context.getResponse().setCharacterEncoding("UTF-8");
            context.setResponseBody("<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<CompleteMultipartUploadResult xmlns=\"http://s3.amazonaws.com/doc/2006-03-01/\">" +
                    "<Location>" + location + "</Location>" +
                    "<Bucket>" + bucket + "</Bucket>" +
                    "<Key>" + key + "</Key>" +
                    "<ETag>" + etag + "</ETag>" +
                    "</CompleteMultipartUploadResult>");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}