<template>
  <div class="app-wrapper">
    <!-- <header class="header-container">
      <h1 class="logo">
        <img src="../assets/image/logo.png" alt="">
      </h1>
      <ul  class="right-menu">
        <li >欢迎您，{{username}}</li>
      </ul>
    </header> -->
    <section class="app-main">
      <div class="app-main-cont">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'Layout',
    data() {
      return {
        username: 'youke'
      }
    }
  }
</script>

<style lang="less" scoped>
  .app-wrapper {
    // padding-top: 80px;
    position: relative;
    // height: calc(100vh - 80px);
    height: 100vh;
    width: 100%;
    .header-container{
      height:80px;
      background: url(../assets/image/topbgnew.jpg) center no-repeat;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 99;
      background-size:cover;

      .logo{
        float:left;
        height:100%;
        width:341px;
        line-height: 80px;
        padding-left: 30px;
      }

      .right-menu {
        float: right;
        line-height: 80px;
        &:focus {
          outline: none;
        }

        li {
          display: inline-block;
          font-size: 14px;
          color: #fff;
          margin-right:25px;
          &.hover-effect {
            cursor: pointer;
            transition: background .3s;
            &:hover {
              background: rgba(0, 0, 0, .025);
            }
          }
        }
      }
    }

    .app-main {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: auto;

      .app-main-cont {
        // padding: 24px 36px;
      }
    }
  }
</style>
