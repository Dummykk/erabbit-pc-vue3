<template>
  <footer class="app-footer">
    <div class="top">
      <div class="container">
        <dl>
          <dt>客户服务</dt>
          <dd><i class="iconfont icon-kefu"></i>在线客服</dd>
          <dd><i class="iconfont icon-question"></i>问题反馈</dd>
        </dl>
        <dl>
          <dt>关注我们</dt>
          <dd><i class="iconfont icon-weixin"></i>公众号</dd>
          <dd><i class="iconfont icon-weibo"></i>微博</dd>
        </dl>
        <dl>
          <dt>下载App</dt>
          <dd class="qrcode"><img src="~@/assets/images/qrcode.jpg" /></dd>
          <dd class="download">
            <span>扫描二维码</span>
            <span>立即下载App</span>
            <a href="#">下载页面</a>
          </dd>
        </dl>
        <dl>
          <dt>服务热线</dt>
          <dd class="hotline">
            400-0000-000
            <small>周一至周日 8:00-18:00</small>
          </dd>
        </dl>
      </div>
    </div>
    <div class="bottom">
      <div class="container">
        <div class="slogan">
          <a href="#">
            <i class="iconfont icon-footer01"></i>
            <span>价格亲民</span>
          </a>
          <a href="#">
            <i class="iconfont icon-footer02"></i>
            <span>物流快捷</span>
          </a>
          <a href="#">
            <i class="iconfont icon-footer03"></i>
            <span>品质新鲜</span>
          </a>
        </div>
        <div class="copyright">
          <div class="container">
            <p>
              <a href="#">关于我们</a>
              <a href="#">帮助中心</a>
              <a href="#">售后服务</a>
              <a href="#">配送与验收</a>
              <a href="#">商务合作</a>
              <a href="#">搜索推荐</a>
              <a href="#">友情链接</a>
            </p>
            <p>Copyright © 小兔鲜</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {

}
</script>

<style lang='less' scoped>
.app-footer {
  padding-top: 20px;
  .top {
    display: flex;
    align-items: center;
    height: 290px;
    background-color: #fff;
    .container {
      display: flex;
      dl {
        padding: 0 72px;
        height: 190px;
        border-right: 1px solid #f2f2f2;
        color: #999;
        &:first-child {
          padding-left: 0;
        }
        &:last-child {
          padding-right: 0;
          border-right: none;
        }
        dt {
          text-align: center;
          font-size: 18px;
        }
        dd {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          float: left;
          margin: 24px 5px;
          width: 90px;
          height: 90px;
          border: 1px solid #ededed;
          .iconfont {
            font-size: 36px;
            color: #666;
          }
          &:hover {
            .iconfont {
              color: @xtxColor;
            }
          }
        }
        .download {
          width: 106px;
          border: none;
          a {
            margin-top: 10px;
            width: 106px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            color: #fff;
            background-color: @xtxColor;
          }
        }
        .hotline {
          width: 100%;
          border: none;
          font-size: 20px;
          color: #666;
          small {
            color: #999;
          }
        }
      }
    }
  }
  .bottom {
    height: 348px;
    background-color: #333;
    .slogan {
      display: flex;
      justify-content: space-between;
      padding: 60px 100px;
      border-bottom: 1px solid #434343;
      a {
        color: #fff;
        i {
          margin-right: 10px;
          font-size: 50px;
          vertical-align: middle;
        }
        span {
          font-size: 28px;
          vertical-align: middle;
        }
      }
    }
    .copyright {
      padding-top: 40px;
      height: 170px;
      font-size: 15px;
      color: #999;
      text-align: center;
      .container {
        p {
          margin-bottom: 20px;
          line-height: 1;
          a {
            padding: 0 10px;
            color: #999;
            ~ a {
              border-left: 1px solid #999;
            }
          }
        }
      }
    }
  }
}
</style>
