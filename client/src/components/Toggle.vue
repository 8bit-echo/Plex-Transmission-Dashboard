<template>
  <div class="toggle" id="nav">
    <span>Movies</span>
    <input type="checkbox" id="switch" /><label for="switch">Toggle</label>
    <span>TV Shows</span>
  </div>
</template>

<script>
export default {
  name: 'Toggle'
};
</script>

<style lang="scss" scoped>
.toggle{
  padding: 30px 0;
  width: 200px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
input[type=checkbox]{
	height: 0;
	width: 0;
	visibility: hidden;
  position: absolute;
  left: 50%;
}

label {
	cursor: pointer;
	text-indent: -9999px;
	width: 60px;
	height: 30px;
	background: #3eb3da;
	display: block;
	border-radius: 30px;
	position: relative;
}

label:after {
	content: '';
	position: absolute;
	top: 5px;
	left: 5px;
	width: 20px;
	height: 20px;
	background: #fff;
	border-radius: 50%;
	transition: 0.3s;
}

input:checked + label {
	background: #42b983;
}

input:checked + label:after {
	left: calc(100% - 5px);
	transform: translateX(-100%);
}

label:active:after {
	// width: 130px;
}
</style>