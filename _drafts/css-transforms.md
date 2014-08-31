---
title: Computer Graphics 101 for CSS Transforms
layout: post
published: true
permalink: /css-transforms/
categories:
- CSS
---

<style>

.demo {
	padding: 1rem 0;
	background-color: #A5C9B3;
	position: relative;
	height: 20rem;
	margin: 1rem 0;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}

.demo * {
	-webkit-box-sizing: inherit;
	-moz-box-sizing: inherit;
	box-sizing: inherit;
}

.demo:after {
	content: '';
	position: absolute;
	left: -1000%;
	right: -1000%;
	top: 0;
	bottom: 0;
	background-color: #A5C9B3;
	z-index: -1;
}

.box {
	background-color: #AC332F;
	width: 6rem;
	height: 6rem;
	position: absolute;
	left: 50%;
	top: 50%;
	margin-left: -3rem;
	margin-top: -3rem;
	z-index: 2;
	cursor: pointer;
}


@keyframes demo-anim-rotate {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(45deg);
	}
}

@keyframes demo-anim-translate {
	0% {
		transform: translate(0, 0);
	}

	100% {
		transform: translate(5rem, 0);
	}
}

@keyframes demo-anim-skew {
	0% {
		transform: skew(0);
	}

	100% {
		transform: skew(-20deg);
	}
}


.demo-1.active {
	animation: demo-anim-rotate 2s ease forwards;
}

.demo-2.active {
	animation: demo-anim-translate 2s ease forwards;
}

.demo-3.active {
	animation: demo-anim-skew 2s ease forwards;
}

</style>

<div class="demo">
	<h4>rotate(45deg)</h4>
	<div class="box demo-1"></div>
</div>

<div class="demo">
	<h4>translate(5rem, 0)</h4>
	<div class="box demo-2"></div>
</div>

<div class="demo">
	<h4>skew(-20deg)</h2>
	<div class="box demo-3"></div>
</div>

<script>
	var toggleActive = function(e) {
		var el = this;
		if(el.classList) {
			if(el.classList.contains('active')) {
				el.classList.remove('active')
			} else {
				el.classList.add('active');
			}
		}
	};

	var boxes = document.querySelectorAll('.demo .box');
	for(var i = 0; i < boxes.length; i++) {
		boxes[i].addEventListener('click', toggleActive, true);
	}
</script>
<script src="//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js"></script>