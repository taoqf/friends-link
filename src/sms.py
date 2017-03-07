#!/usr/bin/python
# -*- coding: utf-8 -*-
import json, urllib
from urllib import urlencode

#----------------------------------
# 短信API服务调用示例代码 － 聚合数据
# 在线接口文档：http://www.juhe.cn/docs/54
#----------------------------------

def main():

    #配置您申请的APPKey
    appkey = "*********************"

    #1.屏蔽词检查测
    request1(appkey,"GET")

    #2.发送短信
    request2(appkey,"GET")



#屏蔽词检查测
def request1(appkey, m="GET"):
    url = "http://v.juhe.cn/sms/black"
    params = {
        "word" : "", #需要检测的短信内容，需要UTF8 URLENCODE
        "key" : appkey, #应用APPKEY(应用详细页查询)

    }
    params = urlencode(params)
    if m =="GET":
        f = urllib.urlopen("%s?%s" % (url, params))
    else:
        f = urllib.urlopen(url, params)

    content = f.read()
    res = json.loads(content)
    if res:
        error_code = res["error_code"]
        if error_code == 0:
            #成功请求
            print res["result"]
        else:
            print "%s:%s" % (res["error_code"],res["reason"])
    else:
        print "request api error"

#发送短信
def request2(appkey, m="GET"):
    url = "http://v.juhe.cn/sms/send"
    params = {
        "mobile" : "", #接收短信的手机号码
        "tpl_id" : "", #短信模板ID，请参考个人中心短信模板设置
        "tpl_value" : "", #变量名和变量值对。如果你的变量名或者变量值中带有#&amp;=中的任意一个特殊符号，请先分别进行urlencode编码后再传递，&lt;a href=&quot;http://www.juhe.cn/news/index/id/50&quot; target=&quot;_blank&quot;&gt;详细说明&gt;&lt;/a&gt;
        "key" : appkey, #应用APPKEY(应用详细页查询)
        "dtype" : "", #返回数据的格式,xml或json，默认json

    }
    params = urlencode(params)
    if m =="GET":
        f = urllib.urlopen("%s?%s" % (url, params))
    else:
        f = urllib.urlopen(url, params)

    content = f.read()
    res = json.loads(content)
    if res:
        error_code = res["error_code"]
        if error_code == 0:
            #成功请求
            print res["result"]
        else:
            print "%s:%s" % (res["error_code"],res["reason"])
    else:
        print "request api error"



if __name__ == '__main__':
    main()