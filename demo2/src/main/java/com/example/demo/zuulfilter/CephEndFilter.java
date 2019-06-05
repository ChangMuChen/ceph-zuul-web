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
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.InputStream;
import java.io.StringWriter;
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

    @Override
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();
        Route route = route(ctx.getRequest());
        if (!route.getId().equals("cephroute"))
            return false;
        if (ctx.getRequest().getMethod().toLowerCase().equals("options"))
            return false;

        List<Pair<String, String>> headers = ctx.getZuulResponseHeaders();
        boolean havedown = false;
        fileversion = "";
        for (Pair<String, String> header : headers) {
            if (header.first().toLowerCase().equals("x-amz-version-id")) {
                havedown = true;
                fileversion = header.second();
            }
        }
        return havedown;
    }

    @Override
    public Object run() {

        RequestContext context = RequestContext.getCurrentContext();
        //context.addZuulRequestHeader("Access-Control-Allow-Origin", "*");

        if (context.getRequest().getMethod().toLowerCase().equals(HttpSender.Method.GET.toString().toLowerCase()))
            return null;
        try {

            DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = builderFactory.newDocumentBuilder();

            InputStream stream = context.getResponseDataStream();
            if (stream.getClass().equals(EmptyInputStream.class)) {
                return null;
            }
            Document document = builder.parse(stream);

            NodeList nodeList = document.getElementsByTagName("Location");
            if (nodeList == null || nodeList.getLength() < 1) return null;

            Node element = nodeList.item(0);

            element.setTextContent(context.getRequest().getRequestURL().toString() + (fileversion.isEmpty() ? "" : ("?versionId=" + fileversion)));

            TransformerFactory tf = TransformerFactory.newInstance();
            Transformer transformer = tf.newTransformer();
            DOMSource source = new DOMSource(document);
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            StringWriter writer = new StringWriter();
            StreamResult result = new StreamResult(writer);
            transformer.transform(source, result);
            String returnStr = writer.getBuffer().toString();

            context.setResponseBody(returnStr);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}