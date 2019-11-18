<template>
  <nav id="nav">
    <router-link to="/">
      <img
        src="@/assets/search-icon.svg"
        alt="Search"
      >
      Search
    </router-link>

    <router-link to="/dashboard">
      <img
        src="@/assets/dashboard-icon.svg"
        alt="Dashboard"
      >
      Dashboard
    </router-link>

  </nav>
</template>

<style lang="scss" scoped>
  #nav {
    position: absolute;
    bottom: 0;
    position: fixed;
    text-align: center;
    background-color: #222222;
    width: 100%;
    z-index: 3;
    display: flex;
    justify-content: space-evenly;
    padding-bottom: 5px;

    a {
      font-weight: bold;
      color: #f3f3f3;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: baseline;
      box-sizing: border-box;
      color: grey;
      font-size: 12px;
      width: 33%;

      img {
        width: 24px;
        height: 24px;
        margin: 10px;
        filter: grayscale(1);
      }

      &.router-link-exact-active {
        color: #42b983;

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
      padding-bottom: 35px !important;
    }
  }
</style>