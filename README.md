# ceph-zuul-web
通过zuul代理ceph网关，并在zuul中动态签名。目的是防止web直接上传文件到ceph时暴露key等敏感信息。通过扩展zuul的权限管理，可以灵活的进行ceph的权限管理。

## demo
这是web项目
## demo2
这是zuul 项目

CEPH 安装：
https://github.com/ChangMuChen/DevOps/tree/master/CEPH%E5%88%86%E5%B8%83%E5%BC%8F%E5%AD%98%E5%82%A8%E7%B3%BB%E7%BB%9F

# CEPH - CORS Config
```xml
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <CORSRule>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
  </CORSRule>
</CORSConfiguration>
```
**效果如下：**
![](https://i.imgur.com/opKaj1b.png)
