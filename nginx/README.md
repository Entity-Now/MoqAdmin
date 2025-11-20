# 合并证书

```
# 按顺序合并证书：服务器证书在前，中间证书在后
cat certificate.crt ca_bundle.crt > full_chain.crt
```