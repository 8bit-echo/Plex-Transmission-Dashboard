<template>
  <nav id="nav">
    <router-link to="/">
      <img src="../assets/search-icon.svg" alt="Search" />
      Search
    </router-link>

    <router-link to="/dashboard">
      <img src="../assets/dashboard-icon.svg" alt="Dashboard" />
      Dashboard
    </router-link>
  </nav>
</template>

<style lang="scss" scoped>
  #nav {
    position: fixed;
    bottom: 0;
    position: fixed;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(30px);
    width: 100%;
    z-index: 3;
    display: flex;
    justify-content: space-evenly;
    padding: 5px 0;

    a {
      font-weight: bold;
      color: #f3f3f3;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      color: grey;
      font-size: 10px;
      width: 33%;

      img {
        width: 30px;
        height: 30px;
        padding-bottom: 4px;
        filter: grayscale(1);
      }

      &.router-link-exact-active {
        color: #e5a00d;

        img {
          filter: grayscale(0);
        }
      }
    }

    // hide nav on the touchscreen device.
    @media screen and (width: 800px) and (height: 480px) {
      display: none;
    }

    @media screen and (width: 375px) and (height: 768px) {
      padding-bottom: 30px !important;
    }
  }
</style>