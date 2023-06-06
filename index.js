const cron = require("node-cron");
const express = require("express");
let nodemailer = require("nodemailer");
const request = require('request');
const config = require('./config.json')
const MAIL_USERNAME = config['MAIL_USERNAME']
const MAIL_PASSWORD = config['MAIL_PASSWORD']
const MAIL_RECEIVERS = config['MAIL_RECEIVERS']

app = express();

const sign = async () => {
    try {
        const options = {
            url: 'http://106.52.253.76/dxghrest/wxGdAct/actUserSign',
            form: {actLogId: 1},
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Content-Length': '10',
                'Host': '106.52.253.76',
                'Origin': 'http://106.52.253.76',
                'Pragma': 'no-cache',
                'Referer': 'http://106.52.253.76/gdAct/pages/gdAct/sign?actLogId=1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.57',
                'code': '3216775d-c3dd-48b8-9b4a-77f898d6890d',
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'userAccount': '13302331556',
            },
        }
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                sendMail(body)
            }
        }
        request.post(options, callback)
    } catch (error) {
        console.log('error', error)
    }
}

const sendMail = async (msg) => {
    try {
        //html 页面内容
        const html = `<h1>${msg}</h1>`;
        let transporter = nodemailer.createTransport({
            host: "smtp.qq.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: MAIL_USERNAME, // generated ethereal user
              pass: MAIL_PASSWORD // generated ethereal password
            }
         });
        let mailOptions = {
                from: '"八段锦打卡结果" 978447419@qq.com', // sender address
                to: MAIL_RECEIVERS, // list of receivers
                subject: msg, // Subject line
                html: html // html body
        };
        transporter.sendMail(mailOptions,(error,info = {})=>{
            if(error){
                console.log(error);
            }else{
                console.log('发送成功')
            }
        });
    } catch (error) {
        console.log('error', error)
    }
}

cron.schedule("10 31 10 * * *", function(){
    console.log("---------------------");
    console.log("Running Cron Job" + new Date());
    sign()
}, {
   timezone: "Asia/Shanghai"
 });

cron.schedule("14 1 16 * * *", function(){
    console.log("---------------------");
    console.log("Running Cron Job" + new Date());
    sign()
}, {
   timezone: "Asia/Shanghai"
 });
app.listen("3128");